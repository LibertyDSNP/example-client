import path from "path";
import {
  createVideo,
  createImage,
  ActivityContentNote,
  ActivityContentAttachment,
} from "@dsnp/sdk/core/activityContent";

const createMediaAttachment = (item: string): ActivityContentAttachment => {
  const extension = path.extname(item).replace(".", "");
  const supportedVideoDomains = /youtu.be|youtube.com|vimeo.com/;
  if (supportedVideoDomains.test(item)) {
    return createVideo(item, "text/html", { algorithm: "" }, 0, 0);
  } else {
    switch (extension) {
      case "mp4":
        return createVideo(item, "video/mp4", { algorithm: "" }, 0, 0);
      case "wmv":
        return createVideo(item, "video/x-ms-wmv", { algorithm: "" }, 0, 0);
      case "mov":
        return createVideo(item, "video/quicktime", { algorithm: "" }, 0, 0);
    }
    return createImage(item, `image/${extension}`, { algorithm: "" }, 0, 0);
  }
};

export const noteToActivityContentNote = (
  note: string,
  uriList: string[]
): ActivityContentNote => {
  const activityContent: ActivityContentNote = {
    "@context": "https://www.w3.org/ns/activitystreams",
    type: "Note",
    content: note,
    published: new Date().getTime().toString(16),
  };
  if (uriList) {
    activityContent["attachment"] = uriList.map(createMediaAttachment);
  }
  return activityContent;
};
