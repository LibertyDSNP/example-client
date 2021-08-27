import React, { useState } from "react";
import { Card } from "antd";
import { FeedItem, HexString, Profile } from "../utilities/types";
import UserAvatar from "./UserAvatar";
import PostMedia from "./PostMedia";
import RelativeTime from "./RelativeTime";
import ReplyBlock from "./ReplyBlock";
import PostHashDropdown from "./PostHashDropdown";
import { ActivityContentImage } from "@dsnp/sdk/core/activityContent";
import { FromTitle } from "./FromTitle";
import { setDisplayedProfileId } from "../redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

interface PostProps {
  feedItem: FeedItem;
}

const Post = ({ feedItem }: PostProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const noteContent = feedItem.content;
  const attachments = noteContent.attachment;

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
        onClick={() => dispatch(setDisplayedProfileId(feedItem.fromId))}
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
              isHoveringProfile={isHoveringProfile}
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
      <PostHashDropdown hash={feedItem.hash} />
      <div className="Post__caption">{noteContent.content}</div>
      {attachments && (
        <PostMedia attachment={attachments as ActivityContentImage[]} />
      )}
      <ReplyBlock parent={feedItem.hash} />
    </Card>
  );
};

export default Post;
