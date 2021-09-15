import React from "react";
import { Card } from "antd";
import UserAvatar from "./UserAvatar";

const BlankPost = (): JSX.Element => {
  const blankUser = {
    fromId: "unknown",
    blockNumber: 0,
    blockIndex: 0,
    batchIndex: 0,
  };
  return (
    <Card className="BlankPost__block" bordered={false}>
      <Card.Meta
        avatar={<UserAvatar user={blankUser} avatarSize={"medium"} />}
        title={<div className="BlankPost__title"> </div>}
        description={<div className="BlankPost__description"> </div>}
      />
      <div className="BlankPost__contentLine1"> </div>
      <div className="BlankPost__contentLine2"> </div>
      <div className="BlankPost__contentLine3"> </div>
    </Card>
  );
};

export default BlankPost;
