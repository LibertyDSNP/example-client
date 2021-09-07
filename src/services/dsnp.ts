import { HexString } from "../utilities/types";
import { setConfig, createRegistration, core } from "@dsnp/sdk";
import { RegistryUpdateLogData } from "@dsnp/sdk/core/contracts/registry";
import { providers } from "ethers";
import { Store } from "./Storage";
import {
  BroadcastAnnouncement,
  AnnouncementType,
  SignedBroadcastAnnouncement,
  SignedReplyAnnouncement,
  GraphChangeAnnouncement,
  SignedProfileAnnouncement,
  SignedAnnouncement,
  SignedGraphChangeAnnouncement,
} from "@dsnp/sdk/core/announcements";
import { BatchPublicationLogData } from "@dsnp/sdk/core/contracts/subscription";
import { WalletType } from "./wallets/wallet";
import torusWallet from "./wallets/torus";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";

//
// DSNP Package
// This package is a wrapper around the DSNP SDK that provides example-client specific functionality.
//

//
// Parameter types
//

type RegistryUpdateHandler = (update: RegistryUpdateLogData) => void;

type BatchAnnouncementHandler = (announcment: BatchPublicationLogData) => void;

type AnnouncementRowHandler = (
  announcementRow: SignedAnnouncement,
  batchIndex: number
) => void;

export type UnsubscribeFunction = () => void;

//
// Exported Functions
//

/**
 * setupProvider initializes the DSNP sdk with an ethereum provider.
 * This function must be called with a Metamask or Torus WalletType before
 * any other DSNP functionality is used (including subscriptions).
 * @param walletType which wallet plugin we should use to retrieve the chain provider.
 * @throws if walletType is unrecognized or wallet plugin cannot supply a provider.
 */
export const setupProvider = (walletType: WalletType): void => {
  let eth;

  if (walletType === WalletType.TORUS) {
    eth = torusWallet.getWeb3().currentProvider;
  } else if (walletType === WalletType.METAMASK) {
    const global: any = window;
    eth = global.ethereum;

    if (!eth) {
      throw new Error(
        "Could not create provider, because ethereum has not been set"
      );
    }
  } else {
    throw new Error(
      `Unknown walletType attempting to setup provider: ${walletType}`
    );
  }

  const provider = new providers.Web3Provider(eth);
  setConfig({
    provider: provider,
    signer: provider.getSigner(),
    store: new Store(),
  });
};

/**
 * getSocialIdentities looks up all DSNP registrations for a given wallet address.
 * @param walletAddress address of an on-chain account.
 * @return all DSNP registration (DSNP id and handle) for which the given address is authorized to sign.
 */
export const getSocialIdentities =
  core.contracts.registry.getRegistrationsByWalletAddress;

/**
 * createNewDSNPRegistration creates a new DSNP identity for a given wallet address.
 * This function will register a new DSNP Id with the provided handle and then delegate authority
 * to managed the Id to the owner of the provided wallet address.
 * @param addr address of an on-chain account
 * @param handle handle to be registered with the new Id.
 * @returns the DSNPUserURI for the new account.
 * @throws if registration fails for any reason, or the handle is already registered.
 */
export const createNewDSNPRegistration = createRegistration;

/**
 * startSubscriptions starts listenting for DNSP publication events and DSNP registration change
 * events. The subscriptions start with all previous events which will be immediately emitted to
 * the handlers, and then will continue listening for new events until the returned unsubscribe
 * function is called.
 * @param batchHandler a function called when a batch announcement is made on chain.
 * @param registryHandler a function called when a DSNP registration is made or changed.
 * @returns an unsubscribe function that will stop the subscriptions when called.
 */
export const startSubscriptions = async (
  batchHandler: BatchAnnouncementHandler,
  registryHandler: RegistryUpdateHandler
): Promise<UnsubscribeFunction> => {
  // subscribe to all announcements
  const unsubscribeToBatchPublications = await core.contracts.subscription.subscribeToBatchPublications(
    (announcement: BatchPublicationLogData) => {
      batchHandler(announcement);
    },
    { fromBlock: 1 }
  );

  // subscribe to registry events
  const unsubscribeToRegistryUpdate = await core.contracts.subscription.subscribeToRegistryUpdates(
    (announcement: RegistryUpdateLogData) => {
      registryHandler(announcement);
    },
    { fromBlock: 1 }
  );

  return () => {
    unsubscribeToRegistryUpdate();
    unsubscribeToBatchPublications();
  };
};

/**
 * Load a DSNP batch file from a url in a batch announcment, parse it, and emit all rows in the batch
 * to the given handler.
 * @param batchAnnouncement batch announcment that specifies where to retrieve the batch file.
 * @param rowHandler handler function that receives all rows from the batch.
 * @throwss if batch cannot be read.
 */
export const readBatchFile = async (
  batchAnnouncement: BatchPublicationLogData,
  rowHandler: AnnouncementRowHandler
): Promise<void> => {
  let batchIndex = 0;
  const reader = await core.batch.openURL(
    (batchAnnouncement.fileUrl.toString() as any) as URL
  );
  await core.batch.readFile(reader, (announcementRow: SignedAnnouncement) =>
    rowHandler(announcementRow, batchIndex++)
  );
};

