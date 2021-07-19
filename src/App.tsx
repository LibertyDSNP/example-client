import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";
import "antd/dist/antd.less";
import Header from "./components/Header";
import Feed from "./components/Feed";
import ProfileBlock from "./components/ProfileBlock";
import * as wallet from "./services/wallets/wallet";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setupProvider, startPostSubscription } from "./services/sdk";

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const walletType = useAppSelector((state) => state.user.walletType);
  useEffect(() => {
    if (walletType) {
      wallet.wallet(walletType).reload();
      setupProvider();
      dispatch(startPostSubscription);
    }
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
