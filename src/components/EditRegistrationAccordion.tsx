import React from "react";
import { Collapse } from "antd";
import CreateRegistration from "./CreateRegistration";
import SelectHandle from "./SelectHandle";
import { HexString } from "../utilities/types";
import { DSNPUserURI } from "@dsnp/sdk/dist/types/core/identifiers";
import * as registry from "@dsnp/sdk/core/contracts/registry";
const { Panel } = Collapse;

interface EditRegistrationAccordionProps {
  isCreatingRegistration: boolean;
  walletAddress: HexString;
  onIdResolved: (uri: DSNPUserURI) => void;
  hasRegistrations: boolean;
  setIsCreatingRegistration: (value: boolean) => void;
  registrations: registry.Registration[];
}

const EditRegistrationAccordion = ({
  isCreatingRegistration,
  walletAddress,
  onIdResolved,
  hasRegistrations,
  setIsCreatingRegistration,
  registrations,
}: EditRegistrationAccordionProps): JSX.Element => {
  return (
    <Collapse defaultActiveKey={isCreatingRegistration ? ["0"] : ["1"]}>
      <Panel header={"Create New Handle"} key={0}>
        <CreateRegistration
          walletAddress={walletAddress}
          onIdResolved={onIdResolved}
          hasRegistrations={hasRegistrations}
          setIsCreatingRegistration={setIsCreatingRegistration}
        />
      </Panel>
      {registrations.length > 0 && (
        <Panel header={"Select Account Handle"} key={1}>
          <SelectHandle
            onIdResolved={onIdResolved}
            registrations={registrations}
            setIsCreatingRegistration={setIsCreatingRegistration}
          />
        </Panel>
      )}
    </Collapse>
  );
};

export default EditRegistrationAccordion;
