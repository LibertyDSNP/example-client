import React from "react";
import { Alert, Button, Form, Input, Popover } from "antd";
import { useAppSelector } from "../redux/hooks";
import UserAvatar from "./UserAvatar";
import { core, createRegistration } from "@dsnp/sdk";
import * as registry from "@dsnp/sdk/core/contracts/registry";
import { HexString, Profile } from "../utilities/types";
import { Registration } from "@dsnp/sdk/core/contracts/registry";
import { DSNPUserURI } from "@dsnp/sdk/dist/types/core/identifiers";

interface RegistrationModalProps {
  children: JSX.Element;
  visible: boolean;
  registrations: registry.Registration[];
  walletAddress: HexString;
  onIdResolved: (uri: DSNPUserURI) => void;
}

const RegistrationModal = ({
  children,
  visible,
  registrations,
  walletAddress,
  onIdResolved,
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

  const profiles: Record<HexString, Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  // Flip to select registration if we see registrations increase
  if (registrations.length && !hasRegistrations) {
    setHasRegistrations(true);
    setIsCreatingRegistration(false);
  }

  const commitRegistration = () => {
    if (!selectedRegistration) return;
    onIdResolved(selectedRegistration.dsnpUserURI);
  };

  const register = async (formValues: { handle: string }) => {
    try {
      const userURI = await createRegistration(
        walletAddress,
        formValues.handle
      );
      onIdResolved(userURI);
    } catch (error) {
      console.error(error);
      setRegistrationError(
        `Error registering: ${error.message || error.toString()}`
      );
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error(errorInfo);
  };

  const iconForRegistration = (
    registration: registry.Registration
  ): string | undefined =>
    profiles[
      core.identifiers.convertDSNPUserURIToDSNPUserId(registration.dsnpUserURI)
    ]?.icon?.[0].href;

  const registerNewHandleForm = (
    <Form
      name="createHandle"
      initialValues={{
        remember: true,
      }}
      onFinish={register}
      onFinishFailed={onFinishFailed}
    >
      {registrationError && <Alert message={registrationError} type="error" />}
      <p>Please create a handle:</p>
      <Form.Item
        name="handle"
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
              icon={iconForRegistration(registration)}
              profileAddress={registration.dsnpUserURI}
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

  return (
    <Popover
      placement="bottomRight"
      visible={visible}
      content={
        <div className="RegistrationModal">
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
