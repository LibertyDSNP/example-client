import React from "react";
import UserAvatar from "./UserAvatar";
import { Profile } from "../utilities/types";
import { HexString } from "@dsnp/sdk/dist/types/types/Strings";
import { useAppSelector } from "../redux/hooks";
import { createProfile } from "@dsnp/sdk/core/activityContent";
import { AnnouncementType } from "@dsnp/sdk/core/announcements";
import {
  RelationshipState,
  RelationshipStatus,
} from "../redux/slices/graphSlice";
import GraphChangeButton from "./GraphChangeButton";

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
  const profiles: Record<HexString, Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const followedByCurrentUser = useAppSelector(
    (state) => (userId && state.graphs.following[userId]) || {}
  );

  const profileForId = (userId: string): Profile =>
    profiles[userId] || {
      ...createProfile({ name: "Anonymous" }),
      contentHash: "",
      url: "",
      announcementType: AnnouncementType.Profile,
      fromId: userId,
      handle: "unknown",
      createdAt: new Date().getTime(),
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
      {connectionsList.map((profile) => (
        <div className="ConnectionsListProfiles__profile" key={profile.fromId}>
          <UserAvatar
            icon={profiles[profile.fromId]?.icon?.[0]?.href}
            avatarSize="small"
            profileAddress={profile.fromId}
          />
          <div className="ConnectionsListProfiles__name">
            {profile.name || profile.fromId || "Anonymous"}
          </div>
          <GraphChangeButton
            userId={userId}
            profile={profile}
            following={followedByCurrentUser}
          ></GraphChangeButton>
        </div>
      ))}
    </>
  );
};
export default ConnectionsListProfiles;
