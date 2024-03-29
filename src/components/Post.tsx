import React, { useState } from "react";
import { Card } from "antd";
import { FeedItem, HexString, User } from "../utilities/types";
import UserAvatar from "./UserAvatar";
import PostMedia from "./PostMedia";
import RelativeTime from "./RelativeTime";
import ReplyBlock from "./ReplyBlock";
import PostHashDropdown from "./PostHashDropdown";
import { FromTitle } from "./FromTitle";
import { setDisplayId } from "../redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ActivityContentAttachment } from "@dsnp/sdk/core/activityContent";
import { PostQuery, ProfileQuery } from "../services/content";
import { buildDSNPAnnouncementURI } from "@dsnp/sdk/core/identifiers";
import { Anchorme } from "react-anchorme";

interface PostProps {
  feedItem: FeedItem;
}

const Post = ({ feedItem }: PostProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const [isHoveringProfile, setIsHoveringProfile] = useState(false);

  const users: Record<HexString, User> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const user: User = users[feedItem.fromId] || {
    fromId: feedItem.fromId,
  };

  const { isSuccess: postSuccess, data: post, error: postError } = PostQuery(
    feedItem
  );
  const { data: profile } = ProfileQuery(user);

  const attachments: ActivityContentAttachment[] = post?.attachment || [];

  return (
    <Card key={feedItem.contentHash} className="Post__block" bordered={false}>
      <div
        onClick={() => dispatch(setDisplayId(feedItem.fromId))}
        onMouseEnter={() => setIsHoveringProfile(true)}
        onMouseLeave={() => setIsHoveringProfile(false)}
        className="Post__metaBlock"
      >
        <Card.Meta
          className="Post__metaInnerBlock"
          avatar={<UserAvatar user={user} avatarSize={"medium"} />}
          title={
            <FromTitle
              userInfo={user}
              profile={profile}
              isHoveringProfile={isHoveringProfile}
            />
          }
        />
      </div>
      <div className="Post__rightCorner">
        {feedItem?.published && (
          <RelativeTime published={feedItem?.published} postStyle={true} />
        )}
        <PostHashDropdown
          hash={feedItem.contentHash}
          fromId={feedItem.fromId}
        />
      </div>
      {postSuccess ? (
        <>
          {post?.content && (
            <div className="Post__caption">
              <Anchorme target="_blank" rel="noreferrer noopener">
                {post?.content}
              </Anchorme>
            </div>
          )}
          {post?.attachment && <PostMedia attachments={attachments} />}
        </>
      ) : (
        <div
          className={
            postError ? "Post__content--error" : "Post__content--loading"
          }
        >
          <div className="BlankPost__contentLine1"> </div>
          <div className="BlankPost__contentLine2"> </div>
          <div className="BlankPost__contentLine3"> </div>
        </div>
      )}
      <ReplyBlock
        parentURI={buildDSNPAnnouncementURI(
          BigInt(feedItem.fromId),
          feedItem.contentHash
        )}
      />
    </Card>
  );
};

export default Post;
