import React, { useState } from "react";
import PostList from "./PostList";
import { Button } from "antd";
import { useAppSelector } from "../redux/hooks";

enum FeedTypes {
  FEED,
  MY_POSTS,
  ALL_POSTS,
}

const Feed = (): JSX.Element => {
  const userId = useAppSelector((state) => state.user.id);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [feedType, setFeedType] = useState<FeedTypes>(FeedTypes.FEED);

  const feedNavClassName = (navItemType: number) =>
    feedType === navItemType
      ? "Feed__navigationItem Feed__navigationItem--active"
      : "Feed__navigationItem";

  return (
    <div className="Feed__block">
      <div className="Feed__header">
        <nav className="Feed__navigation">
          <div
            className={feedNavClassName(0)}
            onClick={() => setFeedType(FeedTypes.FEED)}
          >
            Feed
          </div>
          <div className="Feed__navigationSpacer"></div>
          <div
            className={feedNavClassName(1)}
            onClick={() => setFeedType(FeedTypes.MY_POSTS)}
          >
            My Posts
          </div>
          <div className="Feed__navigationSpacer"></div>
          <div
            className={feedNavClassName(2)}
            onClick={() => setFeedType(FeedTypes.ALL_POSTS)}
          >
            All Posts
          </div>
        </nav>
        {userId && (
          <Button
            className="Feed__newPostButton"
            onClick={() => setIsModalOpen(true)}
          >
            New Post
          </Button>
        )}
      </div>
      <PostList feedType={feedType} />
    </div>
  );
};
export default Feed;
