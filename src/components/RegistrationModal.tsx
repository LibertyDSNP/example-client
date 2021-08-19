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
          <div className="Registration__registrations">
            {registrations.map((registration: Registration) => (
              <button
                className={`Registration__registration${
                  registration === selectedRegistration
                    ? " Registration__registration--selected"
                    : ""
                }`}
                onClick={() => setRegistration(registration)}
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
          <div className="Registration__footer">
            <Button
              className="Registration__footerBtn"
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
