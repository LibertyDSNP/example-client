import React, { useEffect, useState } from "react";
import { FeedItem, Profile } from "../utilities/types";
import * as sdk from "../services/sdk";
import UserAvatar from "./UserAvatar";
import { upsertProfile } from "../redux/slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ActivityContentNote } from "@dsnp/sdk/core/activityContent";

interface ReplyProps {
  reply: FeedItem<ActivityContentNote>;
}

const Reply = ({ reply }: ReplyProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const cachedProfiles: Record<string, Profile> = useAppSelector(
    (state) => state.profiles.profiles
  );
  const [fromProfile, setFromProfile] = useState<Profile | undefined>(
    undefined
  );

  const getReplyProfile = async () => {
    let userProfile = cachedProfiles[reply.fromAddress];
    if (!userProfile) {
      userProfile = await sdk.getProfile(reply.fromAddress);
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
      <UserAvatar profileAddress={reply.fromAddress} avatarSize="small" />
      <div className="Reply__message">
        <div className="Reply__name">
          {fromProfile?.name || fromProfile?.socialAddress}
        </div>
        {reply.content.content}
      </div>
    </div>
  );
};

export default Reply;
