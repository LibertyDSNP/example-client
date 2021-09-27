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
  isCreatingRegistration: boolean;
  walletAddress: HexString;
  onIdResolved: (uri: DSNPUserURI) => void;
}

const EditRegistration = ({
  logout,
  isCreatingRegistration,
  walletAddress,
  onIdResolved,
}: EditRegistrationProps): JSX.Element => {
  const userId = useAppSelector((state) => state.user.id);
  const [currentUser, setUserPreview] = useState<Registration | undefined>();

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
        <p className="EditRegistration__title">Edit</p>
      )}
      <RegistrationPreview currentRegistration={currentUser} />
      <EditRegistrationAccordion
        isCreatingRegistration={isCreatingRegistration}
        walletAddress={walletAddress}
        onIdResolved={onIdResolved}
        setUserPreview={setUserPreview}
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
