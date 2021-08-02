import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";
import "antd/dist/antd.less";
import Header from "./components/Header";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import * as wallet from "./services/wallets/wallet";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setupProvider, startPostSubscription } from "./services/sdk";

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const walletType = useAppSelector((state) => state.user.walletType);
  useEffect(() => {
    if (walletType && walletType !== wallet.WalletType.NONE) {
      (async () => {
        await wallet.wallet(walletType).reload();
        setupProvider(walletType);
        dispatch(startPostSubscription);
      })();
    }
  });

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="App__content">
          <Feed />
          <Profile />
        </main>
      </div>
    </Router>
  );
};

export default App;
