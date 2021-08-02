import React, { useState } from "react";
import { Card } from "antd";
import { FeedItem, HexString, Profile } from "../utilities/types";
import UserAvatar from "./UserAvatar";
import PostMedia from "./PostMedia";
import RelativeTime from "./RelativeTime";
import ReplyBlock from "./ReplyBlock";
import { ActivityContentImage } from "@dsnp/sdk/core/activityContent";
import { FromTitle } from "./FromTitle";
import { useAppSelector } from "../redux/hooks";
import ActionsBar from "./ActionsBar";

interface PostProps {
  feedItem: FeedItem;
}

const Post = ({ feedItem }: PostProps): JSX.Element => {
  const [showActionsBar, setShowActionsBar] = useState<boolean>(false);
  const noteContent = feedItem.content;
  const attachments =
    noteContent.attachment &&
    (Array.isArray(noteContent.attachment)
      ? noteContent.attachment
      : [noteContent.attachment]);

  const profiles: Record<HexString, Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const profile: Profile = profiles[feedItem.fromId] || {
    fromId: feedItem.fromId,
  };

  return (
    <Card       key={feedItem.hash}
                className="Post__block"
                bordered={false}
                onMouseEnter={() => setShowActionsBar(!showActionsBar)}
                onMouseLeave={() => setShowActionsBar(!showActionsBar)}
                key={noteContent.hash} className="Post__block" bordered={false}>
      <Card.Meta
        className="Post__header"
        avatar={
          <UserAvatar
            icon={profile.icon?.[0]?.href}
            profileAddress={feedItem.fromAddress}
            avatarSize={"medium"}
          />
        }
        title={<FromTitle profile={profile} />}
        description={
          noteContent.published && (
            <RelativeTime published={noteContent.published} postStyle={true} />
          )
        }
      />
      <div className="Post__mediaBlock">
        <PostMedia attachment={attachments as ActivityContentImage[]} />
      )}

      <ReplyBlock parent={feedItem.hash} />
        {showActionsBar && <ActionsBar timestamp={feedItem.timestamp} />}
      </div>
    </Card>
  );
};

export default Post;
