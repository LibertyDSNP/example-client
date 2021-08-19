import React from "react";
import { Avatar } from "antd";
import { HexString } from "../utilities/types";
import * as blockies from "blockies-ts";

const avatarSizeOptions = new Map([
  ["small", 32],
  ["medium", 50],
  ["large", 100],
]);

interface UserAvatarProps {
  icon: string | undefined;
  profileAddress: HexString | undefined;
  avatarSize: string;
}

const UserAvatar = ({
  icon,
  profileAddress,
  avatarSize,
}: UserAvatarProps): JSX.Element => {
  const iconURL =
    icon ||
    (profileAddress && blockies.create({ seed: profileAddress }).toDataURL());
  return (
    <Avatar
      className="UserAvatar"
      alt={profileAddress || "anonymous"}
      src={iconURL}
      size={avatarSizeOptions.get(avatarSize)}
    />
  );
};

export default UserAvatar;
