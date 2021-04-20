import React from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "antd";

interface FollowersFollowingUsersProps {
  selectedListTitle: string;
  tempUserList: any[];
}

const FollowersFollowingUsers = ({
  selectedListTitle,
  tempUserList,
}: FollowersFollowingUsersProps): any => {
  const userList = () => {
    switch (selectedListTitle) {
      case "showFollowers":
        return tempUserList.filter((user) => user.followsMe);
      case "showFollowing":
        return tempUserList.filter((user) => user.following);
      default:
        return [];
    }
  };

  const getList = () => {
    return userList().map((user, index) => {
      const buttonText = user.following ? "Unfollow" : "Follow";
      return (
        <div className="FollowersFollowingUsers__user" key={index}>
          <UserAvatar avatarSize="small" profile={user.profile} />
          <div className="FollowersFollowingUsers__name">{user.name}</div>
          <Button className="FollowersFollowingUsers__button" name={buttonText}>
            {buttonText}
          </Button>
        </div>
      );
    });
  };

  return getList();
};
export default FollowersFollowingUsers;
