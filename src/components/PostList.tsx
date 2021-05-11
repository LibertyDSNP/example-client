import React from "react";
import { useAppSelector } from "../redux/hooks";
import { FeedItem } from "../utilities/types";
import { NoteActivityPub } from "../utilities/activityPubTypes";

const PostList: React.FC = () => {
  const feed: FeedItem[] = useAppSelector((state) => state.feed.feed);
  feed.filter((post) => post?.content?.type === "Note");

  const postItems = feed.map((post: FeedItem, index: number) => {
    const noteContent: NoteActivityPub = post.content as NoteActivityPub;
    return (
      <div key={index}>
        {noteContent && (
          <>
            <div>{post.fromAddress}</div>
            <div>{noteContent.content}</div>
            {noteContent.attachment && (
              <img
                width={400}
                src={noteContent.attachment[0]?.url}
                alt="undefined"
              />
            )}
          </>
        )}
      </div>
    );
  });

  return (
    <div className="PostList__block">
      <h1>PostList</h1>
      {postItems}
    </div>
  );
};
export default PostList;
