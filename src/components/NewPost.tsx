import React, { useEffect } from "react";
import { Alert, Button, Space, Spin, Modal, Input } from "antd";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import UserAvatar from "./UserAvatar";
import NewPostImageUpload from "./NewPostImageUpload";
import { addFeedItem } from "../redux/slices/feedSlice";
import { FeedItem } from "../utilities/types";
import { createNote } from "../services/Storage";

interface NewPostProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewPost = ({ onSuccess, onCancel }: NewPostProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState<boolean>(false);
  const [uriList, setUriList] = React.useState<string[]>([]);
  const [postMessage, setPostMessage] = React.useState<string>("");
  const [isValidPost, setIsValidPost] = React.useState<boolean>(false);

  const profile = useAppSelector((state) => state.user.profile);

  useEffect(() => {
    if (postMessage.length > 0 || uriList.length > 0) {
      setIsValidPost(true);
    } else setIsValidPost(false);
  }, [postMessage, uriList]);

  const success = () => {
    setSaving(false);
    setErrorMsg(null);
    onSuccess();
  };

  const createPost = async () => {
    //needs to store in batch file here
    if (!profile) return;
    const newPostFeedItem: FeedItem = await createNote(
      profile.socialAddress,
      postMessage,
      uriList
    );
    dispatch(addFeedItem(newPostFeedItem));
    success();
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
        <UserAvatar
          profileAddress={profile?.socialAddress}
          avatarSize={"small"}
        />
        <h3 className="NewPost__profileBlockName">
          {profile?.name || profile?.handle || "Anonymous"}
        </h3>
      </div>
      <Input.TextArea
        className="NewPost__textArea"
        placeholder="Message"
        value={postMessage || ""}
        onChange={(e) => {
          if (saving) return;
          setErrorMsg(null);
          setPostMessage(e.target.value);
        }}
        rows={6}
      />
      {errorMsg && (
        <Alert className="NewPost__alert" type="error" message={errorMsg} />
      )}
      <NewPostImageUpload onNewPostImageUpload={setUriList} />
    </Modal>
  );
};

export default NewPost;
