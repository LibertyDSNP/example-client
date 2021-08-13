import { Input } from "antd";
import React, { useState } from "react";
import { createNote } from "../services/Storage";
import { sendReply } from "../services/sdk";
import { HexString } from "../utilities/types";
import { useAppSelector } from "../redux/hooks";

interface ReplyInputProps {
  parent: HexString;
}

const ReplyInput = ({ parent }: ReplyInputProps): JSX.Element => {
  const userId = useAppSelector((state) => state.user.id);
  const [saving, setSaving] = React.useState<boolean>(false);
  const [replyValue, setReplyValue] = useState<string>("");

  const createReply = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    if (!userId) return;
    setSaving(true);
    const newReplyFeedItem = await createNote(replyValue, [], userId);
    await sendReply(newReplyFeedItem, parent);
    setReplyValue("");
    setSaving(false);
  };

  return (
    <div className="ReplyInput__newReplyBlock">
      <Input.TextArea
        className="ReplyInput__input"
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
