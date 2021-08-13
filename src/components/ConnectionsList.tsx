import React, { useEffect, useState, useCallback } from "react";
import { Button } from "antd";
import ConnectionsListProfiles from "./ConnectionsListProfiles";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import * as sdk from "../services/sdk";
import { Graph, HexString, Profile } from "../utilities/types";
import { upsertProfile } from "../redux/slices/profileSlice";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";

enum ListStatus {
  CLOSED,
  FOLLOWERS,
  FOLLOWING,
}

const ConnectionsList = (): JSX.Element => {
  const userId: DSNPUserId | undefined = useAppSelector(
    (state) => state.user.id
  );
  const graphs: Graph[] = useAppSelector((state) => state.graphs.graphs);
  const graph: Graph | undefined = graphs.find(
    ({ dsnpUserId }) => dsnpUserId === userId
  );
  const cachedProfiles: Record<HexString, Profile> = useAppSelector(
    (state) => state.profiles.profiles
  );
  const [selectedListTitle, setSelectedListTitle] = useState<ListStatus>(
    ListStatus.CLOSED
  );
  const [selectedList, setSelectedList] = useState<Profile[]>([]);
  const [followingList, setFollowingList] = useState<Profile[]>([]);
  const [followersList, setFollowersList] = useState<Profile[]>([]);
  const [notFollowingList, setNotFollowingList] = useState<Profile[]>([]);
  const dispatch = useAppDispatch();

  const getConnectionProfile = async (fromId: DSNPUserId): Promise<Profile> => {
    let userProfile = cachedProfiles[fromId];
    if (!userProfile) {
      userProfile = await sdk.getProfile(fromId);
      stableDispatch(upsertProfile(userProfile));
    }
    return userProfile;
  };

  const getUserConnectionsList = async (
    following: HexString[],
    followers: HexString[]
  ) => {
    const followingProfiles: Profile[] = await Promise.all(
      (following || []).map((fromId: DSNPUserId) =>
        stableGetConnectionProfile(fromId)
      )
    );
    const followersProfiles: Profile[] = await Promise.all(
      (followers || []).map((fromId: DSNPUserId) =>
        stableGetConnectionProfile(fromId)
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
        (followingProfile) => followingProfile.fromId === userProfile.fromId
      );
    });
  };

  const stableDispatch = useCallback(dispatch, [dispatch]);

  const stableGetConnectionProfile = useCallback(getConnectionProfile, [
    cachedProfiles,
    stableDispatch,
  ]);

  const stableGetUserConnectionsList = useCallback(getUserConnectionsList, [
    stableGetConnectionProfile,
  ]);

  useEffect(() => {
    if (!graph) return;
    stableGetUserConnectionsList(graph.following, graph.followers).then(
      (userRelationships) => {
        const [followingProfiles, followersProfiles] = userRelationships;
        setFollowingList(followingProfiles);
        setFollowersList(followersProfiles);
        setNotFollowingList(
          getNotFollowingProfiles(followingProfiles, followersProfiles)
        );
      }
    );
  }, [stableGetUserConnectionsList, graph]);

  useEffect(() => {
    if (selectedListTitle === ListStatus.FOLLOWING) {
      setSelectedList(followingList);
    } else if (selectedListTitle === ListStatus.FOLLOWERS) {
      setSelectedList(followersList);
    } else setSelectedList([]);
  }, [selectedListTitle, followersList, followingList]);

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
          <div className="ConnectionsList__buttonSeparator"> </div>
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
        notFollowingList={notFollowingList}
      />
    </div>
  );
};

export default ConnectionsList;
