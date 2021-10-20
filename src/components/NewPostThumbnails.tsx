import { getThumbnailUrl } from "../utilities/helpers";
import { CloseCircleTwoTone, PictureOutlined } from "@ant-design/icons";
import React, { useState } from "react";

interface NewPostThumbnailsProps {
  uri: string;
  index: number;
  deleteImage: (index: number) => void;
}

const NewPostThumbnails = ({
  uri,
  index,
  deleteImage,
}: NewPostThumbnailsProps): JSX.Element => {
  const [thumbnail, setThumbnail] = useState<string>(getThumbnailUrl(uri));
  return (
    <div className="NewPostThumbnails__imageBlock">
      {thumbnail ? (
        <img
          alt=""
          className="NewPostThumbnails__image"
          src={thumbnail}
          onError={() => setThumbnail("")}
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
};

export default NewPostThumbnails;
