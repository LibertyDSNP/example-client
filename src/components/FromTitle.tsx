import React from "react";
import { Profile } from "../utilities/types";

interface FromTitleProps {
  profile: Partial<Profile>;
  isHoveringProfile?: boolean;
}

export const FromTitle = ({
  profile,
  isHoveringProfile,
}: FromTitleProps): JSX.Element => {
  const atHandle = profile.handle && "@" + profile.handle;
  const primary = profile.name || atHandle || profile.fromId;
  const secondary = profile.name ? atHandle : undefined;

  return (
    <span className="FromTitle__block">
      <span className={isHoveringProfile ? "FromTitle__primary--active" : ""}>
        {primary}
      </span>
      {secondary && <span className="FromLine__secondary">{secondary}</span>}
    </span>
  );
};
