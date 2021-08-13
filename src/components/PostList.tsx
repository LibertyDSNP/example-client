import React from "react";
import Post from "./Post";
import { FeedItem, Graph } from "../utilities/types";
import { useAppSelector } from "../redux/hooks";
import { ActivityContentNote } from "@dsnp/sdk/core/activityContent";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";

enum FeedTypes {
  FEED,
  MY_POSTS,
  ALL_POSTS,
}

interface PostListProps {
  feedType: FeedTypes;
}

const PostList = ({ feedType }: PostListProps): JSX.Element => {
  const userId: DSNPUserId | undefined = useAppSelector(
    (state) => state.user.id
  );
  const graph: Graph[] = useAppSelector((state) => state.graphs.graphs);
  const myGraph: Graph | undefined = graph.find(
    (graph) => graph.socialAddress === userId
  );
  const feed: FeedItem<ActivityContentNote>[] = useAppSelector(
    (state) => state.feed.feed
  ).filter(
    (post) => post?.content?.type === "Note" && post?.inReplyTo === undefined
  );
  let currentFeed: FeedItem<ActivityContentNote>[] = [];

  if (feedType === FeedTypes.FEED) {
    const addrSet = userId ? { [userId]: true } : {};
    myGraph?.following.forEach((addr) => (addrSet[addr] = true));
    currentFeed = feed.filter((post) => post?.fromAddress in addrSet);
  } else if (feedType === FeedTypes.MY_POSTS) {
    currentFeed = feed.filter((post) => userId === post?.fromAddress);
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
            .map((post, index) => (
              <Post key={index} feedItem={post} />
            ))}
        </>
      ) : (
        "Empty Feed!"
      )}
    </div>
  );
};
export default PostList;
