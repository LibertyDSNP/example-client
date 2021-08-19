import React from "react";
import { Button, Popover } from "antd";
import { useAppSelector } from "../redux/hooks";
import UserAvatar from "./UserAvatar";
import { core } from "@dsnp/sdk";
import * as registry from "@dsnp/sdk/core/contracts/registry";
import { HexString, Profile } from "../utilities/types";
import { Registration } from "@dsnp/sdk/core/contracts/registry";

interface RegistrationModalProps {
  children: JSX.Element;
  visible: boolean;
  registrations: registry.Registration[];
  walletAddress: HexString;
  onIdResolved: (id: registry.Registration) => void;
}

const RegistrationModal = ({
  children,
  visible,
  registrations,
  onIdResolved,
}: RegistrationModalProps): JSX.Element => {
  const [selectedRegistration, setRegistration] = React.useState<
    registry.Registration | undefined
  >(undefined);

  const profiles: Record<HexString, Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const commitRegistration = () => {
    if (!selectedRegistration) return;
    onIdResolved(selectedRegistration);
  };

  const iconForRegistration = (
    registration: registry.Registration
  ): string | undefined =>
    profiles[
      core.identifiers.convertDSNPUserURIToDSNPUserId(registration.dsnpUserURI)
    ]?.icon?.[0].href;

  return (
    <Popover
      placement="bottomRight"
      visible={visible}
      content={
        <div className="RegistrationModal">
          <h2>Successful Login!</h2>
          You have multiple handles associated with your account.
          <h3>Select an account:</h3>
          <div className="RegistrationModal__registrations">
            selected registration: {selectedRegistration?.dsnpUserURI};
            {registrations.map((registration: Registration) => (
              <button
                className={`RegistrationModal__registration${
                  registration === selectedRegistration
                    ? " RegistrationModal__registration--selected"
                    : ""
                }`}
                onClick={() => setRegistration(registration)}
                key={registration.dsnpUserURI}
              >
                <UserAvatar
                  icon={iconForRegistration(registration)}
                  profileAddress={registration.dsnpUserURI}
                  avatarSize="small"
                />
                {`@${registration.handle}`}
              </button>
            ))}
            ,
          </div>
          <div className="RegistrationModal__footer">
            <Button
              className="RegistrationModal__footerBtn"
              key="post"
              type="primary"
              disabled={!selectedRegistration}
              onClick={commitRegistration}
            >
              Select Handle
            </Button>
          </div>
        </div>
      }
    >
      {children}
    </Popover>
  );
};

export default RegistrationModal;
