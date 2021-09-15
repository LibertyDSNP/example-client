import React from "react";
import * as types from "../utilities/types";
import UserAvatar from "./UserAvatar";
import { useAppSelector } from "../redux/hooks";
import PostHashDropdown from "./PostHashDropdown";
import { PostQuery, ProfileQuery } from "../services/content";

interface ReplyProps {
  reply: types.Reply;
}

const Reply = ({ reply }: ReplyProps): JSX.Element => {
  const users: Record<string, types.User> = useAppSelector(
    (state) => state.profiles.profiles
  );

  const { isSuccess: replySuccess, data: replyContent } = PostQuery(reply);

  const fromUser = users[reply.fromId];

  const { data: fromProfile } = ProfileQuery(fromUser);

  return (
    <div className="Reply__block">
      <PostHashDropdown
        hash={reply.hash}
        fromId={reply.fromId}
        isReply={true}
      />
      <UserAvatar user={fromUser} avatarSize="small" />
      <div className="Reply__message">
        <div className="Reply__name">
          {fromProfile?.name || fromUser?.fromId}
        </div>
        {replySuccess ? (
          <>{replyContent?.content}</>
        ) : (
          <div className="BlankReply__messageBlock">
            <div className="BlankReply__name"> </div>
            <div className="BlankReply__message"> </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reply;
