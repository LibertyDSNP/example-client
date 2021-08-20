import React from "react";
import { Button, Form, Input, Popover } from "antd";
import { createRegistration } from "@dsnp/sdk";

interface RegisterProps {
  walletAddress: string;
  onSuccess: (fromId: string) => void;
  onFailure: (e: Error) => void;
}

const Register = (registerOptions: RegisterProps): JSX.Element => {
  const [
    createHandleFormVisible,
    setCreateHandleFormVisible,
  ] = React.useState<boolean>(true);

  const register = async (formValues: { handle: string }) => {
    try {
      const userId = await createRegistration(
        registerOptions.walletAddress,
        formValues.handle
      );
      if (userId) {
        registerOptions.onSuccess(userId.replace("dsnp://", ""));
      }
    } catch (error) {
      registerOptions.onFailure(error);
    } finally {
      setCreateHandleFormVisible(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error(errorInfo);
  };

  const popoverContent = (
    <Form
      name="createHandle"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={register}
      onFinishFailed={onFinishFailed}
    >
      <h3>Welcome!</h3>
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
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Choose handle
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <Popover
      visible={createHandleFormVisible}
      placement="bottom"
      content={popoverContent}
      trigger="hover"
    />
  );
};

export default Register;
