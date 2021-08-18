import React from "react";
import { useAppSelector } from "../redux/hooks";
import { FeedItem, HexString } from "../utilities/types";
import Reply from "./Reply";
import ReplyInput from "./ReplyInput";
import BlankReply from "./BlankReply";

interface isReplyLoadingType {
  loading: boolean;
  parent: HexString | undefined;
}

interface ReplyBlockProps {
  parent: HexString;
}

const ReplyBlock = ({ parent }: ReplyBlockProps): JSX.Element => {
  const replyFeed: FeedItem[] = useAppSelector(
    (state) => state.feed.feed
  ).filter((reply) => {
    return reply?.content?.type === "Note" && reply?.inReplyTo === parent;
  }) as FeedItem[];

  const loading: isReplyLoadingType = useAppSelector(
    (state) => state.feed.isReplyLoading
  );

  return (
    <>
      {(parent === loading?.parent || replyFeed.length > 0) && (
        <div className="ReplyBlock__repliesList">
          {replyFeed.length > 0 && (
            <>
              {replyFeed.map((reply, index) => (
                <Reply reply={reply} key={index} />
              ))}
            </>
          )}
          {parent === loading?.parent && <BlankReply />}
        </div>
      )}
      <ReplyInput parent={parent} />
    </>
  );
};

export default ReplyBlock;
