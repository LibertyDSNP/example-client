import React, { useState } from "react";
import { Button } from "antd";
import ConnectionsListProfiles from "./ConnectionsListProfiles";
import { useAppSelector } from "../redux/hooks";
import {
  RelationshipState,
  RelationshipStatus,
} from "../redux/slices/graphSlice";
import { User } from "../utilities/types";
import { AnnouncementType } from "@dsnp/sdk/core/announcements";

enum ListStatus {
  CLOSED = "CLOSED",
  FOLLOWERS = "FOLLOWERS",
  FOLLOWING = "FOLLOWING",
}

const ConnectionsList = (): JSX.Element => {
  const { id: userId, displayId } = useAppSelector((state) => state.user);

  const followedByDisplayUser = useAppSelector(
    (state) => (displayId && state.graphs.following[displayId]) || {}
  );
  const followingDisplayUser = useAppSelector(
    (state) => (displayId && state.graphs.followers[displayId]) || {}
  );

  const [selectedListTitle, setSelectedListTitle] = useState<ListStatus>(
    ListStatus.CLOSED
  );

  const users: Record<string, User> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const profileForId = (userId: string): User =>
    users[userId] || {
      contentHash: "",
      url: "",
      announcementType: AnnouncementType.Profile,
      fromId: userId,
      handle: "unknown",
    };

  const connectionsList = (
    relations: Record<string, RelationshipState>
  ): User[] =>
    Object.keys(relations)
      .map(profileForId)
      .filter(
        (profile: User) =>
          relations[profile.fromId]?.status !== RelationshipStatus.UNFOLLOWING
      );

  const relations =
    selectedListTitle === ListStatus.FOLLOWERS
      ? followingDisplayUser
      : selectedListTitle === ListStatus.FOLLOWING
      ? followedByDisplayUser
      : {};

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
            {connectionsList(followingDisplayUser).length}
          </div>
          Followers
        </Button>
        <Button
          className={getClassName(ListStatus.FOLLOWING)}
          onClick={() => handleClick(ListStatus.FOLLOWING)}
        >
          <div className="ConnectionsList__buttonCount">
            {connectionsList(followedByDisplayUser).length}
          </div>
          Following
        </Button>
      </div>
      {userId && (
        <ConnectionsListProfiles
          userId={userId}
          connectionsList={connectionsList(relations)}
        />
      )}
    </div>
  );
};

export default ConnectionsList;
