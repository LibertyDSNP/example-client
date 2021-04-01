import React from "react";
import Login from "./Login";
import { Graph, HexString, Profile } from "../utilities/types";

interface LoginProps {
  onAuthenticate: (
    walletAddress: HexString | null,
    socialAddress: HexString | null,
    profile: Profile,
    graph: Graph
  ) => void;
  logout: () => void;
  socialAddress: HexString | null;
}

const Header = ({
  onAuthenticate,
  logout,
  socialAddress,
}: LoginProps): JSX.Element => {
  return (
    <div className="Header__block">
      <h1 className="Header__title">Example Client</h1>
      <Login
        onAuthenticate={onAuthenticate}
        logout={logout}
        socialAddress={socialAddress}
      />
    </div>
  );
};
export default Header;
