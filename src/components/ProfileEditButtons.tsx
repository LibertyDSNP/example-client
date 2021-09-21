import { Button } from "antd";
import React from "react";

interface ProfileEditButtonsProps {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  saveEditProfile: () => void;
  didEditProfile: boolean;
  cancelEditProfile: () => void;
}

const ProfileEditButtons = ({
  isEditing,
  saveEditProfile,
  didEditProfile,
  cancelEditProfile,
  setIsEditing,
}: ProfileEditButtonsProps): JSX.Element => {
  return isEditing ? (
    <>
      <Button
        className="ProfileBlock__editButton"
        onClick={() => saveEditProfile()}
        disabled={!didEditProfile}
      >
        save
      </Button>
      <Button
        className="ProfileBlock__editButton"
        onClick={() => cancelEditProfile()}
      >
        cancel
      </Button>
    </>
  ) : (
    <Button
      className="ProfileBlock__editButton"
      onClick={() => setIsEditing(!isEditing)}
    >
      edit
    </Button>
  );
};
export default ProfileEditButtons;
