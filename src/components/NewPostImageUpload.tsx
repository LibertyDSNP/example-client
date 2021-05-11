import { Alert, Input, Spin } from "antd";
import { CloseCircleTwoTone } from "@ant-design/icons";
import React from "react";
import cameraIcon from "../images/Camera.png";
import { HexString } from "../utilities/types";
import { Button } from "antd";

interface NewPostImageUploadProps {
  onNewPostImageUpload: (uris: string[]) => void;
}

const NewPostImageUpload = ({
  onNewPostImageUpload,
}: NewPostImageUploadProps): JSX.Element => {
  const [previewLoading, setPreviewLoading] = React.useState<boolean>(false);
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
            return (
              <div className="NewPostImageUpload__imageBlock" key={index}>
                <img
                  alt=""
                  className="NewPostImageUpload__image"
                  src={image}
                  onLoad={() => setPreviewLoading(false)}
                />
                <CloseCircleTwoTone
                  className="NewPostImageUpload__imageDelete"
                  onClick={() => deleteImage(index)}
                  twoToneColor="#9e9e9e"
                />
              </div>
            );
          })}
        {newUri && (
          <Spin
            className="NewPostImageUpload__spinner"
            spinning={previewLoading}
          />
        )}
      </div>
      <div className="NewPostImageUpload__urlInputBlock">
        <img
          className="NewPostImageUpload__icon"
          src={cameraIcon}
          alt="camera"
        />
        <Input
          className="NewPostImageUpload__urlInput"
          placeholder="Image URL"
          value={newUri || ""}
          onChange={(e) => {
            setPreviewLoading(true);
            newContentItem(e.target.value);
          }}
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
