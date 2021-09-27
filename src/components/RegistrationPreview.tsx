import React from "react";
import UserAvatar from "./UserAvatar";
import { useAppSelector } from "../redux/hooks";
import * as types from "../utilities/types";
import { Registration } from "@dsnp/sdk/core/contracts/registry";
import { convertToDSNPUserId } from "@dsnp/sdk/core/identifiers";

interface RegistrationPreviewProps {
  registrationPreview: Registration | undefined;
}

const RegistrationPreview = ({
  registrationPreview,
}: RegistrationPreviewProps): JSX.Element => {
  const curId = registrationPreview
    ? convertToDSNPUserId(registrationPreview.dsnpUserURI).toString()
    : undefined;
  const userId = useAppSelector((state) => state.user.id);
  const profiles: Record<types.HexString, types.User> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );
  const user: types.User | undefined = curId
    ? profiles[curId]
    : userId
    ? profiles[userId]
    : undefined;

  return (
    <div className="RegistrationPreview__block">
      <UserAvatar user={user} avatarSize={"medium"} />
      <div
        className={`RegistrationPreview__infoBlock ${
          !user && "RegistrationPreview__infoBlock--unselected"
        }`}
      >
        <div className="RegistrationPreview__handle">@{user?.handle}</div>
        <div className="RegistrationPreview__id">
          {user?.name || user?.fromId || "0000"}
        </div>
      </div>
    </div>
  );
};

export default RegistrationPreview;
