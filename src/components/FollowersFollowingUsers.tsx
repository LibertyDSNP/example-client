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
}: FollowersFollowingUsersProps): JSX.Element => {
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

  return (
    <>
      {userList().map((user, index) => (
        <div className="FollowersFollowingUsers__user" key={index}>
          <UserAvatar avatarSize="small" profile={user.profile} />
          <div className="FollowersFollowingUsers__name">{user.name}</div>
          <Button
            className="FollowersFollowingUsers__button"
            name={user.following ? "Unfollow" : "Follow"}
          >
            {user.following ? "Unfollow" : "Follow"}
          </Button>
        </div>
      ))}
    </>
  );
};
export default FollowersFollowingUsers;
