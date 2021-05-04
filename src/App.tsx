import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";
import "antd/dist/antd.less";
import Header from "./components/Header";
import Feed from "./components/Feed";
import ProfileBlock from "./components/ProfileBlock";
import { wallet } from "./services/wallets/wallet";
import { useAppSelector } from "./redux/hooks";

const App: React.FC = () => {
  const walletType = useAppSelector((state) => state.user.walletType);
  useEffect(() => {
    if (walletType) wallet(walletType).reload();
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
