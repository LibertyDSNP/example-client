import React, { useState } from "react";
import { Dropdown } from "antd";
import { CopyOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import {
  buildDSNPAnnouncementURI,
  DSNPAnnouncementURI,
} from "@dsnp/sdk/core/identifiers";
import { HexString } from "../utilities/types";

interface PostHashDropdownProps {
  hash: HexString;
  fromId: string;
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
    <div className="PostHashDropdown__menuHash">
      <div className="PostHashDropdown__menuHashTitle">
        DSNP Announcement URI:
      </div>{" "}
      {announcementURI}
    </div>
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
        onClick={(e) => {
          e.preventDefault();
          navigator.clipboard.writeText(announcementURI);
          setIsCopied(true);
          setTimeout(function () {
            setIsCopied(false);
          }, 2000);
        }}
      >
        {isCopied ? (
          <CheckCircleTwoTone twoToneColor="#1dcf76" />
        ) : (
          <CopyOutlined />
        )}{" "}
        DSNP URI
      </button>
    </Dropdown>
  );
};

export default PostHashDropdown;
