import React from "react";
import Login from "./Login";
import * as wallet from "../services/wallets/wallet";

const Header = (): JSX.Element => {
  return (
    <div className="Header__blockOuter">
      <div className="Header__blockInner">
        <div>
          <h1 className="Header__title">Foodee</h1>
          <h2 className="Header__subtitle">Always in the mood for food</h2>
        </div>
        <Login loginWalletOptions={wallet.WalletType.NONE} />
      </div>
    </div>
  );
};
export default Header;
