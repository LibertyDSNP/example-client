import React, { useState } from "react";
import NewPost from "./NewPost";
import PostList from "./PostList";
import { Button } from "antd";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import * as types from "../utilities/types";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { setDisplayId } from "../redux/slices/userSlice";

enum FeedTypes {
  MY_FEED,
  MY_POSTS,
  DISCOVER,
  PROFILE_POSTS,
}

const Feed = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.user.id);
  const displayId = useAppSelector((state) => state.user.displayId);

  const profiles: Record<types.HexString, types.Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );
  const profile: types.Profile | undefined = displayId
    ? profiles[displayId]
    : undefined;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [feedType, setFeedType] = useState<FeedTypes>(FeedTypes.DISCOVER);

  const feedNavClassName = (navItemType: FeedTypes) =>
    feedType === navItemType
      ? "Feed__navigationItem Feed__navigationItem--active"
      : "Feed__navigationItem";

  return (
    <div className="Feed__block">
      <div className="Feed__header">
        <nav className="Feed__navigation">
          {userId && displayId && displayId !== userId && (
            <>
              <div
                className="Feed__backArrow"
                onClick={() => dispatch(setDisplayId(BigInt(userId)))}
              >
                <ArrowLeftOutlined />
              </div>
              <div className={feedNavClassName(FeedTypes.PROFILE_POSTS)}>
                {profile?.name || profile?.handle}'s Posts
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
