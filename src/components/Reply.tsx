import React, { useEffect, useState } from "react";
import * as types from "../utilities/types";
import UserAvatar from "./UserAvatar";
import { useAppSelector } from "../redux/hooks";
import PostHashDropdown from "./PostHashDropdown";

interface ReplyProps {
  reply: types.Reply;
}

const Reply = ({ reply }: ReplyProps): JSX.Element => {
  const cachedProfiles: Record<string, types.Profile> = useAppSelector(
    (state) => state.profiles.profiles
  );
  const [fromProfile, setFromProfile] = useState<types.Profile | undefined>(
    undefined
  );

  useEffect(() => {
    setFromProfile(cachedProfiles[reply.fromId]);
  }, [cachedProfiles, reply]);

  return (
    <div className="Reply__block">
      <PostHashDropdown hash={reply.hash} isReply={true} />
      <UserAvatar
        icon={fromProfile?.icon?.[0]?.href}
        profileAddress={reply.fromId}
        avatarSize="small"
      />
      <div className="Reply__message">
        <div className="Reply__name">
          {fromProfile?.name || fromProfile?.fromId}
        </div>
        {reply.content.content}
      </div>
    </div>
  );
};

export default Reply;
