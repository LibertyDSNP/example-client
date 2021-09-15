import React from "react";
import { Alert, Button, Form, Input, Popover } from "antd";
import UserAvatar from "./UserAvatar";
import { core } from "@dsnp/sdk";
import * as dsnp from "../services/dsnp";
import * as registry from "@dsnp/sdk/core/contracts/registry";
import { HexString } from "../utilities/types";
import { Registration } from "@dsnp/sdk/core/contracts/registry";
import { DSNPUserURI } from "@dsnp/sdk/dist/types/core/identifiers";

interface RegistrationModalProps {
  children: JSX.Element;
  visible: boolean;
  registrations: registry.Registration[];
  walletAddress: HexString;
  onIdResolved: (uri: DSNPUserURI) => void;
  onCancel: () => void;
}

const RegistrationModal = ({
  children,
  visible,
  registrations,
  walletAddress,
  onIdResolved,
  onCancel,
}: RegistrationModalProps): JSX.Element => {
  const [hasRegistrations, setHasRegistrations] = React.useState<boolean>(
    false
  );

  const [
    isCreatingRegistration,
    setIsCreatingRegistration,
  ] = React.useState<boolean>(true);

  const [registrationError, setRegistrationError] = React.useState<
    string | undefined
  >(undefined);

  const [selectedRegistration, setRegistration] = React.useState<
    registry.Registration | undefined
  >(undefined);

  if (registrations.length) {
    // Flip to select registration if we see registrations increase
    if (!hasRegistrations) {
      setHasRegistrations(true);
      setIsCreatingRegistration(false);
    }
  } else {
    // Flip to create registration if we see registrations decrease to zero
    if (hasRegistrations) {
      setHasRegistrations(false);
      setIsCreatingRegistration(true);
    }
  }

  // convert registration to uri before calling callback
  const commitRegistration = () => {
    if (!selectedRegistration) return;
    onIdResolved(selectedRegistration.dsnpUserURI);
  };

  // create new DSNP registration
  const register = async (formValues: { handle: string }) => {
    try {
      const userURI = await dsnp.createNewDSNPRegistration(
        walletAddress,
        formValues.handle
      );
      onIdResolved(core.identifiers.convertToDSNPUserId(userURI).toString());
    } catch (error) {
      console.error(error);
      setRegistrationError(
        `Error registering: ${error.message || error.toString()}`
      );
    }
  };

  /**
   * New Registration Form
   */
  const registerNewHandleForm = (
    <Form
      name="createHandle"
      className="RegistrationModal__createHandle"
      initialValues={{
        remember: true,
      }}
      onFinish={register}
    >
      {registrationError && (
        <>
          <Alert message={registrationError} type="error" />
        </>
      )}
      <p>Please create a handle:</p>
      <Form.Item
        name="handle"
        className="RegistrationModal__handleInput"
        rules={[
          {
            required: true,
            message: "Handle cannot be blank",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <div className="RegistrationModal__footer">
        {hasRegistrations && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsCreatingRegistration(false);
            }}
            className="RegisrationModal__changeMode"
          >
            Select Existing Handle
          </button>
        )}
        <Button
          type="primary"
          htmlType="submit"
          className="RegistrationModal__footerBtn"
        >
          Choose handle
        </Button>
      </div>
    </Form>
  );

  /**
   * Select Existing Handle UI
   */
  const selectHandleContent = (
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
            onClick={() => setRegistration(registration)}
            key={registration.dsnpUserURI}
          >
            <UserAvatar
              user={{
                fromId: core.identifiers
                  .convertToDSNPUserId(registration.dsnpUserURI)
                  .toString(),
                blockNumber: 0,
                blockIndex: 0,
                batchIndex: 0,
              }}
              avatarSize="small"
            />
            {`@${registration.handle}`}
          </button>
        ))}
      </div>
      <div className="RegistrationModal__footer">
        <button
          onClick={() => setIsCreatingRegistration(true)}
          className="RegisrationModal__changeMode"
        >
          Create New Handle
        </button>
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

  /**
   * Create a popover with either registration or handle selection UI.
   */
  return (
    <Popover
      placement="bottomRight"
      visible={visible}
      content={
        <div className="RegistrationModal">
          <Button
            type="link"
            className="RegistrationModal__cancel"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <h2>Welcome!</h2>
          {isCreatingRegistration ? registerNewHandleForm : selectHandleContent}
        </div>
      }
    >
      {children}
    </Popover>
  );
};

export default RegistrationModal;
