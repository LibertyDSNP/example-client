import React, { useState } from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "antd";
import ConnectionsList from "./ConnectionsList";
import { useAppSelector } from "../redux/hooks";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import SettingsIcon from "../images/SettingsIcon.svg";
import ArrowIcon from "../images/ArrowIcon.svg";

const Profile = (): JSX.Element => {
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const userId: DSNPUserId | undefined = useAppSelector(
    (state) => state.user.id
  );
  const handle = "Hans";
  const profileName = "lovetoeat";

  return (
    <div
      className={`Profile__block ${showProfile && "Profile__block--showing"}`}
    >
      <div className="Profile__headerBlock">
        <div onClick={() => setShowProfile(!showProfile)}>
          <img
            className={`Profile__headerBackArrow ${
              showProfile && "Profile__headerBackArrow--rotate"
            }`}
            src={ArrowIcon}
            alt="arrow icon"
          />
        </div>
        <div>
          <label className="Profile__personalInfoLabel--white">HANDLE</label>
          <div className="Profile__handle">@{handle}</div>
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
            <div className="Profile__name">{profileName}</div>
          </div>
        </div>
        <img
          className="Profile__editButton"
          src={SettingsIcon}
          alt="settings icon"
        />
      </div>
      <ConnectionsList />
    </div>
  );
};

export default Profile;
