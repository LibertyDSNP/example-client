import { List } from "antd";
import React from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { FeedItem } from "../utilities/types";
import InfiniteScroll from "react-infinite-scroll-component";
import * as sdk from "../services/sdk";
import * as server from "../services/server";
import { addFeedItems } from "../redux/slices/feedSlice";

const BLOCKS_PER_LOAD = 8;

const PostList: React.FC = () => {
  const dispatch = useAppDispatch();
  const feed = useAppSelector((state) => state.feed.newFeed);
  let currentBlock: sdk.BlockNumber =
    useAppSelector((state) => state.feed.currentBlock) ?? sdk.getNewestBlock();

  const loadMoreFeed = async () => {
    const filter: sdk.FetchFilters = {
      types: ["Broadcast", "Reply"],
      to: currentBlock,
      from: currentBlock - BLOCKS_PER_LOAD,
    };
    const feedItems: FeedItem[] = [];
    while (feedItems.length < 8 && currentBlock > 0) {
      const moreFeedItems = await sdk.loadFeed(filter);
      feedItems.concat(moreFeedItems);
      currentBlock -= BLOCKS_PER_LOAD;
    }
    const contentFeedItems = await server.loadContent(feedItems);
    dispatch(
      addFeedItems({
        feedData: contentFeedItems,
        newCurrentBlock: currentBlock,
      })
    );
  };

  return (
    <>
      <InfiniteScroll
        dataLength={feed.length}
        next={loadMoreFeed}
        hasMore={!currentBlock || currentBlock > 0}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>End of Feed</b>
          </p>
        }
      >
        <List
          dataSource={feed || []}
          renderItem={(feedItem: FeedItem) => (
            <List.Item>
              <div> {feedItem.hash} </div>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </>
  );
};
export default PostList;
