import React from "react";
import Post from "./Post";
import { FeedItem } from "../utilities/types";
import { useAppSelector } from "../redux/hooks";

const PostList: React.FC = () => {
  const feed: FeedItem[] = useAppSelector((state) => state.feed.feed).filter(
    (post) => post?.content?.type === "Note"
  );

  const postList = feed
    .slice(0)
    .reverse()
    .map((feedItem) => <Post feedItem={feedItem} />);

  return (
    <div className="PostList__block">
      {feed.length > 0 ? postList : "Empty Feed!"}
    </div>
  );
};
export default PostList;
