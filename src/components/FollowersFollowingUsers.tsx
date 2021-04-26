import React from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "antd";
import { Profile } from "../utilities/types";
import { ListStatus } from "../utilities/enums";

interface FollowersFollowingUsersProps {
  listStatus: ListStatus;
  tempUserList: Profile[];
  notFollowing: Profile[];
}

const FollowersFollowingUsers = ({
  listStatus,
  tempUserList,
  notFollowing,
}: FollowersFollowingUsersProps): JSX.Element => {
  const userRelationship = (user: Profile) => {
    const isNotFollowing = notFollowing.filter(
      (notFollowingUser) => user === notFollowingUser
    );
    if (listStatus === ListStatus.FOLLOWERS && isNotFollowing.length === 0) {
      return "Follow";
    }
    return "Unfollow";
  };
  return (
    <>
      {tempUserList.map((user) => (
        <div className="FollowersFollowingUsers__user" key={user.socialAddress}>
          <UserAvatar avatarSize="small" profile={user} />
          <div className="FollowersFollowingUsers__name">
            {user.name || user.preferredUsername || "Anonymous"}
          </div>
          <Button
            className="FollowersFollowingUsers__button"
            name={userRelationship(user)}
          >
            {userRelationship(user)}
            <div
              className={
                listStatus === ListStatus.FOLLOWING
                  ? "FollowersFollowingUsers__buttonFollowIcon"
                  : "FollowersFollowingUsers__buttonUnfollowIcon"
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
export default FollowersFollowingUsers;
