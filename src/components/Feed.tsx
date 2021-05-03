import React, { useEffect } from "react";
import * as sdk from "../services/sdk";
import NewPost from "./NewPost";
import PostList from "./PostList";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import * as server from "../services/server";
import {
  addNewFeedItems,
  addNewFeedtoMainFeed,
} from "../redux/slices/feedSlice";
import { BaseFilters } from "@unfinishedlabs/sdk/dist/types/social/search";
import { Button } from "antd";

const Feed: React.FC = () => {
  const dispatch = useAppDispatch();
  const newFeed = useAppSelector((state) => state.feed.feed);

  let subscriptionID: string;
  useEffect(() => {
    subscribe();
    dispatch(addNewFeedtoMainFeed());
    return unsubscribe();
  });

  const subscribe = () => {
    const filter: BaseFilters = {
      types: ["Broadcast", "Reply"],
    };
    subscriptionID = sdk.subscribeToFeed(filter, async (feedItems) => {
      const contentFeedItems = await server.loadContent(feedItems);
      dispatch(addNewFeedItems(contentFeedItems));
    });
  };

  const unsubscribe = () => {
    if (subscriptionID) sdk.unsubscribeToFeed(subscriptionID);
  };

  return (
    <div className="Feed__block">
      <div className="Feed__header">
        <h1>Feed</h1>
        <NewPost />
        {newFeed && (
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
