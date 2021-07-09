import { Graph, HexString, Profile } from "../utilities/types";
import * as fakesdk from "./fakesdk";
import { setConfig, core } from "@dsnp/sdk";
import { providers } from "ethers";
import { addFeedItem } from "../redux/slices/feedSlice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { generateHash } from "@dsnp/test-generators";

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

export const sendPost = async (): Promise<void> => {
  // TODO: send post should take a feed item, use sdk.broadcast to sign it and
  // TODO: create a message for inclusion in a batch. It then needs to add it to
  // TODO: a parquetjs file, put it somewhere it is publically available and then
  // TODO: call the method below to announce the batch.
  const contentHash = generateHash();
  const announcement = {
    dsnpType: core.messages.DSNPType.Broadcast,
    uri: `https://example.com/${contentHash}`,
    hash: contentHash,
  };
  const transaction = await core.contracts.announcement.batch([announcement]);
  console.log("Post response", transaction);
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
  });

  core.contracts.subscription.subscribeToBatchAnnounceEvents((announcement) => {
    console.log("got feed item", announcement);
    dispatch(
      addFeedItem({
        fromAddress: announcement.transactionHash,
        blockNumber: announcement.blockNumber,
        hash: announcement.dsnpHash,
        timestamp: 123456789,
        uri: announcement.dsnpUri,
        content: {
          type: "Note",
          actor: "actor",
          content: "content",
        },
      })
    );
  });
};
