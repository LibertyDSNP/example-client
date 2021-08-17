import React from "react";
import { Button, Form, Input, Popover } from "antd";
import { createRegistration } from "@dsnp/sdk";
import { userLogin } from "../redux/slices/userSlice";
import * as session from "../services/session";

interface RegisterProps {
  walletAddress: string;
  onButtonClick: (fromId: string) => void;
}

const Register = ({
  walletAddress,
  onButtonClick,
}: RegisterProps): JSX.Element => {
  const [
    createHandleFormVisible,
    setCreateHandleFormVisible,
  ] = React.useState<boolean>(true);

  const register = async (formValues: { handle: string }) => {
    try {
      const userId = await createRegistration(walletAddress, formValues.handle);
      if (userId) {
        onButtonClick(userId);
      }
      setCreateHandleFormVisible(false);
    } catch (error) {
      console.log("Error in login:", error);
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
      <Form.Item
        label="New handle"
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
          Create this handle
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <Popover
      visible={createHandleFormVisible}
      placement="bottom"
      content={popoverContent}
      title="Create new handle"
      trigger="hover"
    />
  );
};

export default Register;
