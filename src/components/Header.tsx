import React from "react";
import Login from "./Login";
import { Graph, HexString, Profile } from "../utilities/types";

interface LoginProps {
  onAuthenticate: (
    walletAddress: HexString,
    socialAddress: HexString,
    profile: Profile,
    graph: Graph
  ) => void;
}

const Header = ({ onAuthenticate }: LoginProps): JSX.Element => {
  return (
    <div className="Header__block">
      <h1>Example Client</h1>
      <Login onAuthenticate={onAuthenticate} />
    </div>
  );
};
export default Header;
