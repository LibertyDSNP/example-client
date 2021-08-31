import React from "react";
import { useAppSelector } from "../redux/hooks";
import { FeedItem } from "../utilities/types";
import Reply from "./Reply";
import ReplyInput from "./ReplyInput";
import BlankReply from "./BlankReply";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";

interface isReplyLoadingType {
  loading: boolean;
  parent: DSNPUserId | undefined;
}

interface ReplyBlockProps {
  parent: DSNPUserId;
}

const ReplyBlock = ({ parent }: ReplyBlockProps): JSX.Element => {
  const replyFeed: FeedItem[] = useAppSelector(
    (state) => state.feed.feedItems
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
