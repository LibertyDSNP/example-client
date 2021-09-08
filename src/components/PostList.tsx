import React from "react";
import Post from "./Post";
import { FeedItem } from "../utilities/types";
import { useAppSelector } from "../redux/hooks";
import {
  RelationshipState,
  RelationshipStatus,
} from "../redux/slices/graphSlice";
import BlankPost from "./BlankPost";

enum FeedTypes {
  MY_FEED,
  MY_POSTS,
  DISCOVER,
  DISPLAY_ID_POSTS,
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
  const userId: string | undefined = useAppSelector((state) => state.user.id);
  const displayId: string | undefined = useAppSelector(
    (state) => state.user.displayId
  );
  const myGraph: Record<string, RelationshipState> = useAppSelector(
    (state) => (userId && state.graphs.following[userId]) || {}
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
      (post) =>
        post.fromId === userId ||
        myGraph[post.fromId]?.status === RelationshipStatus.FOLLOWING
    );
  } else if (feedType === FeedTypes.MY_POSTS) {
    currentFeed = feed.filter((post) => userId === post?.fromId);
  } else if (feedType === FeedTypes.DISPLAY_ID_POSTS) {
    currentFeed = feed.filter((post) => displayId === post?.fromId);
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
