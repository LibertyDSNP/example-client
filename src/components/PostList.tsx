import React from "react";
import Post from "./Post";
import { FeedItem } from "../utilities/types";
import { useAppSelector } from "../redux/hooks";
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
  const myGraph: Record<DSNPUserId, boolean> = useAppSelector(
    (state) => (userId ? state.graphs.following[userId] : undefined) || {}
  );
  const feed: FeedItem[] = useAppSelector((state) => state.feed.feed).filter(
    (post) => post?.content?.type === "Note" && post?.inReplyTo === undefined
  );
  let currentFeed: FeedItem[] = [];

  if (feedType === FeedTypes.FEED) {
    currentFeed = feed.filter((post) => post?.fromId in myGraph);
  } else if (feedType === FeedTypes.MY_POSTS) {
    currentFeed = feed.filter((post) => userId === post?.fromId);
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
