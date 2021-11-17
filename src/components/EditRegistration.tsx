import { Button } from "antd";
import EditRegistrationAccordion from "./EditRegistrationAccordion";
import React, { useState } from "react";
import { HexString } from "../utilities/types";
import { DSNPUserURI } from "@dsnp/sdk/core/identifiers";
import { useAppSelector } from "../redux/hooks";
import RegistrationPreview from "./RegistrationPreview";
import { Registration } from "@dsnp/sdk/core/contracts/registry";

interface EditRegistrationProps {
  logout: () => void;
  walletAddress: HexString;
  onIdResolved: (uri: DSNPUserURI) => void;
  registrations: Registration[];
  registrationCreated: (registration: Registration) => void;
  setRegistrationPopoverVisible: (visible: boolean) => void;
}

const EditRegistration = ({
  logout,
  walletAddress,
  onIdResolved,
  registrations,
  registrationCreated,
  setRegistrationPopoverVisible,
}: EditRegistrationProps): JSX.Element => {
  const userId = useAppSelector((state) => state.user.id);
  const [registrationPreview, setRegistrationPreview] = useState<
    Registration | undefined
  >();

  return (
    <div className="EditRegistration">
      {!userId ? (
        <>
          <Button
            type="link"
            className="EditRegistration__cancel"
            onClick={logout}
          >
            Cancel
          </Button>
          <p className="EditRegistration__title">
            Successfully connected to your wallet.
          </p>
        </>
      ) : (
        <div className="EditRegistration__header">
          <p className="EditRegistration__title">Edit</p>
          <Button
            type="link"
            className="EditRegistration__closeModalButton"
            onClick={() => setRegistrationPopoverVisible(false)}
          >
            Cancel
          </Button>
        </div>
      )}
      <RegistrationPreview registrationPreview={registrationPreview} />
      <EditRegistrationAccordion
        walletAddress={walletAddress}
        onIdResolved={onIdResolved}
        setRegistrationPreview={setRegistrationPreview}
        registrations={registrations}
        registrationCreated={registrationCreated}
      />
      <Button
        className="EditRegistration__logoutButton"
        aria-label="Logout"
        onClick={logout}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default EditRegistration;
