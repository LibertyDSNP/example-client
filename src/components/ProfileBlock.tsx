import React from "react";
import { HexString, Profile } from "../utilities/types";

interface ProfileProps {
  walletAddress: HexString | null;
  socialAddress: HexString | null;
  profile: Profile | null;
}

const ProfileBlock = ({
  walletAddress,
  socialAddress,
  profile,
}: ProfileProps): JSX.Element => {
  return (
    <div className="Profile__block">
      <h1>Profile</h1>
      <div>Wallet Address: {walletAddress}</div>
      <div>Social Address: {socialAddress}</div>
      <div> Profile Name: {profile?.name || "null"}</div>
    </div>
  );
};
export default ProfileBlock;
