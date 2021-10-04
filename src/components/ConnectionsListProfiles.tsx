import React from "react";
import UserAvatar from "./UserAvatar";
import { User } from "../utilities/types";
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
  connectionsList: User[];
}

const ConnectionsListProfiles = ({
  userId,
  connectionsList,
}: ConnectionsListProfilesProps): JSX.Element => {
  const users: Record<string, User> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const followedByCurrentUser = useAppSelector(
    (state) => (userId && state.graphs.following[userId]) || {}
  );

  return (
    <>
      {connectionsList.map((user) => (
        <div className="ConnectionsListProfiles__profile" key={user.fromId}>
          <UserAvatar user={users[user.fromId]} avatarSize="small" />
          <div className="ConnectionsListProfiles__name">
            <UserName user={user} />
          </div>
          {userId !== user.fromId && (
            <GraphChangeButton
              userId={userId}
              user={user}
              following={followedByCurrentUser}
            />
          )}
        </div>
      ))}
    </>
  );
};
export default ConnectionsListProfiles;
