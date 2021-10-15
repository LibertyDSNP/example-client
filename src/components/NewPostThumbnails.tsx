import { getThumbnail } from "../utilities/helpers";
import { CloseCircleTwoTone, PictureOutlined } from "@ant-design/icons";
import React from "react";

interface NewPostThumbnailsProps {
  uriList: string[];
  deleteImage: (index: number) => void;
}

const NewPostThumbnails = ({
  uriList,
  deleteImage,
}: NewPostThumbnailsProps): JSX.Element => {
  return (
    <div className="NewPostThumbnails__cover">
      {uriList &&
        uriList.map((uri, index) => {
          const thumbnail = getThumbnail(uri);
          return (
            <div className="NewPostThumbnails__imageBlock" key={index}>
              {thumbnail ? (
                <img
                  alt=""
                  className="NewPostThumbnails__image"
                  src={thumbnail}
                />
              ) : (
                <div className="NewPostThumbnails__imageAlt">
                  <PictureOutlined />
                </div>
              )}
              <CloseCircleTwoTone
                className="NewPostThumbnails__imageDelete"
                onClick={() => deleteImage(index)}
                twoToneColor="#1dcf76"
              />
            </div>
          );
        })}
    </div>
  );
};

export default NewPostThumbnails;
