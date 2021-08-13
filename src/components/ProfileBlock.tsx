import React from "react";
import LoginSetupInstructions from "./LoginSetupInstructions";
import Profile from "./Profile";
import { useAppSelector } from "../redux/hooks";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";

const ProfileBlock = (): JSX.Element => {
  const userId: DSNPUserId | undefined = useAppSelector(
    (state) => state.user.id
  );
  return (
    <div className="ProfileBlock__block">
      {userId ? <Profile /> : <LoginSetupInstructions />}
    </div>
  );
};
export default ProfileBlock;
