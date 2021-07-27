import React from "react";
import ReactPlayer from "react-player";
import { Carousel } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import {
  ActivityContentImage,
  ActivityContentLink,
} from "@dsnp/sdk/core/activityContent";

interface PostMediaProps {
  attachment: ActivityContentImage[] | undefined;
}

const PostMedia = ({ attachment }: PostMediaProps): JSX.Element => {
  const getPostMediaItems = () => {
    return attachment?.map(
      (
        item: {
          type: string;
          mediaType: string;
          url: string | ActivityContentLink;
        },
        index: number
      ) => (
        <div key={index} className="PostMedia__cover">
          {item.type.toLowerCase() === "image" && (
            <a
              href={item.url as string}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img alt="" className="PostMedia__img" src={item.url as string} />
            </a>
          )}
          {item.type.toLowerCase() === "video" && (
            <ReactPlayer
              controls
              playsinline
              className="PostMedia__img"
              url={item.url as string}
              width={535}
              height={375}
              muted
            />
          )}
        </div>
      )
    );
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
