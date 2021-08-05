import React from "react";
import Post from "./Post";
import { Graph, FeedItem } from "../utilities/types";
import { useAppSelector } from "../redux/hooks";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import { ActivityContentNote } from "@dsnp/sdk/core/activityContent";

enum FeedTypes {
  FEED,
  MY_POSTS,
  ALL_POSTS,
}

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
  let currentFeed: FeedItem<ActivityContentNote>[] = [];

  if (feedType === FeedTypes.FEED) {
    const addrSet = userId ? { [userId]: true } : {};
    myGraph?.following.forEach((addr) => (addrSet[addr] = true));
    currentFeed = feed.filter((post) => post?.fromId in addrSet);
  } else if (feedType === FeedTypes.MY_POSTS) {
    currentFeed = feed.filter((post) => userId === post?.fromId);
  } else {
    currentFeed = feed;
  }

  return (
    <div className="PostList__block">
      {currentFeed.length > 0 ? (
        <>
          {currentFeed
            .slice(0)
            .reverse()
            .map((post, index) => (
              <Post key={index} feedItem={post} />
            ))}
            .map((post, index) => {
              if (!post.fromAddress)
                throw new Error(`no fromAddress in post: ${post}`);

              const fromAddress: string = profiles[post.fromAddress]
                ? (profiles[post.fromAddress].name as string)
                : post.fromAddress;

              const namedPost: FeedItem<ActivityContentNote> = {
                ...post,
                fromAddress: fromAddress,
                timestamp: Math.floor(Math.random() * 999999),
                tags: ["#foodee"],
              };
              return <Post key={index} feedItem={namedPost} />;
            })}
        </>
      ) : (
        "Empty FeedNavigation!"
      )}
    </div>
  );
};
export default PostList;
