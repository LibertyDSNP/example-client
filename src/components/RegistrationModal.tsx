import React from "react";
import { Popover } from "antd";
import { HexString } from "../utilities/types";
import { DSNPUserURI } from "@dsnp/sdk/core/identifiers";
import { useAppSelector } from "../redux/hooks";
import EditRegistration from "./EditRegistration";

interface RegistrationModalProps {
  children: JSX.Element;
  visible: boolean;
  setRegistrationVisible: (value: boolean) => void;
  walletAddress: HexString;
  onIdResolved: (uri: DSNPUserURI) => void;
  logout: () => void;
}

const RegistrationModal = ({
  children,
  visible,
  setRegistrationVisible,
  walletAddress,
  onIdResolved,
  logout,
}: RegistrationModalProps): JSX.Element => {
  const userId = useAppSelector((state) => state.user.id);
  const registrations = useAppSelector((state) => state.user.registrations);
  const [hasRegistrations, setHasRegistrations] = React.useState<boolean>(
    false
  );

  const [
    isCreatingRegistration,
    setIsCreatingRegistration,
  ] = React.useState<boolean>(true);

  if (registrations?.length) {
    // Flip to select registration if we see registrations increase
    if (!hasRegistrations) {
      setHasRegistrations(true);
      setIsCreatingRegistration(false);
    }
  } else {
    // Flip to create registration if we see registrations decrease to zero
    if (hasRegistrations) {
      setHasRegistrations(false);
      setIsCreatingRegistration(true);
    }
  }

  const handleVisibleChange = () => {
    if (!userId) {
      logout();
    }
    setRegistrationVisible(!visible);
  };

  /**
   * Create a popover with either registration or handle selection UI.
   */
  return (
    <Popover
      placement="bottomRight"
      visible={visible}
      trigger="click"
      onVisibleChange={handleVisibleChange}
      content={
        <EditRegistration
          logout={logout}
          isCreatingRegistration={isCreatingRegistration}
          walletAddress={walletAddress}
          onIdResolved={onIdResolved}
        />
      }
    >
      {children}
    </Popover>
  );
};

export default RegistrationModal;
