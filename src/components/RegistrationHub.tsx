import React from "react";
import UserAvatar from "./UserAvatar";
import { useAppSelector } from "../redux/hooks";
import { HexString, User } from "../utilities/types";
import { Popover } from "antd";
import Logout from "./Logout";
import { UserName } from "./UserName";

interface RegistrationHubProps {
  logout: () => void;
}

const RegistrationHub = ({ logout }: RegistrationHubProps): JSX.Element => {
  const userId: string | undefined = useAppSelector((state) => state.user.id);
  const profiles: Record<HexString, User> = useAppSelector(
    (state) => state.profiles.profiles
  );
  const user: User | undefined = userId ? profiles[userId] : undefined;

  const [popoverVisible, setPopoverVisible] = React.useState<boolean>(false);
  const handleVisibleChange = (visible: boolean) => {
    setPopoverVisible(visible);
  };
  return (
    <Popover
      className="RegistrationHub__block"
      placement="bottomRight"
      trigger="click"
      visible={popoverVisible}
      onVisibleChange={handleVisibleChange}
      content={
        <>
          <Logout logout={logout} />
        </>
      }
    >
      <div className="RegistrationHub__userBlock">
        <UserAvatar user={user} avatarSize="small" />
        <div className="RegistrationHub__userTitle">
          {user && <UserName user={user} />}
        </div>
      </div>
    </Popover>
  );
};

export default RegistrationHub;
