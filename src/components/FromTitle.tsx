import { ActivityContentProfile } from "@dsnp/sdk/core/activityContent";
import React from "react";
import { User } from "../utilities/types";

interface FromTitleProps {
  userInfo: Partial<User>;
  profile: ActivityContentProfile | undefined;
  isHoveringProfile?: boolean;
}

export const FromTitle = ({
  userInfo,
  profile,
  isHoveringProfile,
}: FromTitleProps): JSX.Element => {
  const atHandle = userInfo.handle && "@" + userInfo.handle;
  const primary = profile?.name || atHandle || userInfo.fromId;
  const secondary = profile?.name ? atHandle : undefined;

  return (
    <span className="FromTitle__block">
      <span className={isHoveringProfile ? "FromTitle__primary--active" : ""}>
        {primary}
      </span>
      {secondary && <span className="FromLine__secondary">{secondary}</span>}
    </span>
  );
};
