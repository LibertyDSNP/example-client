import React, { useState } from "react";
import { Card } from "antd";
import { FeedItem, HexString, Profile } from "../utilities/types";
import UserAvatar from "./UserAvatar";
import PostMedia from "./PostMedia";
import RelativeTime from "./RelativeTime";
import ReplyBlock from "./ReplyBlock";
import PostHashDropdown from "./PostHashDropdown";
import { FromTitle } from "./FromTitle";
import { setDisplayId } from "../redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ActivityContentAttachment } from "@dsnp/sdk/core/activityContent";

interface PostProps {
  feedItem: FeedItem;
}

const Post = ({ feedItem }: PostProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const noteContent = feedItem.content;
  const attachments: ActivityContentAttachment[] = noteContent.attachment || [];

  const [isHoveringProfile, setIsHoveringProfile] = useState(false);

  const profiles: Record<HexString, Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const profile: Profile = profiles[feedItem.fromId] || {
    fromId: feedItem.fromId,
  };

  return (
    <Card key={feedItem.hash} className="Post__block" bordered={false}>
      <div
        onClick={() => dispatch(setDisplayId(feedItem.fromId))}
        onMouseEnter={() => setIsHoveringProfile(true)}
        onMouseLeave={() => setIsHoveringProfile(false)}
        className="Post__metaBlock"
      >
        <Card.Meta
          avatar={
            <UserAvatar
              icon={profile.icon?.[0]?.href}
              profileAddress={feedItem.fromId}
              avatarSize={"medium"}
            />
          }
          title={
            <FromTitle
              profile={profile}
              isHoveringProfile={isHoveringProfile}
            />
          }
          description={
            noteContent.published && (
              <RelativeTime
                published={noteContent.published}
                postStyle={true}
              />
            )
          }
        />
      </div>
      <PostHashDropdown hash={feedItem.hash} fromId={feedItem.fromId} />
      <div className="Post__caption">{noteContent.content}</div>
      {attachments && <PostMedia attachments={attachments} />}
      <ReplyBlock parent={feedItem.hash} />
    </Card>
  );
};

export default Post;
