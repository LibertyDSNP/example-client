import UserAvatar from "./UserAvatar";
import { Button } from "antd";
import ConnectionsList from "./ConnectionsList";
import React from "react";
import { useAppSelector } from "../redux/hooks";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import SettingsIcon from "../images/SettingsIcon.svg";
import ArrowIcon from "../images/ArrowIcon.svg";

const ProfileBlock = (): JSX.Element => {
  const userId: DSNPUserId | undefined = useAppSelector(
    (state) => state.user.id
  );

  const handle = "Hans";
  const profileName = "lovetoeat";

  const getClassName = (sectionName: string) => {
    return `ProfileBlock__${sectionName}`;
  };
  return (
    <div className="Profile__block">
      {userId && (
        <>
          <div className="Profile__personalInfoBlock">
            <div className="Profile__avatarBlock">
              <UserAvatar
                profileAddress={userId}
                avatarSize="large"
              />
              <Button className="Profile__editButton">edit</Button>
            </div>
            <div className="Profile__personalInfo">
              <label className="Profile__personalInfoLabel">NAME</label>
              <input
                className={getClassName("name")}
                value={profileName}
                disabled={true}
              />
              <label className="Profile__personalInfoLabel">HANDLE</label>
              <input
                className={getClassName("handle")}
                value={handle}
                disabled={true}
              />
              <label className="Profile__personalInfoLabel">
                SOCIAL ADDRESS
              </label>
              <input
                className={getClassName("socialAddress")}
                value={userId || "Anonymous"}
                disabled={true}
              />
            </div>
          </div>
          <ConnectionsList />
        </>
      )}
      <div className="Profile__headerBlock">
        <img className="Profile__headerBackArrow" src={ArrowIcon} />
        <div>
          <label className="Profile__personalInfoLabel--white">HANDLE</label>
          <div className={getClassName("handle")}>@{handle}</div>
        </div>
      </div>

      <div className="Profile__personalInfoBlock">
        <div className="Profile__avatarBlock">
          <UserAvatar
            profileAddress={userId}
            avatarSize="large"
          />
          <div className="Profile__personalInfo">
            <label className="Profile__personalInfoLabel">NAME</label>
            <div className={getClassName("name")}>{profileName}</div>
          </div>
        </div>
        <img className="Profile__editButton" src={SettingsIcon} />
      </div>
      <ConnectionsList />
    </div>
  );
};
export default ProfileBlock;
