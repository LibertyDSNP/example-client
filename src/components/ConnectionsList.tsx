import React, { useEffect, useState } from "react";
import { Button } from "antd";
import ConnectionsListProfiles from "./ConnectionsListProfiles";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getProfile } from "../services/sdk";
import { Graph, HexString, Profile } from "../utilities/types";
import { upsertProfile } from "../redux/slices/profileSlice";

enum ListStatus {
  CLOSED,
  FOLLOWERS,
  FOLLOWING,
}

const ConnectionsList = (): JSX.Element => {
  const profile: Profile | undefined = useAppSelector(
    (state) => state.user.profile
  );
  const graphs: Graph[] = useAppSelector((state) => state.graphs.graphs);
  const graph: Graph | undefined = graphs.find(
    ({ socialAddress }) => socialAddress === profile?.socialAddress
  );
  const cachedProfiles: Profile[] = useAppSelector(
    (state) => state.profiles.profiles
  );
  const [selectedListTitle, setSelectedListTitle] = useState<ListStatus>(
    ListStatus.CLOSED
  );
  const [selectedList, setSelectedList] = useState<Profile[]>([]);
  const [followingList, setFollowingList] = useState<Profile[]>([]);
  const [followersList, setFollowersList] = useState<Profile[]>([]);
  const [notFollowing, setNotFollowing] = useState<Profile[]>([]);
  const dispatch = useAppDispatch();

  const getConnectionProfile = async (
    socialAddress: HexString
  ): Promise<Profile> => {
    let userProfile = cachedProfiles.find(
      (profile) => profile.socialAddress === socialAddress
    );
    if (!userProfile) {
      userProfile = await getProfile(socialAddress);
      dispatch(upsertProfile(userProfile));
    }
    return userProfile;
  };

  const getUserConnectionsList = async (
    following: HexString[],
    followers: HexString[]
  ) => {
    const followingProfiles: Profile[] = await Promise.all(
      (following || []).map(
        async (socialAddress: string) =>
          await getConnectionProfile(socialAddress)
      )
    );
    const followersProfiles: Profile[] = await Promise.all(
      (followers || []).map(
        async (socialAddress: string) =>
          await getConnectionProfile(socialAddress)
      )
    );
    return [followingProfiles, followersProfiles];
  };

  const getNotFollowingProfiles = (
    followingProfiles: Profile[],
    followersProfiles: Profile[]
  ) => {
    return followersProfiles.filter((userProfile) => {
      return !followingProfiles.find(
        (followingProfile) =>
          followingProfile.socialAddress === userProfile.socialAddress
      );
    });
  };

  useEffect(() => {
    if (!graph) return;
    getUserConnectionsList(graph.following, graph.followers).then(
      (userRelationships) => {
        const [followingProfiles, followersProfiles] = userRelationships;
        setFollowingList(followingProfiles);
        setFollowersList(followersProfiles);
        setNotFollowing(
          getNotFollowingProfiles(followingProfiles, followersProfiles)
        );
      }
    );
  }, [graph]);

  useEffect(() => {
    if (selectedListTitle === ListStatus.FOLLOWING) {
      setSelectedList(followingList);
    } else if (selectedListTitle === ListStatus.FOLLOWERS) {
      setSelectedList(followersList);
    } else setSelectedList([]);
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
      ? "ConnectionsList__button ConnectionsList__button--active"
      : "ConnectionsList__button";
  };

  return (
    <div className="ConnectionsList__block">
      <div className="ConnectionsList__buttonBlock">
        <Button
          className={getClassName(ListStatus.FOLLOWERS)}
          onClick={() => handleClick(ListStatus.FOLLOWERS)}
        >
          <div className="ConnectionsList__buttonCount">
            {graph?.followers.length}
          </div>
          Followers
        </Button>
        {selectedListTitle === ListStatus.CLOSED && (
          <div className="ConnectionsList__buttonSeperator"> </div>
        )}
        <Button
          className={getClassName(ListStatus.FOLLOWING)}
          onClick={() => handleClick(ListStatus.FOLLOWING)}
        >
          <div className="ConnectionsList__buttonCount">
            {graph?.following.length}
          </div>
          Following
        </Button>
      </div>
      <ConnectionsListProfiles
        listStatus={selectedListTitle}
        connectionsList={selectedList}
        notFollowing={notFollowing}
      />
    </div>
  );
};

export default ConnectionsList;
