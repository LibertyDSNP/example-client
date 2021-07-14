import React from "react";
import LoginSetupInstructions from "./LoginSetupInstructions";
import Profile from "./Profile";
import { useAppSelector } from "../redux/hooks";
import * as types from "../utilities/types";

const ProfileBlock = (): JSX.Element => {
  const profile: types.Profile | undefined = useAppSelector(
    (state) => state.user.profile
  );
  return (
    <div className="ProfileBlock__block">
      {profile?.socialAddress ? <Profile /> : <LoginSetupInstructions />}
    </div>
  );
};
export default ProfileBlock;
