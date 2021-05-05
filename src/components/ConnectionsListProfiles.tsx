import React from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "antd";
import { Profile } from "../utilities/types";

enum ListStatus {
  CLOSED,
  FOLLOWERS,
  FOLLOWING,
}

interface ConnectionsListProfilesProps {
  listStatus: ListStatus;
  connectionsList: Profile[];
  notFollowing: Profile[];
}

const ConnectionsListProfiles = ({
  listStatus,
  connectionsList,
  notFollowing,
}: ConnectionsListProfilesProps): JSX.Element => {
  const userRelationship = (userProfile: Profile) => {
    const isNotFollowing = notFollowing.filter(
      (notFollowingUser) => userProfile === notFollowingUser
    );
    if (listStatus === ListStatus.FOLLOWERS && isNotFollowing.length !== 0) {
      return "Follow";
    }
    return "Unfollow";
  };

  return (
    <>
      {connectionsList.map((userProfile) => (
        <div
          className="ConnectionsListProfiles__profile"
          key={userProfile.socialAddress}
        >
          <UserAvatar avatarSize="small" profile={userProfile} />
          <div className="ConnectionsListProfiles__name">
            {userProfile.name || userProfile.preferredUsername || "Anonymous"}
          </div>
          <Button
            className="ConnectionsListProfiles__button"
            name={userRelationship(userProfile)}
          >
            {userRelationship(userProfile)}
            <div
              className={
                listStatus === ListStatus.FOLLOWING
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
