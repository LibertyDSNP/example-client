import UserAvatar from "./UserAvatar";
import { Button } from "antd";
import ConnectionsList from "./ConnectionsList";
import React from "react";
import { useAppSelector } from "../redux/hooks";
import * as types from "../utilities/types";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";

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

  const profileName = profile?.name || "Anonymous";

  const getClassName = (sectionName: string) => {
    return `ProfileBlock__${sectionName}`;
  };

  return (
    <>
      <div className="ProfileBlock__personalInfoBlock">
        <div className="ProfileBlock__avatarBlock">
          <UserAvatar profileAddress={profile?.fromId} avatarSize="large" />
        </div>
        <div className="ProfileBlock__personalInfo">
          <label className="ProfileBlock__personalInfoLabel">NAME</label>
          <input
            className={getClassName("name")}
            value={profileName}
            disabled={true}
          />
          <label className="ProfileBlock__personalInfoLabel">HANDLE</label>
          <input
            className={getClassName("handle")}
            value={handle}
            disabled={true}
          />
          <label className="ProfileBlock__personalInfoLabel">
            SOCIAL ADDRESS
          </label>
          <input
            className={getClassName("dsnpUserId")}
            value={profile?.fromId || "Anonymous"}
            disabled={true}
          />
        </div>
      </div>
      <ConnectionsList />
    </>
  );
};

export default Profile;
