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
  const atHandle = userInfo.handle && "@" + userInfo.handle;
  const primary = atHandle;
  const secondary = profile?.name || userInfo.fromId;

  return (
    <span className="FromTitle__block">
      <div
        className={`FromTitle__primary ${
          isHoveringProfile ? "FromTitle__primary--active" : ""
        }`}
      >
        {primary}
      </div>
      {!isReply && <div className="FromLine__secondary">{secondary}</div>}
    </span>
  );
};
