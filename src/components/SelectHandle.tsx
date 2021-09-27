import { Registration } from "@dsnp/sdk/core/contracts/registry";
import UserAvatar from "./UserAvatar";
import { Button } from "antd";
import React from "react";
import * as registry from "@dsnp/sdk/core/contracts/registry";
import { core } from "@dsnp/sdk";
import { HexString, User } from "../utilities/types";
import { useAppSelector } from "../redux/hooks";
import { DSNPUserURI } from "@dsnp/sdk/core/identifiers";

interface SelectHandleProps {
  onIdResolved: (uri: DSNPUserURI) => void;
  registrations: registry.Registration[];
  setRegistrationPreview: (user: registry.Registration | undefined) => void;
}

const SelectHandle = ({
  onIdResolved,
  registrations,
  setRegistrationPreview,
}: SelectHandleProps): JSX.Element => {
  const [selectedRegistration, setRegistration] = React.useState<
    registry.Registration | undefined
  >(undefined);

  const profiles: Record<HexString, User> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );
  // convert registration to uri before calling callback
  const commitRegistration = () => {
    if (!selectedRegistration) return;
    onIdResolved(selectedRegistration.dsnpUserURI);
    setRegistrationPreview(undefined);
  };

  return (
    <div>
      <p>You have multiple handles associated with your account.</p>
      <h3>Select an account:</h3>
      <div className="RegistrationModal__registrations">
        {registrations.map((registration: Registration) => (
          <button
            className={`RegistrationModal__registration${
              registration === selectedRegistration
                ? " RegistrationModal__registration--selected"
                : ""
            }`}
            onClick={() => {
              setRegistration(registration);
              setRegistrationPreview(registration);
            }}
            key={registration.dsnpUserURI}
          >
            <UserAvatar
              user={
                profiles[
                  core.identifiers
                    .convertToDSNPUserId(registration.dsnpUserURI)
                    .toString()
                ]
              }
              avatarSize="small"
            />
            {`@${registration.handle}`}
          </button>
        ))}
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
  );
};

export default SelectHandle;
