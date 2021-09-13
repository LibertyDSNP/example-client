import React from "react";
import Login from "./Login";
import * as wallet from "../services/wallets/wallet";

const Header = (): JSX.Element => {
  return (
    <div className="Header__block">
      <h1 className="Header__title">Example Client</h1>
      <Login loginWalletOptions={wallet.WalletType.NONE} isPrimary={true} />
    </div>
  );
};
export default Header;
