import React from "react";
import { Button, Space, Modal } from "antd";
import { useAppSelector } from "../redux/hooks";
import UserAvatar from "./UserAvatar";
import { core } from "@dsnp/sdk";
import * as registry from "@dsnp/sdk/core/contracts/registry";
import { HexString, Profile } from "../utilities/types";

interface RegistrationModalProps {
  registrations: registry.Registration[];
  onIdResolved: (id: registry.Registration) => void;
}

const RegistrationModal = ({
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
    <Modal
      className="Registration"
      closable={false}
      visible={true}
      width="35%"
      centered={false}
      title={"Successful Login!"}
      footer={[
        <Space>
          <Button
            className="Registration__footerBtn"
            key="post"
            type="primary"
            disabled={!selectedRegistration}
            onClick={commitRegistration}
          >
            Select Handle
          </Button>
        </Space>,
      ]}
    >
      <div className="Registration__registrations">
        {registrations.map((registration) => (
          <button
            className="Registration_registration"
            onClick={() => setRegistration(registration)}
          >
            <UserAvatar
              icon={iconForRegistration(registration)}
              profileAddress={registration.dsnpUserURI}
              avatarSize={"small"}
            />
            {registration.handle}
            <span>{registration === selectedRegistration ? "✅" : "◯"}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
};

export default RegistrationModal;
