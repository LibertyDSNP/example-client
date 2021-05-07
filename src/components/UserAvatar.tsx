import React from "react";
import { Avatar } from "antd";
import { Profile } from "../utilities/types";
import * as blockies from "blockies-ts";

const avatarSizeOptions = new Map([
  ["small", 32],
  ["medium", 50],
  ["large", 100],
]);

interface UserAvatarProps {
  profile: Profile | null;
  avatarSize: string;
}

const UserAvatar = ({ profile, avatarSize }: UserAvatarProps): JSX.Element => {
  const identiconURL =
    profile?.socialAddress &&
    blockies.create({ seed: profile?.socialAddress }).toDataURL();
  return (
    <Avatar
      alt={profile?.name || "anonymous"}
      src={identiconURL}
      size={avatarSizeOptions.get(avatarSize)}
    />
  );
};

export default UserAvatar;
