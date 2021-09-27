import { Alert, Button, Form, Input } from "antd";
import React, { useRef } from "react";
import * as dsnp from "../services/dsnp";
import { core } from "@dsnp/sdk";
import { HexString } from "../utilities/types";
import { DSNPUserURI } from "@dsnp/sdk/core/identifiers";
import { setRegistrations } from "../redux/slices/userSlice";
import { useAppDispatch } from "../redux/hooks";
import { friendlyError } from "../services/errors";
import { Registration } from "@dsnp/sdk/core/contracts/registry";

interface CreateRegistrationProps {
  walletAddress: HexString;
  onIdResolved: (uri: DSNPUserURI) => void;
  setUserPreview: (registration: Registration | undefined) => void;
}

const CreateRegistration = ({
  walletAddress,
  onIdResolved,
  setUserPreview,
}: CreateRegistrationProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const [registrationError, setRegistrationError] = React.useState<
    string | undefined
  >(undefined);

  const [form] = Form.useForm();

  // create new DSNP registration
  const register = async (formValues: { handle: string }) => {
    setUserPreview(undefined);
    form.resetFields();
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
      setRegistrationError(friendlyError(error));
    }
  };

  return (
    <Form
      form={form}
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
          Create Handle
        </Button>
      </div>
    </Form>
  );
};

export default CreateRegistration;
