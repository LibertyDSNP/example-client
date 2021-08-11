import React from "react";
import { Card } from "antd";
import { FeedItem, HexString, Profile } from "../utilities/types";
import UserAvatar from "./UserAvatar";
import PostMedia from "./PostMedia";
import RelativeTime from "./RelativeTime";
import ReplyBlock from "./ReplyBlock";
import {
  ActivityContentNote,
  ActivityContentImage,
} from "@dsnp/sdk/core/activityContent";
import { FromTitle } from "./FromTitle";
import { useAppSelector } from "../redux/hooks";

interface PostProps {
  feedItem: FeedItem;
}

const Post = ({ feedItem }: PostProps): JSX.Element => {
  const noteContent = feedItem.content;
  const attachments = noteContent.attachment;

  const profiles: Record<HexString, Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const profile: Profile = profiles[feedItem.fromAddress] || {
    socialAddress: feedItem.fromAddress,
  };

  return (
    <Card
      key={noteContent.hash}
      className="Post__block"
      bordered={false}
    >
      <Card.Meta
        avatar={
          <UserAvatar profileAddress={feedItem.fromId} avatarSize={"medium"} />
        }
        title={<FromTitle profile={profile} />}
        description={
          noteContent.published && (
            <RelativeTime published={noteContent.published} postStyle={true} />
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
