import { Alert, Button, Form, Input } from "antd";
import React from "react";
import * as dsnp from "../services/dsnp";
import { core } from "@dsnp/sdk";
import { HexString } from "../utilities/types";
import { DSNPUserURI } from "@dsnp/sdk/core/identifiers";

interface CreateRegistrationProps {
  walletAddress: HexString;
  onIdResolved: (uri: DSNPUserURI) => void;
  hasRegistrations: boolean;
  setIsCreatingRegistration: (value: boolean) => void;
}

const CreateRegistration = ({
  walletAddress,
  onIdResolved,
  hasRegistrations,
  setIsCreatingRegistration,
}: CreateRegistrationProps): JSX.Element => {
  const [registrationError, setRegistrationError] = React.useState<
    string | undefined
  >(undefined);

  // create new DSNP registration
  const register = async (formValues: { handle: string }) => {
    try {
      const userURI = await dsnp.createNewDSNPRegistration(
        walletAddress,
        formValues.handle
      );
      console.log("here1", userURI);
      onIdResolved(core.identifiers.convertToDSNPUserId(userURI).toString());
      console.log("here2");
    } catch (error) {
      console.error(error);
      setRegistrationError(
        `Error registering: ${error.message || error.toString()}`
      );
    }
  };

  return (
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
};

export default CreateRegistration;
