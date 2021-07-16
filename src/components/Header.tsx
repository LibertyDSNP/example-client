import React from "react";
import Login from "./Login";
import * as wallet from "../services/wallets/wallet";

const Header = (): JSX.Element => {
  return (
    <div className="Header__block">
<<<<<<< HEAD
      <h1 className="Header__title">Example Client</h1>
      <Login loginWalletOptions={wallet.WalletType.NONE} />
=======
      <h1 className="Header__title">Example Client {process.env.RPC_URL}</h1>
      <Login />
>>>>>>> round trip DSNP message
    </div>
  );
};
export default Header;
