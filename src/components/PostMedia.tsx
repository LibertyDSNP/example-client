import React from "react";
import ReactPlayer from "react-player";
import { Carousel } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { ActivityContentImage } from "@dsnp/sdk/core/activityContent";

interface PostMediaProps {
  attachment: ActivityContentImage[] | undefined;
}

const PostMedia = ({ attachment }: PostMediaProps): JSX.Element => {
  const getPostMediaItems = () => {
    return attachment?.map((item, index) => {
      return (
        <div key={index} className="PostMedia__cover">
          {item.type.toLowerCase() === "image" && (
            <a
              href={item.url[0].href as string}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt=""
                className="PostMedia__img"
                src={item.url[0].href as string}
              />
            </a>
          )}
          {item.type.toLowerCase() === "video" && (
            <ReactPlayer
              controls
              playsinline
              className="PostMedia__img"
              url={item.url[0].href as string}
              width={670}
              height={400}
              muted
            />
          )}
          {item.type.toLowerCase() === "audio" && (
            <ReactPlayer
              controls
              playsinline
              className="PostMedia__img"
              url={item.url[0].href as string}
              width={670}
              height={55}
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
