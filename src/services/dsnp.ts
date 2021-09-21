import { setConfig, createRegistration, core } from "@dsnp/sdk";
import { RegistryUpdateLogData } from "@dsnp/sdk/core/contracts/registry";
import { providers } from "ethers";
import {
  SignedBroadcastAnnouncement,
  SignedReplyAnnouncement,
  SignedProfileAnnouncement,
  SignedAnnouncement,
  SignedGraphChangeAnnouncement,
} from "@dsnp/sdk/core/announcements";
import { BatchPublicationLogData } from "@dsnp/sdk/core/contracts/subscription";
import { DSNPUserId } from "@dsnp/sdk/core/identifiers";
import { ConfigOpts } from "@dsnp/sdk/core/config";
import { HexString } from "@dsnp/sdk/types/Strings";
import { Store } from "./Storage";
import { WalletType } from "./wallets/wallet";
import torusWallet from "./wallets/torus";
import { UnsubscribeFunction } from "@dsnp/sdk/core/contracts/utilities";

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

//
// Internal Helper Functions
//

/**
 * getChainSpecificConfig builds the configuration for specific chains
 * @param chainId - The ID of the chain being used
 * @returns the partial config to spread into the setConfig method
 */
const getChainSpecificConfig = (chainId: number): Partial<ConfigOpts> => {
  switch (chainId) {
    case 4: // Rinkeby
      return {
        dsnpStartBlockNumber: 9211311,
        contracts: {
          Publisher: "0xeF7B5d418128fB8C1645Dd31270BE2cCAF9015e4",
          Beacon: "0xe3B7Fb9c43F9E62910Ae2763AA64aec07ec8F308",
          BeaconFactory: "0xC1F8593D46356B98c5DC7f7E8DF35247A68ED7D8",
          Identity: "0xa067CEa2859d27CA83700c7E17414f111C1BF561",
          IdentityCloneFactory: "0xDf962f3C24863A0fb8fb77B3144E31fE2859b9B8",
          Registry: "0x5d8266342aAfe19CB8EC25A6637f385893389A35",
        },
      };
    case 3: // Ropsten
      return {
        dsnpStartBlockNumber: 10959123,
        contracts: {
          Publisher: "0x9828b9c8E8863267508eB0235370Eb26914D6a78",
          Beacon: "0x307748fF8c3547a6768B0CD37c1b0F35fFB0ca47",
          BeaconFactory: "0x024a03CFE1e8EE563382C08C1aB359830c39Cf20",
          Identity: "0x33707b57CE4Af9f970fb04a4D6CFF15B8342D938",
          IdentityCloneFactory: "0x61F57538a2621Dd2ba36E513e11cDe4f5936bCe9",
          Registry: "0xEBF48cE1EE0e727C2E23cb977799B93fD2EbFfda",
        },
      };
    default:
      // Allow the SDK to search for the correct contracts
      return {};
  }
};

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
export const setupProvider = async (walletType: WalletType): Promise<void> => {
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
  const signer = provider.getSigner();
  const chainId = await signer.getChainId();

  setConfig({
    provider,
    signer,
    store: new Store(),
    ...getChainSpecificConfig(chainId),
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
    { fromBlock: "dsnp-start-block" }
  );

  // subscribe to registry events
  const unsubscribeToRegistryUpdate = await core.contracts.subscription.subscribeToRegistryUpdates(
    (announcement: RegistryUpdateLogData) => {
      registryHandler(announcement);
    },
    { fromBlock: "dsnp-start-block" }
  );

  return () => {
    unsubscribeToRegistryUpdate();
    unsubscribeToBatchPublications();
  };
};

/**
 * Load a DSNP batch file from a url in a batch announcement, parse it, and emit all rows in the batch
 * to the given handler.
 * @param batchAnnouncement batch announcement that specifies where to retrieve the batch file.
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
 * batchAnnouncement takes a single announcement, creates a batch file
 * containing it in the store, and then publishes the batch on chain.
 * @param filename name used to store the parquet file in the store
 * @param announcement announcement to batch and publish
 */
export const batchAnnouncement = async (
  filename: string,
  announcement: SignedAnnouncement
): Promise<void> => {
  const batchData = await core.batch.createFile(filename, [announcement]);

  await core.contracts.publisher.publish([
    {
      announcementType: announcement.announcementType,
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
  fromId: HexString,
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
