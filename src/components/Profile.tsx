import UserAvatar from "./UserAvatar";
import { Button } from "antd";
import ConnectionsList from "./ConnectionsList";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import * as types from "../utilities/types";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import { saveProfile } from "../services/sdk";
import { core } from "@dsnp/sdk";

const Profile = (): JSX.Element => {
  const userId: DSNPUserId | undefined = useAppSelector(
    (state) => state.user.id
  );

  const displayId: DSNPUserId | undefined = useAppSelector(
    (state) => state.user.displayId
  );

  const profiles: Record<types.HexString, types.Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const profile: types.Profile | undefined = displayId
    ? profiles[displayId]
    : undefined;

  const handle = profile?.handle;
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
    if (displayId === undefined || newName === undefined) return;
    const newProfile = core.activityContent.createProfile({
      name: newName,
      icon: profile?.icon,
    });
    await saveProfile(displayId, newProfile);
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
          <UserAvatar
            icon={(profile?.icon || [])[0]?.href}
            profileAddress={displayId}
            avatarSize="large"
          />
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
