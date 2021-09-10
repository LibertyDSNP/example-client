import React from "react";
import UserAvatar from "./UserAvatar";
import { useAppSelector } from "../redux/hooks";
import { HexString, Profile } from "../utilities/types";
import { Popover } from "antd";
import Logout from "./Logout";

interface RegistrationHubProps {
  logout: () => void;
}

const RegistrationHub = ({ logout }: RegistrationHubProps): JSX.Element => {
  const userId: string | undefined = useAppSelector((state) => state.user.id);
  const profiles: Record<HexString, Profile> = useAppSelector(
    (state) => state.profiles.profiles
  );
  const profile: Profile | undefined = userId ? profiles[userId] : undefined;

  const [popoverVisible, setPopoverVisible] = React.useState<boolean>(false);
  const handleVisibleChange = (visible: boolean) => {
    setPopoverVisible(visible);
    console.log("here", visible);
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
        <UserAvatar
          icon={profile?.icon?.[0]?.href}
          profileAddress={userId}
          avatarSize="small"
        />
        <div className="RegistrationHub__userTitle">
          {profile?.handle
            ? "@" + profile.handle
            : profile?.name || profile?.fromId}
        </div>
      </div>
    </Popover>
  );
};

export default RegistrationHub;
