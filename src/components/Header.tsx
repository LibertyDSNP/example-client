import React from "react";
import Login from "./Login";
import * as wallet from "../services/wallets/wallet";

const Header = (): JSX.Element => {
  return (
    <div className="Header__block">
      <h1 className="Header__title">Example Client</h1>
      <div>
        <Login loginWalletOptions={wallet.WalletType.NONE} isPrimary={true} />
      </div>
    </div>
  );
};
export default Header;
