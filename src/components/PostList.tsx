import { List } from "antd";
import React, { useEffect } from "react";
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

  const loadMoreFeed = async () => {
    const filter: sdk.FetchFilters = {
      types: ["Broadcast", "Reply"],
      to: currentBlock,
      from: currentBlock > BLOCKS_PER_LOAD ? currentBlock - BLOCKS_PER_LOAD : 0,
    };
    const feedAndReplies: FeedItem[] = [];
    while (feedAndReplies.length < 8 && currentBlock > 0) {
      const moreFeedItems = await sdk.loadFeed(filter);
      moreFeedItems.reverse();
      feedAndReplies.push(...moreFeedItems);
      currentBlock -= BLOCKS_PER_LOAD;
    }
    const contentFeedAndReplies = await server.loadContent(feedAndReplies);

    dispatch(
      addFeedItems({
        feedData: contentFeedAndReplies,
        newCurrentBlock: currentBlock,
      })
    );
  };

  useEffect(() => {
    if (feed.length !== 0) return;
    loadMoreFeed();
  }, []);

  // Used for mocked data. Remove when no longer mocking data
  const brokenLink = (e: any) => {
    e.target.src = "https://picsum.photos/200/300";
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
              <div> Poster: {feedItem.address} </div>
              <div> Hash: {feedItem.hash} </div>
              {feedItem.replies.length > 0 && (
                <div>
                  {feedItem.replies.map((reply) => (
                    <div>Reply From: {reply.address}</div>
                  ))}
                </div>
              )}
              {feedItem?.content && feedItem?.content?.attachment && (
                <img
                  src={(feedItem?.content).attachment[0].url}
                  alt="Post"
                  // Used for mocked data. Remove when no longer mocking data
                  onError={brokenLink}
                ></img>
              )}
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </>
  );
};
export default PostList;
