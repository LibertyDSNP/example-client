import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useAppSelector } from "../redux/hooks";
import ConnectionsList from "./ConnectionsList";
import UserAvatar from "./UserAvatar";

const ProfileBlock = (): JSX.Element => {
  const profile = useAppSelector((state) => state.user.profile);
  const socialAddress = profile?.socialAddress;

  const handle = "insert_handle_here";
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string | null>(null);
  const [newHandle, setNewHandle] = useState<string | null>(null);
  const [didEditProfile, setDidEditProfile] = useState<boolean>(false);

  const profileName = profile?.name || "Anonymous";

  useEffect(() => {
    if (isEditing) {
      if (
        (newName !== null && newName !== profileName) ||
        (newHandle !== null && newHandle !== handle)
      ) {
        setDidEditProfile(true);
        return;
      }
      setDidEditProfile(false);
    }
  }, [isEditing, newName, newHandle, profileName]);

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
    <div className="ProfileBlock__block">
      {socialAddress ? (
        <>
          <div className="ProfileBlock__personalInfoBlock">
            <div className="ProfileBlock__avatarBlock">
              <UserAvatar profile={profile || null} avatarSize="large" />
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
                value={socialAddress || "Anonymous"}
                disabled={true}
              />
            </div>
          </div>
          <ConnectionsList />
        </>
      ) : (
        <div className="ProfileBlock__loginText">
          Login With MetaMask/Taurus
        </div>
      )}
    </div>
  );
};
export default ProfileBlock;
