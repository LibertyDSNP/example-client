import { FeedItem, Graph, HexString, Profile } from "../utilities/types";
import * as fakesdk from "./fakesdk";
import { setConfig, core } from "@dsnp/sdk";
import { Publication } from "@dsnp/sdk/core/contracts/publisher";
import { providers } from "ethers";
import { keccak256 } from "web3-utils";
import { addFeedItem, clearFeedItems } from "../redux/slices/feedSlice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { Store } from "./Storage";
import { ActivityPub } from "@dsnp/sdk/core/activityPub";
import {
  BroadcastAnnouncement,
  AnnouncementType,
  SignedBroadcastAnnouncement,
} from "@dsnp/sdk/core/announcements";
import { BatchPublicationCallbackArgs } from "@dsnp/sdk/core/contracts/subscription";
import { WalletType } from "./wallets/wallet";
import torusWallet from "./wallets/torus";

interface BatchFileData {
  url: URL;
  hash: HexString;
}

type Dispatch = ThunkDispatch<any, Record<string, any>, AnyAction>;

export const getSocialIdentity = async (
  walletAddress: HexString
): Promise<HexString> => {
  let socialAddress: HexString = await fakesdk.getSocialIdentityfromWalletAddress(
    walletAddress
  );
  if (!socialAddress) {
    socialAddress = await fakesdk.createSocialIdentityfromWalletAddress(
      walletAddress
    );
  }
  return socialAddress;
};

export const getGraph = async (socialAddress: HexString): Promise<Graph> => {
  const graph = await fakesdk.getGraphFromSocialIdentity(socialAddress);
  if (!graph) throw new Error("Invalid Social Identity Address");
  return graph;
};

export const getProfile = async (
  socialAddress: HexString
): Promise<Profile> => {
  const profile = await fakesdk.getProfileFromSocialIdentity(socialAddress);
  if (!profile) throw new Error("Invalid Social Identity Address");
  return profile;
};

export const sendPost = async (post: FeedItem): Promise<void> => {
  if (!post.content) return;

  const hash = await storeActivityPub(post.content);
  const announcement = await buildAndSignAnnouncement(hash);

  const batchData = await core.batch.createFile(hash + ".parquet", [
    announcement,
  ]);

  const publication = buildPublication(batchData);

  await core.contracts.publisher.publish([publication]);
};

export const startPostSubscription = (
  dispatch: ThunkDispatch<any, Record<string, any>, AnyAction>
): void => {
  dispatch(clearFeedItems());
  core.contracts.subscription.subscribeToBatchPublications(
    handleBatchAnnouncement(dispatch),
    {
      announcementType: core.announcements.AnnouncementType.Broadcast,
    }
  );
};

export const setupProvider = (walletType: WalletType): void => {
  let eth;

  console.log("setup provider: wallet type:", walletType);
  if (walletType === WalletType.TORUS) {
    console.log("torusWallet Web3", torusWallet.getWeb3().currentProvider);
    const global: any = window;
    eth = torusWallet.getWeb3().currentProvider;
    global.torus = torusWallet;
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

const buildPublication = (batchData: BatchFileData): Publication => {
  return {
    announcementType: core.announcements.AnnouncementType.Broadcast,
    fileUrl: batchData.url.toString(),
    fileHash: "0x" + batchData.hash,
  };
};

const dispatchFeedItem = (
  dispatch: Dispatch,
  message: BroadcastAnnouncement,
  activityPub: ActivityPub,
  blockNumber: number
) => {
  const decoder = new TextDecoder();

  dispatch(
    addFeedItem({
      fromAddress: decoder.decode((message.fromId as any) as Uint8Array),
      blockNumber: blockNumber,
      hash: decoder.decode((message.contentHash as any) as Uint8Array),
      timestamp: new Date().getTime(),
      uri: decoder.decode((message.url as any) as Uint8Array),
      content: {
        "@context": "https://www.w3.org/ns/activitystreams",
        type: "Note",
        actor: "actor",
        content: activityPub.content || "",
      },
    })
  );
};

const handleBatchAnnouncement = (dispatch: Dispatch) => (
  announcement: BatchPublicationCallbackArgs
) => {
  core.batch
    .openURL((announcement.fileUrl.toString() as any) as URL)
    .then((reader: any) =>
      core.batch.readFile(reader, (announcementRow: AnnouncementType) => {
        const message = (announcementRow as unknown) as BroadcastAnnouncement;
        const decoder = new TextDecoder();

        const url = decoder.decode((message.url as any) as Uint8Array);
        fetch(url)
          .then((res) => res.json())
          .then((activityPub) =>
            dispatchFeedItem(
              dispatch,
              message,
              activityPub,
              announcement.blockNumber
            )
          )
          .catch((err) => console.log(err));
      })
    );
};

const storeActivityPub = async (content: ActivityPub): Promise<string> => {
  const hash = keccak256(core.activityPub.serialize(content));

  await fetch(
    `${process.env.REACT_APP_UPLOAD_HOST}/upload?filename=${encodeURIComponent(
      hash + ".json"
    )}`,
    {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(content),
    }
  );
  return hash;
};

const buildAndSignAnnouncement = async (
  hash: string
): Promise<SignedBroadcastAnnouncement> => ({
  ...core.announcements.createBroadcast(
    "0x1111",
    `${process.env.REACT_APP_UPLOAD_HOST}/${hash}.json`,
    hash
  ),
  signature: "0x00000000", // TODO: call out to wallet to get this signed
});
