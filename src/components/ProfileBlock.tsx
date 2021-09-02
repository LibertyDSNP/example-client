import React from "react";
import LoginSetupInstructions from "./LoginSetupInstructions";
import Profile from "./Profile";
import { useAppSelector } from "../redux/hooks";

const ProfileBlock = (): JSX.Element => {
  const userId: string | undefined = useAppSelector((state) => state.user.id);

  const displayId: string | undefined = useAppSelector(
    (state) => state.user.displayId
  );

  const displayProfileBlockElement = () => {
    if (userId) {
      return <Profile />;
    }
    return displayId ? <Profile /> : <LoginSetupInstructions />;
  };

  return (
    <div className="ProfileBlock__block">{displayProfileBlockElement()}</div>
  );
};
export default ProfileBlock;
