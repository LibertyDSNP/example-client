import React, { useState } from "react";
import ConnectionsListProfiles from "./ConnectionsListProfiles";
import { useAppSelector } from "../redux/hooks";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import { FeedItem } from "../utilities/types";

enum ListStatus {
  CLOSED,
  FOLLOWERS,
  FOLLOWING,
}

const ConnectionsList = (): JSX.Element => {
  const userId: DSNPUserId | undefined = useAppSelector(
    (state) => state.user.id
  );

  const feed: FeedItem[] = useAppSelector((state) => state.feed.feed);
  const myPostsCount = feed.filter(
    (feedItem) => feedItem.fromAddress === userId && feedItem.inReplyTo === null
  ).length;

  const following = useAppSelector(
    (state) => (userId && state.graphs.following[userId]) || {}
  );
  const followers = useAppSelector(
    (state) => (userId && state.graphs.followers[userId]) || {}
  );

  const [selectedListTitle, setSelectedListTitle] = useState<ListStatus>(
    ListStatus.CLOSED
  );

  const handleClick = (listTitle: ListStatus) => {
    if (selectedListTitle === listTitle)
      setSelectedListTitle(ListStatus.CLOSED);
    else {
      setSelectedListTitle(listTitle);
    }
  };

  const getClassName = (name: ListStatus) => {
    return selectedListTitle === name
      ? "ConnectionsList__button ConnectionsList__button--active"
      : "ConnectionsList__button";
  };

  return (
    <div className="ConnectionsList__block">
      <div className="ConnectionsList__buttonBlock">
        <button className="ConnectionsList__button">
          <div className="ConnectionsList__buttonCount">{myPostsCount}</div>
          Posts
        </button>
        <button
          className={getClassName(ListStatus.FOLLOWERS)}
          onClick={() => handleClick(ListStatus.FOLLOWERS)}
        >
          <div className="ConnectionsList__buttonCount">
            {Object.keys(followers).length}
          </div>
          Followers
        </button>
        <button
          className={getClassName(ListStatus.FOLLOWING)}
          onClick={() => handleClick(ListStatus.FOLLOWING)}
        >
          <div className="ConnectionsList__buttonCount">
            {Object.keys(following).length}
          </div>
          Following
        </button>
      </div>
      <ConnectionsListProfiles
        listStatus={selectedListTitle}
        following={following}
        followers={followers}
      />
    </div>
  );
};

export default ConnectionsList;
