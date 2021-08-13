import React from "react";
import { useAppSelector } from "../redux/hooks";
import { FeedItem, HexString } from "../utilities/types";
import Reply from "./Reply";
import ReplyInput from "./ReplyInput";

interface ReplyBlockProps {
  parent: HexString;
}

const ReplyBlock = ({ parent }: ReplyBlockProps): JSX.Element => {
  const replyFeed: FeedItem[] = useAppSelector(
    (state) => state.feed.feed
  ).filter((reply) => {
    return reply?.content?.type === "Note" && reply?.inReplyTo === parent;
  }) as FeedItem[];

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
