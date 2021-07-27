import React from "react";
import { Card } from "antd";
import { FeedItem } from "../utilities/types";
import UserAvatar from "./UserAvatar";
import PostMedia from "./PostMedia";
import RelativeTime from "./RelativeTime";
import PostReply from "./PostReply";
import { ActivityContentImage } from "@dsnp/sdk/core/activityContent";

interface PostProps {
  feedItem: FeedItem;
}

const Post = ({ feedItem }: PostProps): JSX.Element => {
  const noteContent = feedItem.content;
  const attachments =
    noteContent.attachment &&
    (Array.isArray(noteContent.attachment)
      ? noteContent.attachment
      : [noteContent.attachment]);
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
      {attachments && (
        <PostMedia attachment={attachments as ActivityContentImage[]} />
      )}
      <PostReply />
    </Card>
  );
};

export default Post;
