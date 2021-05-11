import React, { useState } from "react";
import NewPost from "./NewPost";
import PostList from "./PostList";
import { Button } from "antd";
import { useAppSelector } from "../redux/hooks";

const Feed: React.FC = () => {
  const profile = useAppSelector((state) => state.user.profile);
<<<<<<< HEAD
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
=======
  const [openCreatePost, setCreatePost] = useState<boolean>(false);
>>>>>>> c0a25e5 (new post modal and styling)

  return (
    <div className="Feed__block">
      <div className="Feed__header">
        <h1>Feed</h1>
        {profile && (
          <Button
            className="Feed__newPostButton"
<<<<<<< HEAD
            onClick={() => setIsModalOpen(true)}
=======
            onClick={() => setCreatePost(true)}
>>>>>>> c0a25e5 (new post modal and styling)
          >
            New Post
          </Button>
        )}
<<<<<<< HEAD
        {isModalOpen && (
          <NewPost
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
=======
        {openCreatePost && (
          <NewPost
            onSuccess={() => setCreatePost(false)}
            onCancel={() => setCreatePost(false)}
>>>>>>> c0a25e5 (new post modal and styling)
          />
        )}
      </div>
      <PostList />
    </div>
  );
};
export default Feed;
