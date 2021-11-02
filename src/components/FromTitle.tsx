import { ActivityContentProfile } from "@dsnp/sdk/core/activityContent";
import React from "react";
import { User } from "../utilities/types";

interface FromTitleProps {
  userInfo: Partial<User>;
  profile: ActivityContentProfile | undefined;
  isHoveringProfile?: boolean;
  isReply?: boolean;
}

export const FromTitle = ({
  userInfo,
  profile,
  isHoveringProfile,
  isReply,
}: FromTitleProps): JSX.Element => {
  const atHandle = userInfo?.handle && "@" + userInfo?.handle;
  const primary = atHandle;
  const secondary = profile?.name || userInfo?.fromId;

  const primaryClassName = () => {
    let className = "FromTitle__primary";
    if (isHoveringProfile) {
      className = className + " FromTitle__primary--active";
    }
    if (isReply) {
      className = className + " FromTitle__primary--reply";
    }
    return className;
  };

  return (
    <span className="FromTitle__block">
      <div className={primaryClassName()}>{primary}</div>
      {!isReply && <div className="FromTitle__secondary">{secondary}</div>}
    </span>
  );
};
