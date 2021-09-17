import React from "react";
import UserAvatar from "./UserAvatar";

const BlankReply = (): JSX.Element => {
  return (
    <div className="BlankReply__block">
      <UserAvatar user={undefined} avatarSize="small" />
      <div className="BlankReply__messageBlock">
        <div className="BlankReply__name"> </div>
        <div className="BlankReply__message"> </div>
      </div>
    </div>
  );
};

export default BlankReply;
