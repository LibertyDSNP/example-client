import React, { useEffect, useState } from "react";
import { Button } from "antd";
import FollowersFollowingUsers from "./FollowersFollowingUsers";
import { useAppSelector } from "../redux/hooks";
import { getProfile } from "../services/sdk";
import { Profile } from "../utilities/types";
import { ListStatus } from "../utilities/enums";

const FollowersFollowing = (): JSX.Element => {
  const graph = useAppSelector((state) => state.user.graph);
  const [selectedListTitle, setSelectedListTitle] = useState<ListStatus>(
    ListStatus.CLOSED
  );

  const [usersList, setUsersList] = useState<Profile[] | any>([]);

  const followingList: Profile[] = [];
  const followersList: Profile[] = [];
  graph?.following.map(async (socialAddress) => {
    followingList.push(await getProfile(socialAddress));
  });
  graph?.followers.map(async (socialAddress) => {
    followersList.push(await getProfile(socialAddress));
  });

  const notFollowing = followersList.filter((userProfile) => {
    return !followingList.includes(userProfile);
  });

  useEffect(() => {
    if (selectedListTitle === ListStatus.FOLLOWING) {
      setUsersList(followingList);
    } else if (selectedListTitle === ListStatus.FOLLOWERS) {
      setUsersList(followersList);
    } else setUsersList([]);
  }, [selectedListTitle]);

  const handleClick = (listTitle: ListStatus) => {
    if (selectedListTitle === listTitle)
      setSelectedListTitle(ListStatus.CLOSED);
    else {
      setSelectedListTitle(listTitle);
    }
  };

  const getClassName = (name: ListStatus) => {
    return selectedListTitle === name
      ? "FollowersFollowing__button FollowersFollowing__button--active"
      : "FollowersFollowing__button";
  };

  return (
    <div className="FollowersFollowing__block">
      <div className="FollowersFollowing__buttonBlock">
        <Button
          className={getClassName(ListStatus.FOLLOWERS)}
          onClick={() => handleClick(ListStatus.FOLLOWERS)}
        >
          <div className="FollowersFollowing__buttonCount">
            {graph?.followers.length}
          </div>
          Followers
        </Button>
        {selectedListTitle === ListStatus.CLOSED && (
          <div className="FollowersFollowing__buttonSeperator"> </div>
        )}
        <Button
          className={getClassName(ListStatus.FOLLOWING)}
          onClick={() => handleClick(ListStatus.FOLLOWING)}
        >
          <div className="FollowersFollowing__buttonCount">
            {graph?.following.length}
          </div>
          Following
        </Button>
      </div>
      <FollowersFollowingUsers
        listStatus={selectedListTitle}
        tempUserList={usersList}
        notFollowing={notFollowing}
      />
    </div>
  );
};

export default FollowersFollowing;
