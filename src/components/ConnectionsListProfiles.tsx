import React from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "antd";
import { Profile } from "../utilities/types";
import { HexString } from "@dsnp/sdk/dist/types/types/Strings";
import { useAppSelector } from "../redux/hooks";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import { createProfile } from "@dsnp/sdk/core/activityContent";
import { AnnouncementType } from "@dsnp/sdk/core/announcements";

enum ListStatus {
  CLOSED,
  FOLLOWERS,
  FOLLOWING,
}

interface ConnectionsListProfilesProps {
  listStatus: ListStatus;
  following: Record<string, boolean>;
  followers: Record<string, boolean>;
}

const ConnectionsListProfiles = ({
  listStatus,
  following,
  followers,
}: ConnectionsListProfilesProps): JSX.Element => {
  const userRelationship = (userProfile: Profile) =>
    following[userProfile.fromId.toString()] ? "Unfollow" : "Follow";

  const profiles: Record<HexString, Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const profileForId = (userId: DSNPUserId): Profile =>
    profiles[userId.toString()] || {
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
      {connectionsList.map((userProfile) => (
        <div
          className="ConnectionsListProfiles__profile"
          key={userProfile.fromId.toString()}
        >
          <UserAvatar
            icon={profiles[userProfile.fromId.toString()]?.icon?.[0]?.href}
            avatarSize="small"
            profileAddress={userProfile.fromId}
          />
          <div className="ConnectionsListProfiles__name">
            {userProfile.name || userProfile.fromId || "Anonymous"}
          </div>
          <Button
            className="ConnectionsListProfiles__button"
            name={userRelationship(userProfile)}
          >
            {userRelationship(userProfile)}
            <div
              className={
                userRelationship(userProfile) === "Follow"
                  ? "ConnectionsListProfiles__buttonFollowIcon"
                  : "ConnectionsListProfiles__buttonUnfollowIcon"
              }
            >
              &#10005;
            </div>
          </Button>
        </div>
      ))}
    </>
  );
};
export default ConnectionsListProfiles;
