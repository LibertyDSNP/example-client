import React from "react";
import {Button} from "antd";
import {useAppSelector} from "../redux/hooks";

enum FeedTypes {
  FEED,
  MY_POSTS,
  ALL_POSTS,
}

interface FeedNavigationProps {
  feedType: FeedTypes;
  setFeedType: (feedType: FeedTypes) => void;
}

const FeedNavigation = ({
                          feedType,
                          setFeedType,
                        }: FeedNavigationProps): JSX.Element => {
  const userId = useAppSelector((state) => state.user.id);

  const feedNavClassName = (navItemType: number) =>
    feedType === navItemType
      ? "Feed__navigationItem Feed__navigationItem--active"
      : "Feed__navigationItem";

  return (
    <div className="Feed__block">
      <div className="Feed__header">
        <nav className="Feed__navigation">
          <div
            className={feedNavClassName(2)}
            onClick={() => setFeedType(FeedTypes.ALL_POSTS)}
          >
            All Posts
          </div>
          <div
            className={feedNavClassName(0)}
            onClick={() => setFeedType(FeedTypes.FEED)}
          >
            Feed
          </div>
          <div
            className={feedNavClassName(1)}
            onClick={() => setFeedType(FeedTypes.MY_POSTS)}
          >
            My Posts
          </div>
        </nav>
        {userId && <Button className="Feed__newPostButton">New Post</Button>}
      </div>
    </div>
  );
};
export default FeedNavigation;
