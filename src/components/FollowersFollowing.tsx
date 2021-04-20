import React, { useState } from "react";
import { Button } from "antd";
import FollowersFollowingUsers from "./FollowersFollowingUsers";
import { preFabProfiles } from "../test/testProfiles";

const FollowersFollowing = (): JSX.Element => {
  const [selectedListTitle, setSelectedListTitle] = useState<string>("");

  const tempUserList = [
    {
      profile: preFabProfiles[0],
      icon: preFabProfiles[0].icon,
      name: preFabProfiles[0].name,
      following: true,
      followsMe: true,
    },
    {
      profile: preFabProfiles[1],
      icon: preFabProfiles[1].icon,
      name: preFabProfiles[1].name,
      following: true,
      followsMe: false,
    },
    {
      profile: preFabProfiles[2],
      icon: preFabProfiles[2].icon,
      name: preFabProfiles[2].name,
      following: false,
      followsMe: true,
    },
  ];

  const handleClick = (listTitle: string) => {
    if (selectedListTitle === listTitle) {
      setSelectedListTitle("");
      return;
    }
    if (listTitle === "showFollowers") {
      setSelectedListTitle(listTitle);
    } else {
      setSelectedListTitle(listTitle);
    }
  };

  const getClassName = (name: string) => {
    return selectedListTitle === name
      ? "FollowersFollowing__button FollowersFollowing__button--active"
      : "FollowersFollowing__button";
  };

  const followerCount = tempUserList.filter((user) => user.followsMe).length;
  const followingCount = tempUserList.filter((user) => user.following).length;

  return (
    <div className="FollowersFollowing__block">
      <div className="FollowersFollowing__buttonBlock">
        <Button
          className={getClassName("showFollowers")}
          onClick={() => handleClick("showFollowers")}
        >
          <div className="FollowersFollowing__buttonCount">{followerCount}</div>
          Followers
        </Button>
        {selectedListTitle !== "showFollowing" &&
          selectedListTitle !== "showFollowers" && (
            <div className="FollowersFollowing__buttonSeperator"> </div>
          )}
        <Button
          className={getClassName("showFollowing")}
          onClick={() => handleClick("showFollowing")}
        >
          <div className="FollowersFollowing__buttonCount">
            {followingCount}
          </div>
          Following
        </Button>
      </div>
      <FollowersFollowingUsers
        selectedListTitle={selectedListTitle}
        tempUserList={tempUserList}
      />
    </div>
  );
};

export default FollowersFollowing;
