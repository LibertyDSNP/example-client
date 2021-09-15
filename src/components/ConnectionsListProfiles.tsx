import React from "react";
import UserAvatar from "./UserAvatar";
import { User } from "../utilities/types";
import { HexString } from "@dsnp/sdk/dist/types/types/Strings";
import { useAppSelector } from "../redux/hooks";
import { AnnouncementType } from "@dsnp/sdk/core/announcements";
import {
  RelationshipState,
  RelationshipStatus,
} from "../redux/slices/graphSlice";
import GraphChangeButton from "./GraphChangeButton";
import { UserName } from "./UserName";

enum ListStatus {
  CLOSED,
  FOLLOWERS,
  FOLLOWING,
}

interface ConnectionsListProfilesProps {
  userId: string;
  listStatus: ListStatus;
  followedByDisplayUser: Record<string, RelationshipState>;
  followingDisplayUser: Record<string, RelationshipState>;
}

const ConnectionsListProfiles = ({
  userId,
  listStatus,
  followedByDisplayUser,
  followingDisplayUser,
}: ConnectionsListProfilesProps): JSX.Element => {
  const users: Record<HexString, User> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const followedByCurrentUser = useAppSelector(
    (state) => (userId && state.graphs.following[userId]) || {}
  );

  const profileForId = (userId: string): User =>
    users[userId] || {
      contentHash: "",
      url: "",
      announcementType: AnnouncementType.Profile,
      fromId: userId,
      handle: "unknown",
    };

  const relations =
    listStatus === ListStatus.FOLLOWERS
      ? followingDisplayUser
      : listStatus === ListStatus.FOLLOWING
      ? followedByDisplayUser
      : {};

  const connectionsList = Object.keys(relations)
    .map(profileForId)
    .filter(
      (profile) =>
        relations[profile.fromId]?.status !== RelationshipStatus.UNFOLLOWING
    );

  return (
    <>
      {connectionsList.map((user) => (
        <div className="ConnectionsListProfiles__profile" key={user.fromId}>
          <UserAvatar user={users[user.fromId]} avatarSize="small" />
          <div className="ConnectionsListProfiles__name">
            <UserName user={user} />
          </div>
          <GraphChangeButton
            userId={userId}
            user={user}
            following={followedByCurrentUser}
          ></GraphChangeButton>
        </div>
      ))}
    </>
  );
};
export default ConnectionsListProfiles;
