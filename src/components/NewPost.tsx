import React from "react";
import { Modal, Button } from "antd";

interface NewPostProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewPost = ({ onSuccess, onCancel }: NewPostProps): JSX.Element => {
  return (
    <Modal
      className="NewPost"
      visible={true}
      onCancel={onCancel}
      width="535px"
      centered={true}
      title={"Create a post"}
    >
      New Post
      <Button
        className="NewPost__footerBtn"
        key="post"
        type="primary"
        onClick={onSuccess}
      >
        Post
      </Button>
    </Modal>
  );
};

export default NewPost;
