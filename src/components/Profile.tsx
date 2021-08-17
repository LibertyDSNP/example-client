import React, { useState } from "react";
import UserAvatar from "./UserAvatar";
import ConnectionsList from "./ConnectionsList";
import { useAppSelector } from "../redux/hooks";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import SettingsIcon from "../images/SettingsIcon.svg";
import ArrowIcon from "../images/ArrowIcon.svg";
import * as types from "../utilities/types";

const Profile = (): JSX.Element => {
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const userId: DSNPUserId | undefined = useAppSelector(
    (state) => state.user.id
  );

  const profiles: Record<DSNPUserId, types.Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const handle = userId && profiles[userId]?.handle;
  const profileName = userId && profiles[userId]?.name;
  const avatar =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Hans_Ulrich_Obrist_2017.jpg/440px-Hans_Ulrich_Obrist_2017.jpg";

  return (
    <div
      className={`Profile__block ${showProfile && "Profile__block--showing"}`}
    >
      <div
        className="Profile__headerBlock"
        onClick={() => setShowProfile(!showProfile)}
      >
        <img
          className={`Profile__headerBackArrow ${
            showProfile && "Profile__headerBackArrow--rotate"
          }`}
          src={ArrowIcon}
          alt="arrow icon"
        />

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
            avatarUrl={avatar}
          />
          <div className="Profile__personalInfo">
            <label className="Profile__personalInfoLabel">NAME</label>
            <div className="Profile__name">{profileName || userId}</div>
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
