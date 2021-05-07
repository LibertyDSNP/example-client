import { randInt } from "@unfinishedlabs/test-generators";
import { FeedItem } from "../utilities/types";

// This is a placeholder method until we have a server that can return data
// Eventually this method will actually fetch from a uri an activity pub content messagte
export const loadContent = async (
  feedItems: FeedItem[]
): Promise<FeedItem[]> => {
  feedItems.forEach((feedItem) => {
    if (feedItem.address) getItemContent(feedItem);
    feedItem.replies.forEach((reply) => {
      if (reply.address) getItemContent(reply);
    });
  });
  return await feedItems;
};

const getItemContent = (feedItem: FeedItem) => {
  const picID = randInt(50) + 1000;
  feedItem.content = {
    actor: feedItem.address || "ERROR",
    type: "Note",
    content: `This is a message from ${feedItem.address} and the ID is ${feedItem.hash}`,
    attachment: [
      {
        type: "Image",
        mediaType: "image",
        url: `https://picsum.photos/id/${picID}/200/300`,
      },
    ],
  };
  return feedItem;
};
