import React from "react";
import ConnectWallet from "./ConnectWallet";

const Header = (): JSX.Element => {
  return (
    <div className="Header__block">
      <h1 className="Header__title">Example Client</h1>
      <ConnectWallet />
    </div>
  );
};
export default Header;
