import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";
import "antd/dist/antd.less";
import Header from "./components/Header";
import Feed from "./components/Feed";
import ProfileBlock from "./components/ProfileBlock";
import * as wallet from "./services/wallets/wallet";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setupProvider, startSubscriptions } from "./services/sdk";
import { userUpdateWalletType } from "./redux/slices/userSlice";
import { upsertSessionWalletType } from "./services/session";

const App = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const walletType = useAppSelector((state) => state.user.walletType);
  useEffect(() => {
    if (!walletType) return;
    if (walletType === wallet.WalletType.NONE) return;
    let unsubscribeFunctions: Record<string, any>;

    (async () => {
      try {
        await wallet.wallet(walletType).reload();
        setupProvider(walletType);
        unsubscribeFunctions = await dispatch(startSubscriptions);
      } catch (e) {
        if (e.message.match(/login cancelled/i)) {
          dispatch(userUpdateWalletType(wallet.WalletType.NONE));
          upsertSessionWalletType(wallet.WalletType.NONE);
        } else {
          console.error(e);
        }
      }
    })();

    return () => {
      if (!unsubscribeFunctions) return;

      Object.values(unsubscribeFunctions).forEach((unsubscribe: any) =>
        unsubscribe()
      );
    };
  });

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="App__content">
          <Feed />
          <ProfileBlock />
        </main>
      </div>
    </Router>
  );
};

export default App;
