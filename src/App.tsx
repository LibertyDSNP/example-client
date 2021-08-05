import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";
import "antd/dist/antd.less";
import Header from "./components/Header";
import FeedNavigation from "./components/FeedNavigation";
import Profile from "./components/Profile";
import * as wallet from "./services/wallets/wallet";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setupProvider, startPostSubscription } from "./services/sdk";
import PostList from "./components/PostList";

enum FeedTypes {
  FEED,
  MY_POSTS,
  ALL_POSTS,
}

const App = (): JSX.Element => {
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

  const [feedType, setFeedType] = useState<FeedTypes>(FeedTypes.ALL_POSTS);

  return (
    <Router>
      <div className="App">
        <Header />
        <FeedNavigation feedType={feedType} setFeedType={setFeedType} />
        <main className="App__content">
          <PostList feedType={feedType} />
          <Profile />
        </main>
      </div>
    </Router>
  );
};

export default App;
