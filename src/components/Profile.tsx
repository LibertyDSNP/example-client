import UserAvatar from "./UserAvatar";
import { Button } from "antd";
import ConnectionsList from "./ConnectionsList";
import React from "react";
import { useAppSelector } from "../redux/hooks";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";

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
    <div className="ProfileBlock__block">
      {userId && (
        <>
          <div className="ProfileBlock__personalInfoBlock">
            <div className="ProfileBlock__avatarBlock">
              <UserAvatar
                profileAddress={userId}
                avatarSize="large"
              />
              <Button className="ProfileBlock__editButton">edit</Button>
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
                className={getClassName("socialAddress")}
                value={userId || "Anonymous"}
                disabled={true}
              />
            </div>
          </div>
          <ConnectionsList />
        </>
      )}
    </div>
  );
};
export default ProfileBlock;
