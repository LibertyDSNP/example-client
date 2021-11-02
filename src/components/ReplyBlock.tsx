import React from "react";
import { useAppSelector } from "../redux/hooks";
import { ReplyItem } from "../utilities/types";
import Reply from "./Reply";
import ReplyInput from "./ReplyInput";
import BlankReply from "./BlankReply";
import { DSNPAnnouncementURI } from "@dsnp/sdk/core/identifiers";

interface isReplyLoadingType {
  loading: boolean;
  parent: DSNPAnnouncementURI | undefined;
}

interface ReplyBlockProps {
  parentURI: DSNPAnnouncementURI;
}

const ReplyBlock = ({ parentURI }: ReplyBlockProps): JSX.Element => {
  const replyFeed: ReplyItem[] = useAppSelector(
    (state) => state.feed.replies[parentURI]
  );

  console.log("replyFeed", replyFeed);
  console.log("parentURI", parentURI);

  const loading: isReplyLoadingType = useAppSelector(
    (state) => state.feed.isReplyLoading
  );

  return (
    <>
      {(parentURI === loading?.parent || replyFeed?.length) && (
        <div className="ReplyBlock__repliesList">
          {replyFeed?.length > 0 && (
            <>
              {replyFeed.map((reply, index) => (
                <Reply reply={reply} key={index} />
              ))}
            </>
          )}
          {parentURI === loading?.parent && <BlankReply />}
        </div>
      )}
      <ReplyInput parentURI={parentURI} />
    </>
  );
};

export default ReplyBlock;
