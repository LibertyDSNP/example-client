import React from "react";
import { Collapse } from "antd";
import CreateRegistration from "./CreateRegistration";
import SelectHandle from "./SelectHandle";
import { HexString } from "../utilities/types";
import { DSNPUserURI } from "@dsnp/sdk/core/identifiers";
import { useAppSelector } from "../redux/hooks";
import { Registration } from "@dsnp/sdk/core/contracts/registry";
const { Panel } = Collapse;

interface EditRegistrationAccordionProps {
  isCreatingRegistration: boolean;
  walletAddress: HexString;
  onIdResolved: (uri: DSNPUserURI) => void;
  setUserPreview: (user: Registration | undefined) => void;
}

const EditRegistrationAccordion = ({
  isCreatingRegistration,
  walletAddress,
  onIdResolved,
  setUserPreview,
}: EditRegistrationAccordionProps): JSX.Element => {
  const userId = useAppSelector((state) => state.user.id);
  const registrations = useAppSelector((state) => state.user.registrations);

  const getDefaultActiveKey = () => {
    if (userId) return undefined;
    if (isCreatingRegistration) {
      return "0";
    }
    return "1";
  };
  return (
    <Collapse
      bordered={false}
      defaultActiveKey={getDefaultActiveKey()}
      expandIconPosition={"right"}
    >
      <Panel
        header={
          <p className="EditRegistrationAccordion__panelTitle">
            Create New Handle
          </p>
        }
        key={0}
      >
        <CreateRegistration
          walletAddress={walletAddress}
          onIdResolved={onIdResolved}
          setUserPreview={setUserPreview}
        />
      </Panel>
      {registrations && registrations.length > 1 && (
        <Panel
          header={
            <p className="EditRegistrationAccordion__panelTitle">
              Select Account Handle
            </p>
          }
          key={1}
        >
          <SelectHandle
            onIdResolved={onIdResolved}
            registrations={registrations}
            setUserPreview={setUserPreview}
          />
        </Panel>
      )}
    </Collapse>
  );
};

export default EditRegistrationAccordion;
