import React, { useEffect, useState } from "react";
import * as types from "../utilities/types";
import * as sdk from "../services/sdk";
import UserAvatar from "./UserAvatar";
import { upsertProfile } from "../redux/slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

interface ReplyProps {
  reply: types.Reply;
}

const Reply = ({ reply }: ReplyProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const cachedProfiles: Record<string, types.Profile> = useAppSelector(
    (state) => state.profiles.profiles
  );
  const [fromProfile, setFromProfile] = useState<types.Profile | undefined>(
    undefined
  );

  const getReplyProfile = async () => {
    let userProfile = cachedProfiles[reply.fromId];
    if (!userProfile) {
      userProfile = await sdk.getProfile(reply.fromId);
      dispatch(upsertProfile(userProfile));
    }
    return userProfile;
  };

  useEffect(() => {
    getReplyProfile().then((profile) => {
      setFromProfile(profile);
    });
  });

  return (
    <div className="Reply__block">
      <UserAvatar profileAddress={reply.fromId} avatarSize="small" />
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