/**
 * isGraphChangeAnnouncment returns whether the provided object is likely a GraphChangeAnnouncment
 * @param obj any object
 * @returns true if object appears to be a graph change announcment
 */
export const isGraphChangeAnnouncement = (
  obj: unknown
): obj is GraphChangeAnnouncement => {
  return (
    (obj as Record<string, unknown>)["announcementType"] ===
    AnnouncementType.GraphChange
  );
};

/**
 * isBroadcastAnnouncment returns whether the provided object is likely a BroadcastAnnouncment
 * @param obj any object
 * @returns true if object appears to be a broadcast announcment
 */
export const isBroadcastAnnouncement = (
  obj: unknown
): obj is BroadcastAnnouncement => {
  const type = (obj as Record<string, unknown>)["announcementType"];
  return (
    type === AnnouncementType.Profile ||
    type === AnnouncementType.Broadcast ||
    type === AnnouncementType.Reply
  );
};

/**
 * batchAnnouncment takes a single announcement, creates a batch file
 * containing it in the store, and then publishes the batch on chain.
 * @param filename name used to store the parquet file in the store
 * @param announcement annoucement to batch and publish
 */
export const batchAnnouncement = async (
  filename: string,
  announcement: SignedAnnouncement
): Promise<void> => {
  const batchData = await core.batch.createFile(filename, [announcement]);

  await core.contracts.publisher.publish([
    {
      announcementType: core.announcements.AnnouncementType.Broadcast,
      fileUrl: batchData.url.toString(),
      fileHash: batchData.hash,
    },
  ]);
};

/**
 * Creates a signed post announcement.
 * Note that the provider's active signing address must be an authorized
 * delegate for the DSNP account specified by from id for this to be valid.
 * @param fromId DSNP id of the user sending the post
 * @param url location of the post's activity content
 * @param hash has of the post's activity content
 * @returns a signed announcement ready for inclusion in a batch
 */
export const buildAndSignPostAnnouncement = async (
  fromId: DSNPUserId,
  url: string,
  hash: string
): Promise<SignedBroadcastAnnouncement> =>
  core.announcements.sign(
    core.announcements.createBroadcast(
      core.identifiers.convertToDSNPUserURI(fromId),
      url,
      hash
    )
  );

/**
 * Creates a signed reply announcement.
 * Note that the provider's active signing address must be an authorized
 * delegate for the DSNP account specified by from id for this to be valid.
 * @param fromId DSNP id of the user sending the reply
 * @param inReplyTo signature of the post to which this post is a response
 * @param url location of the reply's activity content
 * @param hash has of the reply's activity content
 * @returns a signed announcement ready for inclusion in a batch
 */
export const buildAndSignReplyAnnouncement = async (
  fromId: HexString,
  inReplyTo: HexString,
  url: string,
  hash: string
): Promise<SignedReplyAnnouncement> =>
  core.announcements.sign(
    core.announcements.createReply(fromId, url, hash, inReplyTo)
  );

/**
 * Creates a signed profile announcement.
 * Note that the provider's active signing address must be an authorized
 * delegate for the DSNP account specified by from id for this to be valid.
 * @param fromId DSNP id of the profiled user
 * @param url location of the profile's activity content
 * @param hash has of the profile's activity content
 * @returns a signed announcement ready for inclusion in a batch
 */
export const buildAndSignProfile = async (
  fromId: DSNPUserId,
  url: string,
  hash: string
): Promise<SignedProfileAnnouncement> =>
  core.announcements.sign(
    core.announcements.createProfile(
      core.identifiers.convertToDSNPUserURI(fromId),
      url,
      hash
    )
  );

/**
 * Creates a signed follow announcement.
 * Note that the provider's active signing address must be an authorized
 * delegate for the DSNP account specified by from id for this to be valid.
 * @param fromId DSNP Id of user doing the following
 * @param followee DSNP Id of user being followed
 * @returns a signed announcement ready for inclusion in a batch
 */
export const buildAndSignFollowAnnouncement = async (
  fromId: DSNPUserId,
  followee: DSNPUserId
): Promise<SignedGraphChangeAnnouncement> =>
  core.announcements.sign(
    core.announcements.createFollowGraphChange(
      core.identifiers.convertToDSNPUserURI(fromId),
      core.identifiers.convertToDSNPUserURI(followee)
    )
  );

/**
 * Creates a signed unfollow announcement.
 * Note that the provider's active signing address must be an authorized
 * delegate for the DSNP account specified by from id for this to be valid.
 * @param fromId DSNP Id of user doing the unfollowing
 * @param followee DSNP Id of user being unfollowed
 * @returns a signed announcement ready for inclusion in a batch
 */
export const buildAndSignUnfollowAnnouncement = async (
  fromId: DSNPUserId,
  followee: DSNPUserId
): Promise<SignedGraphChangeAnnouncement> =>
  core.announcements.sign(
    core.announcements.createUnfollowGraphChange(
      core.identifiers.convertToDSNPUserURI(fromId),
      core.identifiers.convertToDSNPUserURI(followee)
    )
  );
