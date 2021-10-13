import { Alert, Input } from "antd";
import {
  CloseCircleTwoTone,
  CameraOutlined,
  PictureOutlined,
} from "@ant-design/icons";
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

  const getThumbnail = (uri: string): string | undefined => {
    const isYoutubeVideo = uri.match(
      /\/\/((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w]+)(\S+)?$/i
    );

    if (isYoutubeVideo)
      return (
        "https://img.youtube.com/vi/" + isYoutubeVideo[4] + "/mqdefault.jpg"
      );

    const isVimeo = uri.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
    if (isVimeo) return "https://vumbnail.com/" + isVimeo[1] + ".jpg";

    const isImage = uri.match(/\.(jpeg|jpg|gif|png|svg)$/);
    if (isImage) return uri;

    return;
  };

  return (
    <>
      <div className="NewPostImageUpload__cover">
        {uriList &&
          uriList.map((uri, index) => {
            const thumbnail = getThumbnail(uri);
            return (
              <div className="NewPostImageUpload__imageBlock" key={index}>
                {thumbnail ? (
                  <img
                    alt=""
                    className="NewPostImageUpload__image"
                    src={thumbnail}
                  />
                ) : (
                  <div className="NewPostImageUpload__imageAlt">
                    <PictureOutlined />
                  </div>
                )}
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
