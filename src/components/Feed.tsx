import React from "react";
import NewPost from "./NewPost";
import PostList from "./PostList";

const Feed: React.FC = () => {
  return (
    <div className="Feed__block">
      <div className="Feed__header">
        <h1>Feed</h1>
        <NewPost />
      </div>
      <PostList />
    </div>
  );
};
export default Feed;
