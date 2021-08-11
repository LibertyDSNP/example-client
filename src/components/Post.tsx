import React from "react";
import { Card } from "antd";
import { FeedItem } from "../utilities/types";
import UserAvatar from "./UserAvatar";
import PostMedia from "./PostMedia";
import RelativeTime from "./RelativeTime";
import ReplyBlock from "./ReplyBlock";
import {
  ActivityContentNote,
  ActivityContentImage,
} from "@dsnp/sdk/core/activityContent";

interface PostProps {
  feedItem: FeedItem<ActivityContentNote>;
}

const Post = ({ feedItem }: PostProps): JSX.Element => {
  console.log(feedItem);
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
          <UserAvatar profileAddress={feedItem.fromId} avatarSize={"medium"} />
        }
        title={feedItem.fromId}
        description={
          feedItem.published && (
            <RelativeTime published={feedItem.published} postStyle={true} />
          )
        }
      />
      <div className="Post__caption">{noteContent.content}</div>
      {attachments && (
        <PostMedia attachment={attachments as ActivityContentImage[]} />
      )}
      <ReplyBlock parent={feedItem.hash} />
    </Card>
  );
};

export default Post;
