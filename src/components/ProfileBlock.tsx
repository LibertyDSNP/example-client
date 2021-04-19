import React from "react";
import { useAppSelector } from "../redux/hooks";

const ProfileBlock = (): JSX.Element => {
  const profile = useAppSelector((state) => state.user.profile);

  return (
    <div className="Profile__block">
      <h1>Profile</h1>
      <div>Wallet Address: {profile?.walletAddress}</div>
      <div>Social Address: {profile?.socialAddress}</div>
      <div>Profile Name: {profile?.name || "null"}</div>
    </div>
  );
};
export default ProfileBlock;
