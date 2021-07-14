import { FeedItem, Graph, HexString, Profile } from "../utilities/types";
import * as fakesdk from "./fakesdk";
import { setConfig, core } from "@dsnp/sdk";
import { BroadcastMessage } from "@dsnp/sdk/dist/types/core/messages";
import { providers } from "ethers";
import { keccak256 } from "web3-utils";
import { addFeedItem } from "../redux/slices/feedSlice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { Store } from "./Storage";
import { ActivityPub } from "@dsnp/sdk/dist/types/core/activityPub";
import { Announcement } from "@dsnp/sdk/dist/types/core/contracts/announcement";
import { DSNPMessageSigned } from "@dsnp/sdk/dist/types/core/batch/batchMessages";

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
): Promise<DSNPMessageSigned<BroadcastMessage>> => {
  return {
    signature: "0x00000000", // TODO: call out to wallet to get this signed
    dsnpType: core.messages.DSNPType.Broadcast,
    contentHash: hash,
    fromId: "0x1111", // TODO: disambiguate fromID from public key and set here
    uri: `${process.env.REACT_APP_UPLOAD_HOST}/${hash}.json`,
  };
};

interface BatchFileData {
  url: URL;
  hash: HexString;
}

const buildBatch = (batchData: BatchFileData): Announcement => {
  return {
    dsnpType: core.messages.DSNPType.Broadcast,
    uri: batchData.url.toString(),
    hash: "0x" + batchData.hash,
  };
};

export const sendPost = async (post: FeedItem): Promise<void> => {
  if (!post.content) return;

  const hash = await storeActivityPub(post.content);
  const announcement = await buildAndSignAnnouncement(hash);

  const batchData = await core.batch.createFile(hash + ".parquet", [
    announcement,
  ]);

  const batchAnnouncement = buildBatch(batchData);

  const transaction = await core.contracts.announcement.batch([
    batchAnnouncement,
  ]);

  console.log("Post response", transaction);
};

const dispatchFeedItem = (
  dispatch: ThunkDispatch<any, Record<string, any>, AnyAction>,
  message: BroadcastMessage,
  activityPub: ActivityPub,
  blockNumber: number
) => {
  console.log("DISPATCHING", activityPub);
  const decoder = new TextDecoder();

  dispatch(
    addFeedItem({
      fromAddress: decoder.decode((message.fromId as any) as Uint8Array),
      blockNumber: blockNumber,
      hash: decoder.decode((message.contentHash as any) as Uint8Array),
      timestamp: 123456789,
      uri: decoder.decode((message.uri as any) as Uint8Array),
      content: {
        "@context": "https://www.w3.org/ns/activitystreams",
        type: "Note",
        actor: "actor",
        content: activityPub.content || "",
      },
    })
  );
};

export const startPostSubscription = (
  dispatch: ThunkDispatch<any, Record<string, any>, AnyAction>
): void => {
  const global: any = window;
  const eth = global.ethereum;
  if (!eth) {
    throw new Error(
      "Could not create provider, because ethereum has not been set"
    );
  }

  setConfig({
    provider: new providers.JsonRpcProvider(process.env.RPC_URL),
    signer: new providers.Web3Provider(eth).getSigner(),
    store: new Store(),
  });

  core.contracts.subscription.subscribeToBatchAnnounceEvents((announcement) => {
    core.batch
      .openURL((announcement.dsnpUri.toString() as any) as URL)
      .then((reader) =>
        core.batch.readFile(reader, (announcementRow) => {
          const message = (announcementRow as any) as BroadcastMessage;
          const decoder = new TextDecoder();

          const url = decoder.decode((message.uri as any) as Uint8Array);
          console.log("Fetching activity pub", url);
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
  });
};
