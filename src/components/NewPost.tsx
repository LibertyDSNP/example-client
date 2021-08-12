import React from "react";
import { Button, Space, Spin, Modal, Input } from "antd";
import { useAppSelector } from "../redux/hooks";
import UserAvatar from "./UserAvatar";
import NewPostImageUpload from "./NewPostImageUpload";
import { FeedItem, HexString, Profile } from "../utilities/types";
import { createNote } from "../services/Storage";
import { sendPost } from "../services/sdk";
import {
  ActivityContentNote,
  createProfile,
} from "@dsnp/sdk/core/activityContent";
import { FromLine } from "./FromLine";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";

interface NewPostProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewPost = ({ onSuccess, onCancel }: NewPostProps): JSX.Element => {
  const [saving, setSaving] = React.useState<boolean>(false);
  const [uriList, setUriList] = React.useState<string[]>([]);
  const [postMessage, setPostMessage] = React.useState<string>("");
  const [isValidPost, setIsValidPost] = React.useState<boolean>(false);

  const userId: DSNPUserId | undefined = useAppSelector(
    (state) => state.user.id
  );

  const profiles: Record<HexString, Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const profile = (userId && profiles[userId]) || {
    ...createProfile(),
    socialAddress: userId || "",
  };

  const success = () => {
    setSaving(false);
    onSuccess();
  };

  const createPost = async () => {
    if (!userId) return;
    const newPostFeedItem: FeedItem<ActivityContentNote> = await createNote(
      postMessage,
      uriList,
      userId
    );
    await sendPost(newPostFeedItem);
    success();
  };

  const handleMessageInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (saving) return;
    e.target.value !== "" ? setIsValidPost(true) : setIsValidPost(false);
    setPostMessage(e.target.value);
  };

  return (
    <Modal
      className="NewPost"
      visible={true}
      onCancel={onCancel}
      width="535px"
      centered={true}
      title={"Create a post"}
      footer={[
        <Spin spinning={saving} key={1}>
          <Space>
            <Button
              className="NewPost__footerBtn"
              key="post"
              type="primary"
              disabled={!isValidPost || saving}
              onClick={createPost}
            >
              Post
            </Button>
          </Space>
        </Spin>,
      ]}
    >
      <div className="NewPost__profileBlock">
        <UserAvatar profileAddress={userId} avatarSize={"small"} />
        <h3 className="NewPost__profileBlockName">
          <FromLine profile={profile}></FromLine>
        </h3>
      </div>
      <Input.TextArea
        className="NewPost__textArea"
        placeholder="Message"
        value={postMessage || ""}
        onChange={(e) => handleMessageInputChange(e)}
        rows={6}
      />
      <NewPostImageUpload onNewPostImageUpload={setUriList} />
    </Modal>
  );
};

export default NewPost;
