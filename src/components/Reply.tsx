import React, { useState } from "react";
import * as types from "../utilities/types";
import UserAvatar from "./UserAvatar";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import PostHashDropdown from "./PostHashDropdown";
import { PostQuery, ProfileQuery } from "../services/content";
import { FromTitle } from "./FromTitle";
import { setDisplayId } from "../redux/slices/userSlice";
import { formatMessage } from "../utilities/helpers";

interface ReplyProps {
  reply: types.ReplyItem;
}

const Reply = ({ reply }: ReplyProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const [isHoveringProfile, setIsHoveringProfile] = useState(false);

  const users: Record<string, types.User> = useAppSelector(
    (state) => state.profiles.profiles
  );

  const { isSuccess: replySuccess, data: replyContent } = PostQuery(reply);

  const fromUser = users[reply.fromId];

  const { data: fromProfile } = ProfileQuery(fromUser);

  return (
    <div className="Reply__block">
      <PostHashDropdown
        hash={reply.contentHash}
        fromId={reply.fromId}
        isReply={true}
      />
      <div
        className="Reply__metaBlock"
        onMouseEnter={() => setIsHoveringProfile(true)}
        onMouseLeave={() => setIsHoveringProfile(false)}
        onClick={() => dispatch(setDisplayId(reply.fromId))}
      >
        <UserAvatar user={fromUser} avatarSize="small" />
        <div className="Reply__name">
          <FromTitle
            userInfo={fromUser}
            profile={fromProfile}
            isHoveringProfile={isHoveringProfile}
            isReply={true}
          />
        </div>
      </div>
      {replySuccess ? (
        replyContent?.content && (
          <>
            <div
              className="Reply__message"
              dangerouslySetInnerHTML={{
                __html: formatMessage(replyContent?.content),
              }}
            />
          </>
        )
      ) : (
        <div className="BlankReply__messageBlock">
          <div className="BlankReply__name"> </div>
          <div className="BlankReply__message"> </div>
        </div>
      )}
    </div>
  );
};

export default Reply;
