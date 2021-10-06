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
  walletAddress: HexString;
  onIdResolved: (uri: DSNPUserURI) => void;
  setRegistrationPreview: (user: Registration | undefined) => void;
  registrations: Registration[];
  registrationCreated: (registration: Registration) => void;
}

const EditRegistrationAccordion = ({
  walletAddress,
  onIdResolved,
  setRegistrationPreview,
  registrations,
  registrationCreated,
}: EditRegistrationAccordionProps): JSX.Element => {
  const userId = useAppSelector((state) => state.user.id);

  const getDefaultActiveKey = () => {
    if (userId) return undefined;
    if (registrations.length === 0) {
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
          setRegistrationPreview={setRegistrationPreview}
          registrationCreated={registrationCreated}
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
            setRegistrationPreview={setRegistrationPreview}
          />
        </Panel>
      )}
    </Collapse>
  );
};

export default EditRegistrationAccordion;
