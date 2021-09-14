import { Button } from "antd";
import EditRegistrationAccordion from "./EditRegistrationAccordion";
import React from "react";
import { HexString } from "../utilities/types";
import { DSNPUserURI } from "@dsnp/sdk/core/identifiers";
import { useAppSelector } from "../redux/hooks";

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
      <EditRegistrationAccordion
        isCreatingRegistration={isCreatingRegistration}
        walletAddress={walletAddress}
        onIdResolved={onIdResolved}
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
