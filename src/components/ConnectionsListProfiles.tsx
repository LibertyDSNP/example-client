import React from "react";
import UserAvatar from "./UserAvatar";
import { Button, Spin } from "antd";
import { Profile } from "../utilities/types";
import { HexString } from "@dsnp/sdk/dist/types/types/Strings";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { createProfile } from "@dsnp/sdk/core/activityContent";
import { AnnouncementType } from "@dsnp/sdk/core/announcements";
import { followUser, unfollowUser } from "../services/content";
import {
  updateRelationshipStatus,
  RelationshipStatus,
} from "../redux/slices/graphSlice";

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
  const dispatch = useAppDispatch();

  const isFollowing = (userProfile: Profile): boolean =>
    userProfile.fromId in following;

  const isFollowingUpdating = (userProfile: Profile): boolean =>
    following[userProfile.fromId] === RelationshipStatus.UPDATING;

  const userRelationship = (profile: Profile): string =>
    isFollowingUpdating(profile)
      ? "updating"
      : isFollowing(profile)
      ? "Unfollow"
      : "Follow";

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

  const changeGraphState = async (profile: Profile) => {
    if (isFollowing(profile)) {
      await unfollowUser(BigInt(userId), BigInt(profile.fromId));
    } else {
      await followUser(BigInt(userId), BigInt(profile.fromId));
    }
    dispatch(
      updateRelationshipStatus({
        follower: userId,
        followee: profile.fromId,
        status: RelationshipStatus.UPDATING,
      })
    );
  };

  return (
    <>
      {connectionsList.map((userProfile) => (
        <div
          className="ConnectionsListProfiles__profile"
          key={userProfile.fromId}
        >
          <UserAvatar
            icon={profiles[userProfile.fromId]?.icon?.[0]?.href}
            avatarSize="small"
            profileAddress={userProfile.fromId}
          />
          <div className="ConnectionsListProfiles__name">
            {userProfile.name || userProfile.fromId || "Anonymous"}
          </div>
          <Button
            className="ConnectionsListProfiles__button"
            name={userRelationship(userProfile)}
            onClick={() => changeGraphState(userProfile)}
            disabled={isFollowingUpdating(userProfile)}
          >
            {userRelationship(userProfile)}
            {isFollowingUpdating(userProfile) ? (
              <Spin></Spin>
            ) : (
              <div
                className={
                  userRelationship(userProfile) === "Follow"
                    ? "ConnectionsListProfiles__buttonFollowIcon"
                    : "ConnectionsListProfiles__buttonUnfollowIcon"
                }
              >
                &#10005;
              </div>
            )}
          </Button>
        </div>
      ))}
    </>
  );
};
export default ConnectionsListProfiles;
