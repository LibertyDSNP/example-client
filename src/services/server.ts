import { FeedItem } from "../utilities/types";

export const loadContent = async (
  feedItems: FeedItem[]
): Promise<FeedItem[]> => {
  // Add fetch call to server here to retrieve feed content
  return await feedItems;
};
