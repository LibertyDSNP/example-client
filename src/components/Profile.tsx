import UserAvatar from "./UserAvatar";
import ConnectionsList from "./ConnectionsList";
import React from "react";
import { useAppSelector } from "../redux/hooks";
import * as types from "../utilities/types";
import SettingsIcon from "../images/SettingsIcon.svg";
import ArrowIcon from "../images/ArrowIcon.svg";

const Profile = (): JSX.Element => {
  const profile: types.Profile | undefined = useAppSelector(
    (state) => state.user.profile
  );

  const handle = "Hans";
  const profileName = "lovetoeat";

  const getClassName = (sectionName: string) => {
    return `Profile__${sectionName}`;
  };
  return (
    <div className="Profile__block">
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
            profileAddress={profile?.socialAddress}
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

export default Profile;
