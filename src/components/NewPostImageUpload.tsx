import { Alert, Input } from "antd";
import { CloseCircleTwoTone, CameraOutlined } from "@ant-design/icons";
import React from "react";
import { HexString } from "../utilities/types";
import { Button } from "antd";

interface NewPostImageUploadProps {
  onNewPostImageUpload: (uris: string[]) => void;
}

const NewPostImageUpload = ({
  onNewPostImageUpload,
}: NewPostImageUploadProps): JSX.Element => {
  const [urlErrorMsg, setUrlErrorMsg] = React.useState<string | null>(null);
  const [newUri, setNewUri] = React.useState<string>("");
  const [uriList, setUriList] = React.useState<string[]>([]);
  const hasValidPostURI = newUri && newUri.match(/.+\..+\//);

  const newContentItem = (value: HexString) => {
    setNewUri(value);
    setUrlErrorMsg(null);
  };

  const addContentToList = () => {
    if (hasValidPostURI) {
      const newUriList = [...uriList, newUri];
      setUriList(newUriList);
      onNewPostImageUpload(newUriList);
      setNewUri("");
    } else {
      setUrlErrorMsg("Invalid URL.");
    }
  };

  const deleteImage = (toBeDeletedIndex: number) => {
    const deletedImageArray = [...uriList];
    deletedImageArray.splice(toBeDeletedIndex, 1);
    setUriList(deletedImageArray);
    onNewPostImageUpload(deletedImageArray);
  };
  return (
    <>
      <div className="NewPostImageUpload__cover">
        {uriList &&
          uriList.map((image, index) => {
            const isYoutubeVideo = image.match(
              /^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/i
            );
            if (isYoutubeVideo) {
              image =
                "https://img.youtube.com/vi/" +
                isYoutubeVideo[1] +
                "/mqdefault.jpg";
            }

            return (
              <div className="NewPostImageUpload__imageBlock" key={index}>
                <img alt="" className="NewPostImageUpload__image" src={image} />
                <CloseCircleTwoTone
                  className="NewPostImageUpload__imageDelete"
                  onClick={() => deleteImage(index)}
                  twoToneColor="#1dcf76"
                />
              </div>
            );
          })}
      </div>
      <div className="NewPostImageUpload__urlInputBlock">
        <CameraOutlined style={{ fontSize: "28px" }} />
        <Input
          className="NewPostImageUpload__urlInput"
          placeholder="Content URL"
          value={newUri || ""}
          onChange={(e) => newContentItem(e.target.value)}
          onPressEnter={addContentToList}
        />
        <Button
          className="NewPostImageUpload__urlInputBtn"
          onClick={addContentToList}
        >
          Add
        </Button>
      </div>
      {urlErrorMsg && (
        <Alert
          className="NewPostImageUpload__alert"
          type="error"
          message={urlErrorMsg}
        />
      )}
    </>
  );
};
export default NewPostImageUpload;
