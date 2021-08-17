import React from "react";
import Post from "./Post";
import { FeedItem, Graph } from "../utilities/types";
import { useAppSelector } from "../redux/hooks";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import {
  ActivityContentHashtag,
  ActivityContentMention,
  ActivityContentTag,
} from "@dsnp/sdk/core/activityContent";
import Masonry from "react-masonry-css";

enum FeedTypes {
  FEED,
  MY_POSTS,
  ALL_POSTS,
}

const appDefaultTags = (process.env.APP_DEFAULT_TAGS || "restaurant").split(
  ","
);
console.log("appDefaultTags: ", appDefaultTags);
interface PostListProps {
  feedType: FeedTypes;
}

const PostList = ({ feedType }: PostListProps): JSX.Element => {
  const userId: DSNPUserId | undefined = useAppSelector(
    (state) => state.user.id
  );
  const myGraph: Record<DSNPUserId, boolean> = useAppSelector(
    (state) => (userId ? state.graphs.following[userId] : undefined) || {}
  );
  const feed: FeedItem[] = useAppSelector((state) => state.feed.feed).filter(
    (post) => post?.content?.type === "Note" && post?.inReplyTo === undefined
  );

  const isAHashTag = (
    tag: ActivityContentTag | ActivityContentMention | undefined
  ): boolean => !!tag?.name && !("type" in tag);

  const checkTags = (tag: ActivityContentHashtag | ActivityContentMention) => {
    if (!isAHashTag(tag)) return false;
    const res = appDefaultTags.some((dt) => dt === tag.name?.replace("#", ""));
    return res;
  };

  const hasAppDefaultTag = (
    tagList: ActivityContentTag | Array<ActivityContentTag> | undefined
  ): boolean => {
    if (!tagList) return false;
    if (Array.isArray(tagList)) {
      // return tagList.some((tag) => checkTags(tag));
      for (const tag of tagList) {
        if (checkTags(tag)) return true;
      }
      return false;
    } else return checkTags(tagList);
  };

  const getTagListFromPost = (feedItem: FeedItem): Array<string> => {
    if (!feedItem.content.tag) return [];

    const tagList: Array<ActivityContentTag> = !Array.isArray(
      feedItem.content.tag
    )
      ? [feedItem.content.tag]
      : feedItem.content.tag;

    return tagList
      .filter((tag) => tag?.name !== "")
      .map((tag) => (tag?.name || "").replace("#", ""));
  };

  let currentFeed: FeedItem[] = [];

  if (feedType === FeedTypes.FEED) {
    currentFeed = feed.filter(
      (post) => post?.fromId === userId || post?.fromId in myGraph
    );
  } else if (feedType === FeedTypes.MY_POSTS) {
    currentFeed = feed.filter((post) => userId === post?.fromId);
  } else {
    currentFeed = feed.filter((post) => hasAppDefaultTag(post.content.tag));
  }

  currentFeed.sort(function (a, b) {
    return a.timestamp - b.timestamp;
  });

  const items = currentFeed
    .slice(0)
    .reverse()
    .map((post, index) => {
      if (!post.fromId) throw new Error(`no fromId in post: ${{ post }}`);

      const namedPost: FeedItem = {
        ...post,
        tags: getTagListFromPost(post),
      };
      return <Post key={index} feedItem={namedPost} />;
    });

  return (
    <Masonry
      breakpointCols={3}
      className="PostList__block"
      columnClassName="PostList__blockColumn"
    >
      {items}
    </Masonry>
  );
};
export default PostList;
