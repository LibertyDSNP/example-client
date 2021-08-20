import UserAvatar from "./UserAvatar";
import { Button } from "antd";
import ConnectionsList from "./ConnectionsList";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import * as types from "../utilities/types";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import { saveProfile } from "../services/sdk";
import { core } from "@dsnp/sdk";
import CopyIcon from "../images/Copy_Icon.svg";
import GreenCheck from "../images/Green_Check.svg";

const Profile = (): JSX.Element => {
  const userId: DSNPUserId | undefined = useAppSelector(
    (state) => state.user.id
  );
  const profiles: Record<types.HexString, types.Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const profile: types.Profile | undefined = userId
    ? profiles[userId]
    : undefined;

  const handle = profile?.handle;
  const [newName, setNewName] = useState<string | undefined>();
  const [newHandle, setNewHandle] = useState<string | undefined>();
  const [didEditProfile, setDidEditProfile] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

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
    await saveProfile(userId, newProfile);
  };

  const cancelEditProfile = () => {
    setIsEditing(!isEditing);
    setNewName(undefined);
    setNewHandle(undefined);
  };

  return (
    <>
      <div className="Profile__personalInfoBlock">
        <div className="Profile__avatarBlock">
          <UserAvatar
            icon={(profile?.icon || [])[0]?.href}
            profileAddress={userId}
            avatarSize="large"
          />
          {isEditing ? (
            <>
              <Button
                className="Profile__editButton"
                onClick={() => saveEditProfile()}
                disabled={!didEditProfile}
              >
                save
              </Button>
              <Button
                className="Profile__editButton"
                onClick={() => cancelEditProfile()}
              >
                cancel
              </Button>
            </>
          ) : (
            <Button
              className="Profile__editButton"
              onClick={() => setIsEditing(!isEditing)}
            >
              edit
            </Button>
          )}
        </div>
        <div className="Profile__personalInfo">
          <label className="Profile__personalInfoLabel">NAME</label>
          <input
            className={getClassName("name")}
            value={newName || newName === "" ? newName : profileName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={!isEditing}
          />
          <label className="Profile__personalInfoLabel">HANDLE</label>
          <input
            className="Profile__handle"
            value={newHandle || newHandle === "" ? newHandle : handle}
            onChange={(e) => setNewHandle(e.target.value)}
            disabled={true}
          />
          <label className="Profile__personalInfoLabel">SOCIAL ADDRESS</label>
          <div className="Profile__socialAddressCopyBlock">
            <input
              className="Profile__dsnpUserId"
              value={userId || "Anonymous"}
              disabled={true}
            />
            <button
              className="Profile__copyButton"
              onClick={() => {
                navigator.clipboard
                  .writeText(userId || "Anonymous")
                  .then(() => console.log("copied address to clipboard"));
                setIsCopied(true);
                setTimeout(() => {
                  setIsCopied(false);
                }, 2000);
              }}
            >
              {!isCopied ? (
                <img src={CopyIcon} height={16} alt="copy" />
              ) : (
                <img src={GreenCheck} height={16} alt="success" />
              )}
            </button>
          </div>
        </div>
      </div>
      <ConnectionsList />
    </>
  );
};

export default Profile;
