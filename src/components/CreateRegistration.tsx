import { Alert, Button, Form, Input } from "antd";
import React from "react";
import * as dsnp from "../services/dsnp";
import { core } from "@dsnp/sdk";
import { HexString } from "../utilities/types";
import { DSNPUserURI } from "@dsnp/sdk/core/identifiers";
import { setRegistrations } from "../redux/slices/userSlice";
import { useAppDispatch } from "../redux/hooks";

interface CreateRegistrationProps {
  walletAddress: HexString;
  onIdResolved: (uri: DSNPUserURI) => void;
}

const CreateRegistration = ({
  walletAddress,
  onIdResolved,
}: CreateRegistrationProps): JSX.Element => {
  const dispatch = useAppDispatch();
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
      onIdResolved(core.identifiers.convertToDSNPUserId(userURI).toString());
      const registrations = await dsnp.getSocialIdentities(walletAddress);
      dispatch(setRegistrations(registrations));
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
