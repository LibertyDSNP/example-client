import { Button, Form, Input, Spin } from "antd";
import React from "react";
import * as dsnp from "../services/dsnp";
import { core } from "@dsnp/sdk";
import { HexString } from "../utilities/types";
import { DSNPUserURI } from "@dsnp/sdk/core/identifiers";
import { friendlyError } from "../services/errors";
import { Registration } from "@dsnp/sdk/core/contracts/registry";
import { CloseCircleOutlined } from "@ant-design/icons";
import { logInfo } from "../services/logInfo";

interface CreateRegistrationProps {
  walletAddress: HexString;
  onIdResolved: (uri: DSNPUserURI) => void;
  setRegistrationPreview: (registration: Registration | undefined) => void;
  registrationCreated: (registration: Registration) => void;
}

const CreateRegistration = ({
  walletAddress,
  onIdResolved,
  setRegistrationPreview,
  registrationCreated,
}: CreateRegistrationProps): JSX.Element => {
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
      logInfo("registrationSearch", { handle: formValues.handle });
      const userURI = await dsnp.createNewDSNPRegistration(
        walletAddress,
        formValues.handle
      );
      logInfo("createHandle", { uri: userURI });
      onIdResolved(core.identifiers.convertToDSNPUserId(userURI).toString());
      registrationCreated({
        contractAddr: "",
        dsnpUserURI: userURI,
        handle: formValues.handle,
      });
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
      className="CreateRegistration__createHandle"
      initialValues={{
        remember: true,
      }}
      onFinish={register}
    >
      <Form.Item
        name="handle"
        className="CreateRegistration__handleInput"
        rules={[
          {
            required: true,
            message: "Handle cannot be blank",
          },
        ]}
      >
        <div className="CreateRegistration__inputWrapper">
          <Input
            className="CreateRegistration__input"
            onChange={() => setRegistrationError(undefined)}
          />
          <div className="CreateRegistration__inputAt">@</div>
        </div>
      </Form.Item>
      {isSaving && <Spin className="CreateRegistration__spinner" />}
      {registrationError && (
        <div className="CreateRegistration__footerBtn">
          <CloseCircleOutlined className="CreateRegistration__errorIcon" />
          <p>{registrationError}</p>
        </div>
      )}
      <div className="SelectHandle__footer">
        <Button
          type="primary"
          htmlType="submit"
          className="CreateRegistration__footerBtn"
        >
          Create Handle
        </Button>
      </div>
    </Form>
  );
};

export default CreateRegistration;
