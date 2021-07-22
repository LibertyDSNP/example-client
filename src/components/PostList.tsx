import React from "react";
import Post from "./Post";
import { FeedItem, Graph, Profile } from "../utilities/types";
import { useAppSelector } from "../redux/hooks";

enum FeedTypes {
  FEED,
  MY_POSTS,
  ALL_POSTS,
}

interface PostListProps {
  feedType: FeedTypes;
}

const PostList = ({ feedType }: PostListProps): JSX.Element => {
  const profile: Profile | undefined = useAppSelector(
    (state) => state.user.profile
  );
  const graph: Graph[] = useAppSelector((state) => state.graphs.graphs);
  const myGraph: Graph | undefined = graph.find(
    (graph) => graph.socialAddress === profile?.socialAddress
  );
  const feed: FeedItem[] = useAppSelector((state) => state.feed.feed).filter(
    (post) => post?.content?.type === "Note"
  );
  let currentFeed: FeedItem[] = [];

  if (feedType === FeedTypes.FEED) {
    currentFeed = feed.filter((post) => {
      myGraph?.following.filter((userAddress) => {
        if (userAddress === post?.fromAddress) {
          return post;
        }
        return null;
      });
      if (profile?.socialAddress === post?.fromAddress) {
        return post;
      }
      return null;
    });
  } else if (feedType === FeedTypes.MY_POSTS) {
    currentFeed = feed.filter(
      (post) => profile?.socialAddress === post?.fromAddress
    );
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
        </>
      ) : (
        "Empty Feed!"
      )}
    </div>
  );
};
export default PostList;
