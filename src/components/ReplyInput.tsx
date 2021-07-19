import { Input } from "antd";
import React, { useState } from "react";
import { storeReply } from "../services/Storage";
import { addFeedItem } from "../redux/slices/feedSlice";
import { HexString } from "../utilities/types";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

interface ReplyInputProps {
  parent: HexString;
}

const ReplyInput = ({ parent }: ReplyInputProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const [saving, setSaving] = React.useState<boolean>(false);
  const [replyValue, setReplyValue] = useState<string>("");

  const createReply = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    if (!profile) return;
    setSaving(true);
    const newReplyFeedItem = await storeReply(
      profile?.socialAddress,
      replyValue
    );
    dispatch(addFeedItem(newReplyFeedItem));
    // await sendPost(newReplyFeedItem);
    setReplyValue("");
    setSaving(false);
  };

  return (
    <div className="ReplyBlock__newReplyBlock">
      <Input.TextArea
        className="ReplyBlock__input"
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

export default ReplyInput;
