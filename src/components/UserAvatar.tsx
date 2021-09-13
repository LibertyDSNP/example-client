import React from "react";
import { Avatar } from "antd";
import * as blockies from "blockies-ts";
import { User } from "../utilities/types";
import { ProfileQuery } from "../services/content";
import { userIdentification } from "../services/utilities";

const avatarSizeOptions = new Map([
  ["small", 32],
  ["medium", 50],
  ["large", 100],
]);

interface UserAvatarProps {
  user: User | undefined;
  avatarSize: string;
}

const UserAvatar = ({ user, avatarSize }: UserAvatarProps): JSX.Element => {
  const { data: profile } = ProfileQuery(user);

  const iconURL =
    profile?.icon?.[0]?.href ||
    blockies.create({ seed: user?.fromId || "unknown" }).toDataURL();

  const name = userIdentification(user, profile);

  return (
    <Avatar
      className="UserAvatar"
      alt={name}
      src={iconURL}
      size={avatarSizeOptions.get(avatarSize)}
    />
  );
};

export default UserAvatar;
