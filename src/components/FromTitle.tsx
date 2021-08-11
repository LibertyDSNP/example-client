import React from "react";
import { Profile } from "../utilities/types";

interface FromTitleProps {
  profile: Partial<Profile>;
}

export const FromTitle = ({ profile }: FromTitleProps): JSX.Element => {
  const atHandle = profile.handle && "@" + profile.handle;
  const primary = profile.name || atHandle || profile.fromId;
  const secondary = profile.name ? atHandle : undefined;

  return (
    <span>
      {primary}
      {secondary && <span className="FromLine__secondary">{secondary}</span>}
    </span>
  );
};
