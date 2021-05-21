import React, { useEffect } from "react";
import NewPost from "./NewPost";
import PostList from "./PostList";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Button } from "antd";
import { BaseFilters } from "@unfinishedlabs/sdk/dist/types/social/search";
import * as sdk from "../services/sdk";
import * as server from "../services/server";
import {
  addNewFeedItems,
  addNewFeedtoMainFeed,
} from "../redux/slices/feedSlice";

const Feed: React.FC = () => {
  const dispatch = useAppDispatch();
  const newFeed = useAppSelector((state) => state.feed.newFeed);

  useEffect(() => {
    const subscriptionID = subscribe();
    dispatch(addNewFeedtoMainFeed());
    return () => unsubscribe(subscriptionID);
  }, []);

  const subscribe = () => {
    const filter: BaseFilters = {
      types: ["Broadcast", "Reply"],
    };
    const subscriptionID = sdk.subscribeToFeed(filter, async (feedItems) => {
      const contentFeedItems = await server.loadContent(feedItems);
      dispatch(addNewFeedItems(contentFeedItems));
    });
    return subscriptionID;
  };

  const unsubscribe = (subscriptionID: string) => {
    if (subscriptionID) sdk.unsubscribeToFeed(subscriptionID);
  };

  return (
    <div className="Feed__block">
      <div className="Feed__header">
        <h1>Feed</h1>
        <NewPost />
        {newFeed.length && (
          <Button
            className="Feed_NewContentLoad"
            onClick={() => dispatch(addNewFeedtoMainFeed())}
          >
            Load New Content
          </Button>
        )}
      </div>
      <PostList />
    </div>
  );
};
export default Feed;
