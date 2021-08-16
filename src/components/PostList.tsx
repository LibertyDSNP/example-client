import React from "react";
import Post from "./Post";
import { FeedItem, Graph } from "../utilities/types";
import { useAppSelector } from "../redux/hooks";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import { HexString } from "@dsnp/sdk/dist/types/types/Strings";
import {
  ActivityContentHashtag,
  ActivityContentMention,
  ActivityContentNote,
  ActivityContentTag,
} from "@dsnp/sdk/core/activityContent";
import Masonry from "react-masonry-css";

enum FeedTypes {
  FEED,
  MY_POSTS,
  ALL_POSTS,
}

const appDefaultTags = (process.env.APP_DEFAULT_TAGS || "foodee").split(",");

interface PostListProps {
  feedType: FeedTypes;
}

const PostList = ({ feedType }: PostListProps): JSX.Element => {
  const userId: DSNPUserId | undefined = useAppSelector(
    (state) => state.user.id
  );
  const graph: Graph[] = useAppSelector((state) => state.graphs.graphs);
  const myGraph: Graph | undefined = graph.find(
    (graph) => graph.dsnpUserId === userId
  );
  const feed: FeedItem[] = useAppSelector((state) => state.feed.feed).filter(
    (post) => post?.content?.type === "Note" && post?.inReplyTo === undefined
  );
  const profiles: Record<HexString, Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
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
      console.log("taglist: ", tagList);
      return tagList.some((tag) => checkTags(tag));
    } else return checkTags(tagList);
  };

  const getTagListFromPost = (
    feedItem: FeedItem<ActivityContentNote>
  ): Array<string> => {
    if (!feedItem.content.tag) return [];

    const tagList: Array<ActivityContentTag> = !Array.isArray(
      feedItem.content.tag
    )
      ? [feedItem.content.tag]
      : feedItem.content.tag;

    const filtered = tagList.filter((t) => hasAppDefaultTag(t));
    console.log("filtered: ", filtered);
    const mapped = filtered.map((filteredTag) => filteredTag.name || "");
    return mapped; // should never be blank
  };

  let currentFeed: FeedItem<ActivityContentNote>[] = [];

  if (feedType === FeedTypes.FEED) {
    const addrSet = userId ? { [userId]: true } : {};
    myGraph?.following.forEach((addr) => (addrSet[addr] = true));
    currentFeed = feed.filter((post) => post?.fromId in addrSet);
    currentFeed = feed.filter((post) => {
      return post?.fromAddress in addrSet || hasAppDefaultTag(post.content.tag);
    });
  } else if (feedType === FeedTypes.MY_POSTS) {
    currentFeed = feed.filter((post) => userId === post?.fromId);
  } else {
    // All Posts
    currentFeed = feed;
  }

  currentFeed.sort(function (a, b) {
    return a.timestamp - b.timestamp;
  });

  const items = currentFeed
    .slice(0)
    .reverse()
    .map((post, index) => {
      if (!post.fromAddress) throw new Error(`no fromAddress in post: ${post}`);

      const namedPost: FeedItem = {
        ...post,
        fromAddress: fromAddress,
        timestamp: post.timestamp,
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
