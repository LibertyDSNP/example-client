import UserAvatar from "./UserAvatar";
import { Button } from "antd";
import ConnectionsList from "./ConnectionsList";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import * as types from "../utilities/types";
import { ProfileQuery, saveProfile } from "../services/content";
import { core } from "@dsnp/sdk";
import GraphChangeButton from "./GraphChangeButton";

const Profile = (): JSX.Element => {
  const userId: string | undefined = useAppSelector((state) => state.user.id);

  const followedByCurrentuser = useAppSelector(
    (state) => (userId && state.graphs.following[userId]) || {}
  );

  const displayId: string | undefined = useAppSelector(
    (state) => state.user.displayId
  );

  const profiles: Record<types.HexString, types.User> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const user: types.User | undefined = displayId
    ? profiles[displayId]
    : undefined;

  const { data: profile } = ProfileQuery(user);

  const handle = user?.handle;
  const [newName, setNewName] = useState<string | undefined>();
  const [newHandle, setNewHandle] = useState<string | undefined>();
  const [didEditProfile, setDidEditProfile] = useState<boolean>(false);

  const profileName = profile?.name || "Anonymous";

  useEffect(() => {
    if (
      (newName && newName !== profileName) ||
      (newHandle && newHandle !== handle)
    ) {
      setDidEditProfile(true);
      return;
    }
    setDidEditProfile(false);
  }, [newName, newHandle, profileName, handle]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const getClassName = (sectionName: string) => {
    return isEditing
      ? `ProfileBlock__${sectionName} ProfileBlock__editing`
      : `ProfileBlock__${sectionName}`;
  };

  const saveEditProfile = async () => {
    setIsEditing(!isEditing);
    if (userId === undefined || newName === undefined) return;
    const newProfile = core.activityContent.createProfile({
      name: newName,
      icon: profile?.icon,
    });
    await saveProfile(BigInt(userId), newProfile);
  };

  const cancelEditProfile = () => {
    setIsEditing(!isEditing);
    setNewName(undefined);
    setNewHandle(undefined);
  };

  return (
    <>
      <div className="ProfileBlock__personalInfoBlock">
        <div className="ProfileBlock__avatarBlock">
          <UserAvatar user={user} avatarSize="large" />
          {userId === displayId &&
            (isEditing ? (
              <>
                <Button
                  className="ProfileBlock__editButton"
                  onClick={() => saveEditProfile()}
                  disabled={!didEditProfile}
                >
                  save
                </Button>
                <Button
                  className="ProfileBlock__editButton"
                  onClick={() => cancelEditProfile()}
                >
                  cancel
                </Button>
              </>
            ) : (
              <Button
                className="ProfileBlock__editButton"
                onClick={() => setIsEditing(!isEditing)}
              >
                edit
              </Button>
            ))}
          {userId && userId !== displayId && user && (
            <GraphChangeButton
              userId={userId}
              user={user}
              following={followedByCurrentuser}
            ></GraphChangeButton>
          )}
        </div>
        <div className="ProfileBlock__personalInfo">
          <label className="ProfileBlock__personalInfoLabel">NAME</label>
          <input
            className={getClassName("name")}
            value={newName || newName === "" ? newName : profileName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={!isEditing}
          />
          <label className="ProfileBlock__personalInfoLabel">HANDLE</label>
          <input
            className="ProfileBlock__handle"
            value={newHandle || newHandle === "" ? newHandle : handle}
            onChange={(e) => setNewHandle(e.target.value)}
            disabled={true}
          />
          <label className="ProfileBlock__personalInfoLabel">
            SOCIAL ADDRESS
          </label>
          <input
            className="ProfileBlock__dsnpUserId"
            value={displayId || "Anonymous"}
            disabled={true}
          />
        </div>
      </div>
      <ConnectionsList />
    </>
  );
};

export default Profile;
