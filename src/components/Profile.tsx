import UserAvatar from "./UserAvatar";
import { Button } from "antd";
import ConnectionsList from "./ConnectionsList";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import * as types from "../utilities/types";

const Profile = (): JSX.Element => {
  const profile: types.Profile | undefined = useAppSelector(
    (state) => state.user.profile
  );

  const handle = profile?.handle;
  const [newName, setNewName] = useState<string | null>(null);
  const [newHandle, setNewHandle] = useState<string | null>(null);
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
  }, [newName, newHandle, profileName]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const getClassName = (sectionName: string) => {
    return isEditing
      ? `ProfileBlock__${sectionName} ProfileBlock__editing`
      : `ProfileBlock__${sectionName}`;
  };

  const saveEditProfile = () => {
    //this is where we write to the blockchain
    setIsEditing(!isEditing);
  };

  const cancelEditProfile = () => {
    setIsEditing(!isEditing);
    setNewName(null);
    setNewHandle(null);
  };

  return (
    <>
      <div className="ProfileBlock__personalInfoBlock">
        <div className="ProfileBlock__avatarBlock">
          <UserAvatar
            profileAddress={profile?.socialAddress}
            avatarSize="large"
          />
          {isEditing ? (
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
            className={getClassName("handle")}
            value={newHandle || newHandle === "" ? newHandle : handle}
            onChange={(e) => setNewHandle(e.target.value)}
            disabled={!isEditing}
          />
          <label className="ProfileBlock__personalInfoLabel">
            SOCIAL ADDRESS
          </label>
          <input
            className={getClassName("socialAddress")}
            value={profile?.socialAddress || "Anonymous"}
            disabled={true}
          />
        </div>
      </div>
      <ConnectionsList />
    </>
  );
};

export default Profile;
