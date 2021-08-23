import React from "react";
import Post from "./Post";
import { FeedItem } from "../utilities/types";
import { useAppSelector } from "../redux/hooks";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import BlankPost from "./BlankPost";

enum FeedTypes {
  MY_FEED,
  MY_POSTS,
  DISCOVER,
}

interface PostListProps {
  feedType: FeedTypes;
}

const sortFeed = (feed: FeedItem[]): FeedItem[] => {
  feed.sort(
    (firstFeedItem: FeedItem, secondFeedItem: FeedItem) =>
      secondFeedItem.blockNumber - firstFeedItem.blockNumber
  );
  return feed;
};

const PostList = ({ feedType }: PostListProps): JSX.Element => {
  const userId: DSNPUserId | undefined = useAppSelector(
    (state) => state.user.id
  );
  const myGraph: Record<DSNPUserId, boolean> = useAppSelector(
    (state) => (userId ? state.graphs.following[userId] : undefined) || {}
  );

  const initialFeed: FeedItem[] = useAppSelector(
    (state) => state.feed.feedItems
  ).filter(
    (post) => post?.content?.type === "Note" && post?.inReplyTo === undefined
  );
  const loading: boolean = useAppSelector(
    (state) => state.feed.isPostLoading.loading
  );

  const feed: FeedItem[] = sortFeed(initialFeed);

  let currentFeed: FeedItem[] = [];

  if (feedType === FeedTypes.MY_FEED) {
    currentFeed = feed.filter(
      (post) => post?.fromId === userId || post?.fromId in myGraph
    );
  } else if (feedType === FeedTypes.MY_POSTS) {
    currentFeed = feed.filter((post) => userId === post?.fromId);
  } else {
    currentFeed = feed;
  }

  return (
    <div className="PostList__block">
      {loading && <BlankPost />}
      {currentFeed.length > 0 ? (
        <>
          {currentFeed.map((post, index) => (
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
