import React from "react";
import { Button, Space, Spin, Modal, Input } from "antd";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import UserAvatar from "./UserAvatar";
import NewPostImageUpload from "./NewPostImageUpload";
import { FeedItem, HexString, Profile } from "../utilities/types";
import { createNote } from "../services/Storage";
import { sendPost } from "../services/sdk";
import { createProfile } from "@dsnp/sdk/core/activityContent";
import { FromTitle } from "./FromTitle";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import { postLoading } from "../redux/slices/feedSlice";

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

  const userId: DSNPUserId | undefined = useAppSelector(
    (state) => state.user.id
  );

  const profiles: Record<HexString, Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const profile = (userId && profiles[userId]) || {
    ...createProfile(),
    fromId: userId || "",
  };

  const success = () => {
    setSaving(false);
    onSuccess();
  };

  const createPost = async () => {
    if (!profile) return;
    const newPostFeedItem: FeedItem = await createNote(
      postMessage,
      uriList,
      userId
    );
    await sendPost(newPostFeedItem);
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
        <UserAvatar
          icon={profile?.icon?.[0]?.href}
          profileAddress={userId}
          avatarSize={"small"}
        />
        <h3 className="NewPost__profileBlockName">
          <FromTitle profile={profile}></FromTitle>
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
