import React, { useState } from "react";
import { Menu, Dropdown } from "antd";
import { CheckCircleOutlined, EllipsisOutlined } from "@ant-design/icons";
import { HexString } from "../utilities/types";

interface PostHashDropdownProps {
  hash: HexString;
  fromId: HexString;
  isReply?: boolean;
}

const PostHashDropdown = ({
  hash,
  fromId,
  isReply,
}: PostHashDropdownProps): JSX.Element => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const announcementURI = "dsnp://" + fromId + "/" + hash;

  const menu = (
    <Menu onClick={() => setIsVisible(true)}>
      <Menu.Item
        key="valid"
        onClick={() => {
          setIsCopied(true);
          setTimeout(function () {
            setIsCopied(false);
          }, 2000);
        }}
      >
        {isCopied ? (
          <div>
            <CheckCircleOutlined /> Copied!
          </div>
        ) : (
          <div
            className="PostHashDropdown__menuHash"
            onClick={() => navigator.clipboard.writeText(announcementURI)}
          >
            DSNP Announcement URI: {announcementURI}
          </div>
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
