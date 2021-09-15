import React, { useEffect, useState } from "react";
import NewPost from "./NewPost";
import PostList from "./PostList";
import { Button } from "antd";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import * as types from "../utilities/types";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { setDisplayId } from "../redux/slices/userSlice";
import { UserName } from "./UserName";

enum FeedTypes {
  MY_FEED,
  MY_POSTS,
  DISCOVER,
  DISPLAY_ID_POSTS,
}

const Feed = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.user.id);
  const displayId = useAppSelector((state) => state.user.displayId);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [feedType, setFeedType] = useState<FeedTypes>(FeedTypes.DISCOVER);
  const [showDisplayIdNav, setShowDisplayIdNav] = useState<boolean>(false);

  const users: Record<types.HexString, types.User> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );
  const user: types.User = displayId
    ? users[displayId]
    : { fromId: "unknown", blockNumber: 0, blockIndex: 0, batchIndex: 0 };

  const feedNavClassName = (navItemType: FeedTypes) =>
    feedType === navItemType
      ? "Feed__navigationItem Feed__navigationItem--active"
      : "Feed__navigationItem";

  const resetFeed = () => {
    userId && dispatch(setDisplayId(userId));
    setShowDisplayIdNav(false);
    setFeedType(FeedTypes.DISCOVER);
  };

  useEffect(() => {
    if (!(userId && displayId && displayId !== userId)) return;
    setShowDisplayIdNav(true);
  }, [userId, displayId]);

  useEffect(() => {
    showDisplayIdNav && setFeedType(FeedTypes.DISPLAY_ID_POSTS);
  }, [showDisplayIdNav, displayId]);

  return (
    <div className="Feed__block">
      <div className="Feed__header">
        <nav className="Feed__navigation">
          {showDisplayIdNav && (
            <>
              <div className="Feed__backArrow" onClick={() => resetFeed()}>
                <ArrowLeftOutlined />
              </div>
              <div
                className={feedNavClassName(FeedTypes.DISPLAY_ID_POSTS)}
                onClick={() => setFeedType(FeedTypes.DISPLAY_ID_POSTS)}
              >
                <UserName user={user} />
                's Posts
              </div>
              <div className="Feed__navigationSpacer"></div>
            </>
          )}
          <div
            className={feedNavClassName(FeedTypes.DISCOVER)}
            onClick={() => setFeedType(FeedTypes.DISCOVER)}
          >
            Discover
          </div>
          <div className="Feed__navigationSpacer"></div>
          <div
            className={feedNavClassName(FeedTypes.MY_FEED)}
            onClick={() => setFeedType(FeedTypes.MY_FEED)}
          >
            My Feed
          </div>
          <div className="Feed__navigationSpacer"></div>
          <div
            className={feedNavClassName(FeedTypes.MY_POSTS)}
            onClick={() => setFeedType(FeedTypes.MY_POSTS)}
          >
            My Posts
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
        {isModalOpen && (
          <NewPost
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </div>
      <PostList feedType={feedType} />
    </div>
  );
};
export default Feed;
