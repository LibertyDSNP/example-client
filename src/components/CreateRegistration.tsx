import { Button, Form, Input, Spin } from "antd";
import React from "react";
import * as dsnp from "../services/dsnp";
import { core } from "@dsnp/sdk";
import { HexString } from "../utilities/types";
import { DSNPUserURI } from "@dsnp/sdk/core/identifiers";
import { setRegistrations } from "../redux/slices/userSlice";
import { useAppDispatch } from "../redux/hooks";
import { friendlyError } from "../services/errors";
import { Registration } from "@dsnp/sdk/core/contracts/registry";
import { CloseCircleOutlined } from "@ant-design/icons";
import * as session from "../services/session";

interface CreateRegistrationProps {
  walletAddress: HexString;
  onIdResolved: (uri: DSNPUserURI) => void;
  setRegistrationPreview: (registration: Registration | undefined) => void;
}

const CreateRegistration = ({
  walletAddress,
  onIdResolved,
  setRegistrationPreview,
}: CreateRegistrationProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const [registrationError, setRegistrationError] = React.useState<
    string | undefined
  >(undefined);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const [form] = Form.useForm();

  // create new DSNP registration
  const register = async (formValues: { handle: string }) => {
    setRegistrationPreview(undefined);
    form.resetFields();
    try {
      setIsSaving(true);
      const userURI = await dsnp.createNewDSNPRegistration(
        walletAddress,
        formValues.handle
      );
      onIdResolved(core.identifiers.convertToDSNPUserId(userURI).toString());
      const registrations = await dsnp.getSocialIdentities(walletAddress);
      dispatch(setRegistrations(registrations));
      session.upsertSessionRegistrations(registrations);
      setIsSaving(false);
    } catch (error: any) {
      console.error(error);
      setRegistrationError(friendlyError(error, formValues.handle));
      setIsSaving(false);
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
        <div className="RegistrationModal__inputWrapper">
          <Input
            className="RegistrationModal__input"
            onChange={() => setRegistrationError(undefined)}
          />
          <div className="RegistrationModal__inputAt">@</div>
        </div>
      </Form.Item>
      {isSaving && <Spin className="RegistrationModal__spinner" />}
      {registrationError && (
        <div className="RegistrationModal__errorBlock">
          <CloseCircleOutlined className="RegistrationModal__errorIcon" />
          <p>{registrationError}</p>
        </div>
      )}
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
