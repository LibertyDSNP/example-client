import React from "react";
import { Profile } from "../utilities/types";

interface FromLineProps {
  profile: Profile;
}

export const FromLine = ({ profile }: FromLineProps): JSX.Element => {
  const atHandle = profile.handle && "@" + profile.handle;
  const primary = profile.name || atHandle || profile.socialAddress;
  const secondary = profile.name ? atHandle : undefined;

  return (
    <span>
      {primary}
      {secondary && <span className="FromLine__secondary">{secondary}</span>}
    </span>
  );
};
