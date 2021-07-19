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
    (graph) => graph.socialAddress === profile?.socialAddress
  );
  const feed: FeedItem<ActivityContentNote>[] = useAppSelector(
    (state) => state.feed.feed
  ).filter((post) => post?.content?.type === "Note");
  const profiles: Record<HexString, Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );
  let currentFeed: FeedItem<ActivityContentNote>[] = [];

  if (feedType === FeedTypes.FEED) {
    const addrSet = profile?.socialAddress
      ? { [profile.socialAddress]: true }
      : {};
    myGraph?.following.forEach((addr) => (addrSet[addr] = true));
    currentFeed = feed.filter((post) => post?.fromAddress in addrSet);
  } else if (feedType === FeedTypes.MY_POSTS) {
    currentFeed = feed.filter(
      (post) => profile?.socialAddress === post?.fromAddress
    );
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
              const namedPost = {
                ...post,
                fromAddress: profiles[post.fromAddress]
                  ? profiles[post.fromAddress].name
                  : post.fromAddress,
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
