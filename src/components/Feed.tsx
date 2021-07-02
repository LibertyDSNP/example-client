import React, { useState } from "react";
import NewPost from "./NewPost";
import PostList from "./PostList";
import { Button } from "antd";
import { useAppSelector } from "../redux/hooks";

const Feed: React.FC = () => {
  const profile = useAppSelector((state) => state.user.profile);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="Feed__block">
      <div className="Feed__header">
        <h1>Feed</h1>
        {profile && (
          <Button
            className="Feed__newPostButton"
            onClick={() => setIsModalOpen(true)}
          >
            New Post
          </Button>
        )}
        {isModalOpen && (
          <NewPost
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </div>
      <PostList />
    </div>
  );
};
export default Feed;
