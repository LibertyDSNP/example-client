import React from "react";
import ReactPlayer from "react-player";
import { Carousel } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import {
  ActivityContentAttachment,
  ActivityContentImage,
  ActivityContentVideo,
  ActivityContentAudio,
} from "@dsnp/sdk/core/activityContent";

interface PostMediaProps {
  attachments: ActivityContentAttachment[];
}

function isImage(
  attachment: ActivityContentAttachment
): attachment is ActivityContentImage {
  return attachment.type.toLowerCase() === "image";
}

function isVideo(
  attachment: ActivityContentAttachment
): attachment is ActivityContentVideo {
  return attachment.type.toLowerCase() === "video";
}

function isAudio(
  attachment: ActivityContentAttachment
): attachment is ActivityContentAudio {
  return attachment.type.toLowerCase() === "audio";
}

const PostMedia = ({ attachments }: PostMediaProps): JSX.Element => {
  const getPostMediaItems = () => {
    return attachments.map((attachment, index) => {
      return (
        <div key={index} className="PostMedia__cover">
          {isImage(attachment) && (
            <a
              href={attachment.url[0].href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt={attachment.name}
                className="PostMedia__img"
                src={attachment.url[0].href}
              />
            </a>
          )}
          {(isVideo(attachment) || isAudio(attachment)) && (
            <ReactPlayer
              controls
              playsinline
              className="PostMedia__img"
              url={attachment.url[0].href}
              width={670}
              height={isVideo(attachment) ? 400 : 55}
              muted
            />
          )}
        </div>
      );
    });
  };

  return (
    <Carousel
      nextArrow={<RightOutlined />}
      prevArrow={<LeftOutlined />}
      dots={true}
    >
      {getPostMediaItems()}
    </Carousel>
  );
};
export default PostMedia;
