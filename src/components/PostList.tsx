import React, { useEffect } from "react";
import Post from "./Post";
import { FeedItem } from "../utilities/types";
import { useAppSelector } from "../redux/hooks";
import {
  RelationshipState,
  RelationshipStatus,
} from "../redux/slices/graphSlice";
import BlankPost from "./BlankPost";
import InfiniteScroll from "react-infinite-scroll-component";
import { latestBatchedMessageComparator } from "../utilities/sort";

enum FeedTypes {
  MY_FEED,
  MY_POSTS,
  DISCOVER,
  DISPLAY_ID_POSTS,
}

interface PostListProps {
  feedType: FeedTypes;
}

const sortFeed = (feed: FeedItem[]): FeedItem[] =>
  feed.sort(latestBatchedMessageComparator);

const itemsPerPage = 5;

const PostList = ({ feedType }: PostListProps): JSX.Element => {
  const [currentFeed, setCurrentFeed] = React.useState<FeedItem[]>([]);
  const [visibleItems, setVisibleItems] = React.useState<FeedItem[]>([]);

  const userId: string | undefined = useAppSelector((state) => state.user.id);
  const displayId: string | undefined = useAppSelector(
    (state) => state.user.displayId
  );
  const myGraph:
    | Record<string, RelationshipState>
    | undefined = useAppSelector((state) =>
    userId ? state.graphs.following[userId] : undefined
  );

  const feed = useAppSelector((state) => state.feed.feedItems);

  const loading: boolean = useAppSelector(
    (state) => state.feed.isPostLoading.loading
  );

  useEffect(() => {
    const feedTypeFilters = {
      [FeedTypes.MY_FEED]: (p: FeedItem) =>
        p.fromId === userId ||
        (myGraph && myGraph[p.fromId]?.status === RelationshipStatus.FOLLOWING),
      [FeedTypes.MY_POSTS]: (p: FeedItem) => userId === p?.fromId,
      [FeedTypes.DISPLAY_ID_POSTS]: (p: FeedItem) => displayId === p?.fromId,
      [FeedTypes.DISCOVER]: (_p: FeedItem) => true,
    };

    const feedTypeFilter = feedTypeFilters[feedType];

    const items: FeedItem[] = sortFeed(feed.filter(feedTypeFilter));

    setCurrentFeed(items);
    setVisibleItems((visibleItems) =>
      items.slice(0, Math.max(visibleItems.length, itemsPerPage))
    );
  }, [feed, feedType, userId, displayId, myGraph]);

  const fetchData = () => {
    const nextPosts = currentFeed.slice(0, visibleItems.length + itemsPerPage);
    setVisibleItems(nextPosts);
  };

  return (
    <div className="PostList__block">
      {loading && <BlankPost />}
      {visibleItems.length > 0 ? (
        <InfiniteScroll
          dataLength={visibleItems.length}
          next={fetchData}
          hasMore={visibleItems.length < currentFeed.length}
          loader={<h4>Loading...</h4>}
          endMessage={<h4>That's all your posts</h4>}
        >
          {visibleItems.map((post, index) => (
            <Post key={index} feedItem={post} />
          ))}
        </InfiniteScroll>
      ) : (
        "Empty Feed!"
      )}
    </div>
  );
};

export default PostList;
