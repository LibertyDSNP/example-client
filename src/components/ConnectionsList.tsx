import React, { useState } from "react";
import { Button } from "antd";
import ConnectionsListProfiles from "./ConnectionsListProfiles";
import { useAppSelector } from "../redux/hooks";

enum ListStatus {
  CLOSED,
  FOLLOWERS,
  FOLLOWING,
}

const ConnectionsList = (): JSX.Element => {
  const { id: userId, displayId } = useAppSelector((state) => state.user);

  const following = useAppSelector(
    (state) => (displayId && state.graphs.following[displayId]) || {}
  );
  const followers = useAppSelector(
    (state) => (displayId && state.graphs.followers[displayId]) || {}
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
        <Button
          className={getClassName(ListStatus.FOLLOWERS)}
          onClick={() => handleClick(ListStatus.FOLLOWERS)}
        >
          <div className="ConnectionsList__buttonCount">
            {Object.keys(followers).length}
          </div>
          Followers
        </Button>

        {selectedListTitle === ListStatus.CLOSED && (
          <div className="ConnectionsList__buttonSeparator"> </div>
        )}
        <Button
          className={getClassName(ListStatus.FOLLOWING)}
          onClick={() => handleClick(ListStatus.FOLLOWING)}
        >
          <div className="ConnectionsList__buttonCount">
            {Object.keys(following).length}
          </div>
          Following
        </Button>
      </div>
      {userId && (
        <ConnectionsListProfiles
          userId={userId}
          listStatus={selectedListTitle}
          following={following}
          followers={followers}
        />
      )}
    </div>
  );
};

export default ConnectionsList;
