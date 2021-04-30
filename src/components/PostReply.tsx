import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { FeedItem } from "../utilities/types";
import { Input } from "antd";
import { storeReply } from "../services/Storage";
import { addFeedItem } from "../redux/slices/feedSlice";

interface PostReplyProps {
  parent: string;
}

const PostReply = ({ parent }: PostReplyProps): JSX.Element => {
  // const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const feed: FeedItem[] = useAppSelector((state) => state.feed.feed);
  feed.filter((post) => post.content.type === "Note");
  const [saving, setSaving] = React.useState<boolean>(false);
  const [replyValue, setReplyValue] = useState<string>("");

  const createReply = async () => {
    //save reply here
    //not sure how we want to do that
    if (!profile) return;
    setSaving(true);
    const newPostFeedItem: FeedItem = await storeReply(
      profile.socialAddress,
      replyValue,
      parent
    );
    // dispatch(addFeedItem(newPostFeedItem));
    console.log(newPostFeedItem);
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
        onPressEnter={() => createReply()}
      />
    </div>
  );
};

export default PostReply;
