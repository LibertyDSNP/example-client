import React from "react";
import ReactPlayer from "react-player";
import { Carousel } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { ActivityPubAttachment } from "../utilities/activityPubTypes";

interface PostMediaProps {
  attachment: ActivityPubAttachment[] | undefined;
}

const PostMedia = ({ attachment }: PostMediaProps): JSX.Element => {
  const getPostMediaItems = () => {
    return attachment?.map(
      (
        item: { type: string; mediaType: string; url: string },
        index: number
      ) => (
        <div key={index} className="PostMedia__cover">
          {item.type.toLowerCase() === "image" && (
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <img alt="" className="PostMedia__img" src={item.url} />
            </a>
          )}
          {item.type.toLowerCase() === "video" && (
            <ReactPlayer
              controls
              playsinline
              className="PostMedia__img"
              url={item.url}
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
