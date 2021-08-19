import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";
import "antd/dist/antd.less";
import Header from "./components/Header";
import FeedNavigation from "./components/FeedNavigation";
import Profile from "./components/Profile";
import * as wallet from "./services/wallets/wallet";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setupProvider, startSubscriptions } from "./services/sdk";

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
    if (!walletType) return;
    if (walletType === wallet.WalletType.NONE) return;
    let unsubscribeFunctions: Record<string, any>;

    (async () => {
      await wallet.wallet(walletType).reload();
      setupProvider(walletType);

      unsubscribeFunctions = await dispatch(startSubscriptions);
    })();

    return () => {
      if (!unsubscribeFunctions) return;
      Object.values(unsubscribeFunctions).forEach(async (unsubscribe: any) => {
        try {
          console.log("unsub try: ", unsubscribe);
          return await unsubscribe();
        } catch (e) {
          console.error(
            "probably here because an unsub is a Promise, not a func: ",
            e.message
          );
          return;
        }
      });
    };
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
