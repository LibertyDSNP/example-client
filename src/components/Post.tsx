import React from "react";
import { useAppSelector } from "../redux/hooks";
import { Card } from "antd";
import { FeedItem } from "../utilities/types";
import { NoteActivityPub } from "../utilities/activityPubTypes";
import UserAvatar from "./UserAvatar";
import PostMedia from "./PostMedia";
import RelativeTime from "./RelativeTime";
import PostReply from "./PostReply";

const Post: React.FC = () => {
  const feed: FeedItem[] = useAppSelector((state) => state.feed.feed).filter(
    (post) => post?.content?.type === "Note"
  );

  const postItems = feed
    .slice(0)
    .reverse()
    .map((post: FeedItem, index: number) => {
      const noteContent: NoteActivityPub = post.content as NoteActivityPub;
      return (
        <Card key={index} className="Post__block" bordered={false}>
          <Card.Meta
            avatar={
              <UserAvatar
                profileAddress={post.fromAddress}
                avatarSize={"medium"}
              />
            }
            title={post.fromAddress}
            description={
              <RelativeTime timestamp={post.timestamp} postStyle={true} />
            }
          />
          <div className="Post__caption">{noteContent.content}</div>
          {noteContent && (
            <>
              {noteContent.attachment && noteContent.attachment.length > 0 && (
                <PostMedia attachment={noteContent.attachment} />
              )}
            </>
          )}
          <PostReply />
        </Card>
      );
    });

  return (
    <div className="PostList__block">
      {feed.length > 0 ? postItems : "Empty Feed!"}
    </div>
  );
};

export default Post;
