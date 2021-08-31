import React, { useState } from "react";
import { Menu, Dropdown } from "antd";
import { CheckCircleOutlined, CopyOutlined } from "@ant-design/icons";
import {
  buildDSNPAnnouncementURI,
  DSNPUserId,
  DSNPAnnouncementURI,
} from "@dsnp/sdk/core/identifiers";
import { HexString } from "../utilities/types";

interface PostHashDropdownProps {
  hash: HexString;
  fromId: DSNPUserId;
  isReply?: boolean;
}

const PostHashDropdown = ({
  hash,
  fromId,
  isReply,
}: PostHashDropdownProps): JSX.Element => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const announcementURI: DSNPAnnouncementURI = buildDSNPAnnouncementURI(
    fromId,
    hash
  );

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
        <CopyOutlined /> DSNP URI
      </button>
    </Dropdown>
  );
};

export default PostHashDropdown;
