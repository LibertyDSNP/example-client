import React from "react";
import UserAvatar from "./UserAvatar";

const BlankReply = (): JSX.Element => {
  const blankUser = {
    fromId: "unknown",
    blockNumber: 0,
    blockIndex: 0,
    batchIndex: 0,
  };
  return (
    <div className="BlankReply__block">
      <UserAvatar user={blankUser} avatarSize="small" />
      <div className="BlankReply__messageBlock">
        <div className="BlankReply__name"> </div>
        <div className="BlankReply__message"> </div>
      </div>
    </div>
  );
};

export default BlankReply;
