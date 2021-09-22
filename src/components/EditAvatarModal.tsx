import React from "react";
import UserAvatar from "./UserAvatar";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import * as types from "../utilities/types";
import { Alert, Button, Input, Modal } from "antd";
import { useState } from "react";
import { CameraOutlined } from "@ant-design/icons";
import { ActivityContentImageLink } from "@dsnp/sdk/core/activityContent";
import { core } from "@dsnp/sdk";
import path from "path";
import { setTempIconUri } from "../redux/slices/userSlice";

interface EditAvatarModalProps {
  setNewIcon: (icon: ActivityContentImageLink[] | undefined) => void;
}

const EditAvatarModal = ({ setNewIcon }: EditAvatarModalProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const userId: string | undefined = useAppSelector((state) => state.user.id);
  const profiles: Record<types.HexString, types.User> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );
  const user: types.User | undefined = userId ? profiles[userId] : undefined;

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [iconUri, setIconUri] = React.useState<string>("");
  const [urlErrorMsg, setUrlErrorMsg] = React.useState<string | null>(null);
  const hasValidPostURI = iconUri && String(iconUri).match(/.+\..+\//);

  const handleNewUri = () => {
    if (hasValidPostURI) {
      const extension = path.extname(iconUri).replace(".", "");
      const imageLink = core.activityContent.createImageLink(
        iconUri,
        `image/${extension}`,
        [core.activityContent.createHash(iconUri)]
      );
      dispatch(setTempIconUri(imageLink.href));
      setIsModalVisible(false);
      setNewIcon([imageLink]);
      setIconUri("");
    } else {
      setUrlErrorMsg("Invalid URL.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIconUri("");
    dispatch(setTempIconUri(undefined));
  };

  return (
    <>
      <div
        onClick={() => setIsModalVisible(true)}
        className="EditAvatarModal__button"
      >
        <UserAvatar user={user} avatarSize="large" />
        <div className="EditAvatarModal__edit">edit</div>
      </div>
      <Modal visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <div className="EditAvatarModal__avatarPreview">
          <UserAvatar user={user} avatarSize="xl" />
        </div>
        <div className="NewPostImageUpload__urlInputBlock">
          <CameraOutlined style={{ fontSize: "28px" }} />
          <Input
            className="NewPostImageUpload__urlInput"
            placeholder="Content URL"
            value={iconUri || ""}
            onChange={(e) => setIconUri(e.target.value)}
            onPressEnter={handleNewUri}
          />
          <Button
            className="NewPostImageUpload__urlInputBtn"
            onClick={handleNewUri}
          >
            Add
          </Button>
        </div>
        {urlErrorMsg && (
          <Alert
            className="NewPostImageUpload__alert"
            type="error"
            message={urlErrorMsg}
          />
        )}
      </Modal>
    </>
  );
};

export default EditAvatarModal;
