import React, { useState } from "react";
import { Menu, Dropdown } from "antd";
import { CheckCircleOutlined, EllipsisOutlined } from "@ant-design/icons";
import { HexString } from "../utilities/types";

interface PostHashDropdownProps {
  hash: HexString;
  isReply?: boolean;
}

const PostHashDropdown = ({
  hash,
  isReply,
}: PostHashDropdownProps): JSX.Element => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const menu = (
    <Menu onClick={() => setIsVisible(true)} className="PostHashDropdown__menu">
      <Menu.Item
        className="PostHashDropdown__menuItem"
        key="valid"
        onClick={() => {
          navigator.clipboard.writeText(hash);
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 3000);
        }}
      >
        {isCopied ? (
          <div>
            <CheckCircleOutlined /> Copied!
          </div>
        ) : (
          <div className="PostHashDropdown__menuHash">Hash: {hash}</div>
        )}
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown
      className={
        isReply ? "PostHashDropdown__replyBlock" : "PostHashDropdown__block"
      }
      overlay={menu}
      visible={isVisible}
      onVisibleChange={(e) => setIsVisible(e)}
      placement="bottomRight"
    >
      <button
        className="PostHashDropdown__button"
        onClick={(e) => e.preventDefault()}
      >
        <EllipsisOutlined />
      </button>
    </Dropdown>
  );
};

export default PostHashDropdown;
