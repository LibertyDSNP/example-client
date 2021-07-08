import React from "react";
import { Card } from "antd";
import { FeedItem } from "../utilities/types";
import { NoteActivityPub } from "../utilities/activityPubTypes";
import UserAvatar from "./UserAvatar";
import PostMedia from "./PostMedia";
import RelativeTime from "./RelativeTime";
import PostReply from "./PostReply";

interface PostProps {
  feedItem: FeedItem;
}

const Post = ({ feedItem }: PostProps): JSX.Element => {
  const noteContent: NoteActivityPub = feedItem.content as NoteActivityPub;
  return (
    <Card key={feedItem.hash} className="Post__block" bordered={false}>
      <Card.Meta
        avatar={
          <UserAvatar
            profileAddress={feedItem.fromAddress}
            avatarSize={"medium"}
          />
        }
        title={feedItem.fromAddress}
        description={
          <RelativeTime timestamp={feedItem.timestamp} postStyle={true} />
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
};

export default Post;
