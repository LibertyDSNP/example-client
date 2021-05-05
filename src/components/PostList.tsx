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
  const feed = useAppSelector((state) => state.feed.feed);
  let currentBlock: sdk.BlockNumber =
    useAppSelector((state) => state.feed.currentBlock) ?? sdk.getNewestBlock();

  console.log("🚀 | file: PostList.tsx | line 18 | feed", feed);
  console.log("🚀 | file: PostList.tsx | line 19 | currentBlock", currentBlock);

  const loadMoreFeed = async () => {
    console.log("🚀 | file: PostList.tsx | line 22 | loadMoreFeed Called");
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
    console.log("🚀 | file: PostList.tsx | line 35 | feedItems", feedItems);
    const contentFeedItems = await server.loadContent(feedItems);
    console.log(
      "🚀 | file: PostList.tsx | line 37 | contentFeedItems",
      contentFeedItems
    );
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
