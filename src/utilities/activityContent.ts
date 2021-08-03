import path from "path";
import {
  ActivityContentNote,
  ActivityContentAttachment,
  createVideoLink,
  createVideoAttachment,
  ActivityContentHash,
  createImageAttachment,
  createImageLink,
  createHash,
  createAudioLink,
  createAudioAttachment,
} from "@dsnp/sdk/core/activityContent";

const createMediaAttachment = (item: string): ActivityContentAttachment => {
  const extension = path.extname(item).replace(".", "");
  const supportedVideoDomains = /youtu.be|youtube.com|vimeo.com/;

  const contentHash = createHash(item);
  const activityContentHashes: Array<ActivityContentHash> = [contentHash];

  if (supportedVideoDomains.test(item)) {
    const link = createVideoLink(item, "text/html", activityContentHashes);
    return createVideoAttachment([link]);
  } else {
    switch (extension) {
      case "mp4":
        return createVideoAttachment([
          createVideoLink(item, "video/mp4", activityContentHashes),
        ]);
      case "wmv":
        return createVideoAttachment([
          createVideoLink(item, "video/x-ms-wmv", activityContentHashes),
        ]);
      case "mov":
        return createVideoAttachment([
          createVideoLink(item, "video/quicktime", activityContentHashes),
        ]);
      case "webm":
        return createVideoAttachment([
          createVideoLink(item, "video/webm", activityContentHashes),
        ]);
      case "mp3":
        return createAudioAttachment([
          createAudioLink(item, "audio/mpeg", activityContentHashes),
        ]);
      case "ogg":
        return createAudioAttachment([
          createAudioLink(item, "audio/ogg", activityContentHashes),
        ]);
      default:
        return createImageAttachment([
          createImageLink(item, `image/${extension}`, activityContentHashes),
        ]);
    }
  }
};

export const noteToActivityContentNote = (
  note: string,
  uriList: string[]
): ActivityContentNote => {
  const activityContent: ActivityContentNote = {
    "@context": "https://www.w3.org/ns/activitystreams",
    type: "Note",
    mediaType: "text/plain",
    content: note,
    published: new Date().getTime().toString(16),
  };
  if (uriList) {
    activityContent["attachment"] = uriList.map(createMediaAttachment);
  }
  return activityContent;
};
