import React from "react";
import { FeedItem } from "../utilities/types";

interface PostProps {
  feedItem: FeedItem;
}

const Post = ({ feedItem }: PostProps): JSX.Element => {
  // Used for mocked data. Remove when no longer mocking data
  const brokenLink = (e: any) => {
    e.target.src = "https://picsum.photos/200/300";
  };

  return (
    <>
      <div> Poster: {feedItem.address} </div>
      <div> Hash: {feedItem.hash} </div>
      {feedItem.replies.length > 0 && (
        <div>
          {feedItem.replies.map((reply) => (
            <div>Reply From: {reply.address}</div>
          ))}
        </div>
      )}
      {feedItem?.content && feedItem?.content?.attachment && (
        <img
          src={(feedItem?.content).attachment[0].url}
          alt="Post"
          // Used for mocked data. Remove when no longer mocking data
          onError={brokenLink}
        ></img>
      )}
    </>
  );
};
export default Post;
