import React from "react";
import { Button, Popover } from "antd";
import * as registry from "@dsnp/sdk/core/contracts/registry";
import { HexString } from "../utilities/types";
import { DSNPUserURI } from "@dsnp/sdk/dist/types/core/identifiers";
import EditRegistrationAccordion from "./EditRegistrationAccordion";
import Logout from "./Logout";

interface RegistrationModalProps {
  children: JSX.Element;
  visible: boolean;
  registrations: registry.Registration[];
  walletAddress: HexString;
  onIdResolved: (uri: DSNPUserURI) => void;
  logout: () => void;
}

const RegistrationModal = ({
  children,
  visible,
  registrations,
  walletAddress,
  onIdResolved,
  logout,
}: RegistrationModalProps): JSX.Element => {
  const [hasRegistrations, setHasRegistrations] = React.useState<boolean>(
    false
  );

  const [
    isCreatingRegistration,
    setIsCreatingRegistration,
  ] = React.useState<boolean>(true);

  if (registrations.length) {
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

  /**
   * Create a popover with either registration or handle selection UI.
   */
  return (
    <Popover
      placement="bottomRight"
      visible={visible}
      content={
        <div className="RegistrationModal">
          <Button
            type="link"
            className="RegistrationModal__cancel"
            onClick={logout}
          >
            Cancel
          </Button>
          <p>Successfully connected to Wallet</p>
          <EditRegistrationAccordion
            isCreatingRegistration={isCreatingRegistration}
            walletAddress={walletAddress}
            onIdResolved={onIdResolved}
            hasRegistrations={hasRegistrations}
            setIsCreatingRegistration={setIsCreatingRegistration}
            registrations={registrations}
          />
          <Logout logout={logout} />
        </div>
      }
    >
      {children}
    </Popover>
  );
};

export default RegistrationModal;
