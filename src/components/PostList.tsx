import React from "react";
import Post from "./Post";
import { FeedItem, Graph, Profile } from "../utilities/types";
import { useAppSelector } from "../redux/hooks";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import { ActivityContentNote } from "@dsnp/sdk/core/activityContent";
import Masonry from "react-masonry-css";

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
    currentFeed = feed.filter(
      (post) => post?.fromId === userId || post?.fromId in myGraph
    );
  } else if (feedType === FeedTypes.MY_POSTS) {
    currentFeed = feed.filter((post) => userId === post?.fromId);
  } else {
    currentFeed = feed;
  }

  currentFeed.sort(function (a, b) {
    return a.timestamp - b.timestamp;
  });

  const items = currentFeed
    .slice(0)
    .reverse()
    .map((post, index) => {
      if (!post.fromAddress) throw new Error(`no fromAddress in post: ${post}`);
      const namedPost: FeedItem = {
        ...post,
        tags: ["#foodee"],
      };
      return <Post key={index} feedItem={namedPost} />;
    });

  return (
    <Masonry
      breakpointCols={3}
      className="PostList__block"
      columnClassName="PostList__blockColumn"
    >
      {items}
    </Masonry>
  );
};
export default PostList;
