import { Alert, Input } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import React from "react";
import { HexString } from "../utilities/types";
import { Button } from "antd";
import NewPostThumbnails from "./NewPostThumbnails";

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
      <div className="NewPostThumbnails__cover">
        {uriList &&
          uriList.map((uri, index) => (
            <div key={index}>
              <NewPostThumbnails
                uri={uri}
                index={index}
                deleteImage={deleteImage}
              />
            </div>
          ))}
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
