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
  profileAddress: HexString | undefined;
  avatarSize: string;
  avatarUrl?: string;
}

const UserAvatar = ({
  profileAddress,
  avatarSize,
  avatarUrl,
}: UserAvatarProps): JSX.Element => {
  const identiconURL = avatarUrl
    ? avatarUrl
    : blockies.create({ seed: profileAddress }).toDataURL();
  return (
    <Avatar
      className="UserAvatar"
      alt={profileAddress || "anonymous"}
      src={identiconURL}
      size={avatarSizeOptions.get(avatarSize)}
    />
  );
};

export default UserAvatar;
