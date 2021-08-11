import React from "react";
import Post from "./Post";
import { FeedItem, Graph, Profile } from "../utilities/types";
import { useAppSelector } from "../redux/hooks";
import { HexString } from "@dsnp/sdk/dist/types/types/Strings";
import { ActivityContentNote } from "@dsnp/sdk/core/activityContent";

enum FeedTypes {
  FEED,
  MY_POSTS,
  ALL_POSTS,
}

interface PostListProps {
  feedType: FeedTypes;
}

const PostList = ({ feedType }: PostListProps): JSX.Element => {
  const profile: Profile | undefined = useAppSelector(
    (state) => state.user.profile
  );
  const graph: Graph[] = useAppSelector((state) => state.graphs.graphs);
  const myGraph: Graph | undefined = graph.find(
    (graph) => graph.dsnpUserId === profile?.dsnpUserId
  );
  const feed: FeedItem<ActivityContentNote>[] = useAppSelector(
    (state) => state.feed.feed
  ).filter(
    (post) => post?.content?.type === "Note" && post?.inReplyTo === undefined
  );
  const profiles: Record<HexString, Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );
  let currentFeed: FeedItem<ActivityContentNote>[] = [];

  if (feedType === FeedTypes.FEED) {
    const addrSet = profile?.dsnpUserId ? { [profile.dsnpUserId]: true } : {};
    myGraph?.following.forEach((addr) => (addrSet[addr] = true));
    currentFeed = feed.filter((post) => post?.fromId in addrSet);
  } else if (feedType === FeedTypes.MY_POSTS) {
    currentFeed = feed.filter((post) => profile?.dsnpUserId === post?.fromId);
  } else {
    currentFeed = feed;
  }

  return (
    <div className="PostList__block">
      {currentFeed.length > 0 ? (
        <>
          {currentFeed
            .slice(0)
            .reverse()
            .map((post, index) => {
              if (!post.fromId) throw new Error(`no fromId in post: ${post}`);
              const fromId: string = profiles[post.fromId]
                ? (profiles[post.fromId].name as string)
                : post.fromId;

              const namedPost: FeedItem<ActivityContentNote> = {
                ...post,
                fromId,
              };
              return <Post key={index} feedItem={namedPost} />;
            })}
        </>
      ) : (
        "Empty Feed!"
      )}
    </div>
  );
};
export default PostList;
