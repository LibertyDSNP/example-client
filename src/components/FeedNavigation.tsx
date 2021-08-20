import React from "react";

enum FeedTypes {
  MY_FEED,
  MY_POSTS,
  DISCOVER,
}

interface FeedNavigationProps {
  feedType: FeedTypes;
  setFeedType: (feedType: FeedTypes) => void;
}

const FeedNavigation = ({
  feedType,
  setFeedType,
}: FeedNavigationProps): JSX.Element => {
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
            onClick={() => setFeedType(FeedTypes.DISCOVER)}
          >
            Discover
          </div>
          <div
            className={feedNavClassName(0)}
            onClick={() => setFeedType(FeedTypes.MY_FEED)}
          >
            My Feed
          </div>
          <div
            className={feedNavClassName(1)}
            onClick={() => setFeedType(FeedTypes.MY_POSTS)}
          >
            My Posts
          </div>
        </nav>
      </div>
    </div>
  );
};
export default FeedNavigation;
