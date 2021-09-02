import React from "react";
import UserAvatar from "./UserAvatar";
import { Profile } from "../utilities/types";
import { HexString } from "@dsnp/sdk/dist/types/types/Strings";
import { useAppSelector } from "../redux/hooks";
import { createProfile } from "@dsnp/sdk/core/activityContent";
import { AnnouncementType } from "@dsnp/sdk/core/announcements";
import { RelationshipStatus } from "../redux/slices/graphSlice";
import GraphChangeButton from "./GraphChangeButton";

enum ListStatus {
  CLOSED,
  FOLLOWERS,
  FOLLOWING,
}

interface ConnectionsListProfilesProps {
  userId: string;
  listStatus: ListStatus;
  following: Record<string, RelationshipStatus>;
  followers: Record<string, RelationshipStatus>;
}

const ConnectionsListProfiles = ({
  userId,
  listStatus,
  following,
  followers,
}: ConnectionsListProfilesProps): JSX.Element => {
  const profiles: Record<HexString, Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
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

  const connectionsList =
    listStatus === ListStatus.FOLLOWERS
      ? Object.keys(followers).map(profileForId)
      : listStatus === ListStatus.FOLLOWING
      ? Object.keys(following).map(profileForId)
      : [];

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
            following={following}
          ></GraphChangeButton>
        </div>
      ))}
    </>
  );
};
export default ConnectionsListProfiles;
