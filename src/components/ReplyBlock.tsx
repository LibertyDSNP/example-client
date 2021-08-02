import { ActivityContentNote } from "@dsnp/sdk/core/activityContent";
import React from "react";
import { useAppSelector } from "../redux/hooks";
import { FeedItem, HexString } from "../utilities/types";
import Reply from "./Reply";
import ReplyInput from "./ReplyInput";

interface ReplyBlockProps {
  parent: HexString;
}

const ReplyBlock = ({ parent }: ReplyBlockProps): JSX.Element => {
  const replyFeed: FeedItem<ActivityContentNote>[] = useAppSelector(
    (state) => state.feed.feed
  ).filter(
    (reply) => reply?.content?.type === "Note" && reply?.inReplyTo === parent
  ) as FeedItem<ActivityContentNote>[];

  return (
    <>
      {replyFeed.length > 0 && (
        <div className="ReplyBlock__repliesList">
          {replyFeed.map((reply, index) => (
            <Reply reply={reply} key={index} />
          ))}
        </div>
      )}
      <ReplyInput parent={parent} />
    </>
  );
};

export default ReplyBlock;
