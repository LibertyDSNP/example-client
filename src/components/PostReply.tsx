import React, { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { FeedItem } from "../utilities/types";
import { Input } from "antd";

const PostReply = (): JSX.Element => {
  // const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const feed: FeedItem[] = useAppSelector((state) => state.feed.feed);
  feed.filter((post) => post.content.type === "Note");
  const [saving, setSaving] = React.useState<boolean>(false);
  const [replyValue, setReplyValue] = useState<string>("");

  const createReply = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    if (!profile) return;
    setSaving(true);
    //save reply here
    //not sure how we want to do that
    setReplyValue("");
    setSaving(false);
  };

  return (
    <div className="PostReply__block">
      <Input.TextArea
        className="PostReply__input"
        placeholder="Reply..."
        value={replyValue}
        onChange={(e) => {
          if (saving) return;
          setReplyValue(e.target.value);
        }}
        autoSize={true}
        onPressEnter={(event) => createReply(event)}
      />
    </div>
  );
};

export default PostReply;
