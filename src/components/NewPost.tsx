import React from "react";
import { Button, Space, Spin, Modal, Input } from "antd";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import UserAvatar from "./UserAvatar";
import NewPostImageUpload from "./NewPostImageUpload";
import { HexString, User } from "../utilities/types";
import { ProfileQuery, sendPost } from "../services/content";
import { FromTitle } from "./FromTitle";
import { postLoading } from "../redux/slices/feedSlice";
import { createActivityContentNote } from "../utilities/activityContent";

interface NewPostProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewPost = ({ onSuccess, onCancel }: NewPostProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const [saving, setSaving] = React.useState<boolean>(false);
  const [uriList, setUriList] = React.useState<string[]>([]);
  const [postMessage, setPostMessage] = React.useState<string>("");
  const [isValidPost, setIsValidPost] = React.useState<boolean>(false);

  const userId: string | undefined = useAppSelector((state) => state.user.id);

  const profiles: Record<HexString, User> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const user = (userId && profiles[userId]) || {
    fromId: userId || "",
    url: undefined,
    blockIndex: 0,
    blockNumber: 0,
    batchIndex: 0,
  };
  const { data: profile } = ProfileQuery(user);

  const success = () => {
    setSaving(false);
    onSuccess();
  };

  const createPost = async () => {
    if (!userId) return;
    const note = createActivityContentNote(postMessage, uriList);
    await sendPost(userId, note);
    dispatch(postLoading({ loading: true, currentUserId: userId }));
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
        <UserAvatar user={user} avatarSize={"small"} />
        <h3 className="NewPost__profileBlockName">
          <FromTitle userInfo={user} profile={profile} />
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
