import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";
import "antd/dist/antd.less";
import Header from "./components/Header";
import Feed from "./components/Feed";
import ProfileBlock from "./components/ProfileBlock";
import * as wallet from "./services/wallets/wallet";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setupProvider } from "./services/dsnp";
import { startSubscriptions } from "./services/content";
import { userUpdateWalletType } from "./redux/slices/userSlice";
import { upsertSessionWalletType } from "./services/session";
import { QueryClient, QueryClientProvider } from "react-query";
import { Modal } from "antd";
import { UnsubscribeFunction } from "@dsnp/sdk/core/contracts/utilities";
import { friendlyError } from "./services/errors";

const App = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const showSetupError = (message: string) => {
    Modal.error({
      title: "Error setting up provider",
      content: friendlyError(message),
    });
  };

  const walletType = useAppSelector((state) => state.user.walletType);
  useEffect(() => {
    if (!walletType) return;
    if (walletType === wallet.WalletType.NONE) return;
    let unsubscribeFunction: UnsubscribeFunction;

    (async () => {
      try {
        await wallet.wallet(walletType).reload();
        await setupProvider(walletType);
        unsubscribeFunction = await dispatch(startSubscriptions);
      } catch (e) {
        if (!e.message.match(/login cancelled/i)) {
          console.error("Error in initial provider setup", e);
          showSetupError(e.toString());
        }
        dispatch(userUpdateWalletType(wallet.WalletType.NONE));
        upsertSessionWalletType(wallet.WalletType.NONE);
      }
    })();

    return () => {
      unsubscribeFunction();
    };
  });

  const queryClient = new QueryClient();

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <Header />
          <main className="App__content">
            <Feed />
            <ProfileBlock />
          </main>
        </div>
      </QueryClientProvider>
    </Router>
  );
};

export default App;
