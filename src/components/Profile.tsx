import UserAvatar from "./UserAvatar";
import { Button } from "antd";
import ConnectionsList from "./ConnectionsList";
import React from "react";
import { useAppSelector } from "../redux/hooks";
import * as types from "../utilities/types";

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
      <div className="Profile__personalInfoBlock">
        <div className="Profile__avatarBlock">
          <UserAvatar
            profileAddress={profile?.socialAddress}
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
          <label className="Profile__personalInfoLabel">SOCIAL ADDRESS</label>
          <input
            className={getClassName("socialAddress")}
            value={profile?.socialAddress || "Anonymous"}
            disabled={true}
          />
        </div>
      </div>
      <ConnectionsList />
    </div>
  );
};

export default Profile;
