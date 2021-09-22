import React from "react";
import { Avatar } from "antd";
import * as blockies from "blockies-ts";
import { User } from "../utilities/types";
import { ProfileQuery } from "../services/content";
import { userIdentification } from "../services/utilities";
import { UserOutlined } from "@ant-design/icons";
import { useAppSelector } from "../redux/hooks";

const avatarSizeOptions = new Map([
  ["small", 28],
  ["medium", 50],
  ["large", 100],
  ["xl", 150],
]);

interface UserAvatarProps {
  user: User | undefined;
  avatarSize: string;
}

const UserAvatar = ({ user, avatarSize }: UserAvatarProps): JSX.Element => {
  const { data: profile } = ProfileQuery(user);

  const tempIconUri: string | undefined = useAppSelector(
    (state) => state.user.tempIconUri
  );

  const iconURL =
    user === undefined
      ? undefined
      : profile?.icon?.[0]?.href ||
        blockies.create({ seed: user?.fromId }).toDataURL();

  const name = userIdentification(user, profile);

  return (
    <Avatar
      className="UserAvatar"
      alt={name}
      icon={<UserOutlined />}
      src={tempIconUri ? tempIconUri : iconURL}
      size={avatarSizeOptions.get(avatarSize)}
      style={{ minWidth: avatarSizeOptions.get(avatarSize) }}
    />
  );
};

export default UserAvatar;
