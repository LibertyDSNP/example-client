import React, { useEffect, useCallback } from "react";
import "./App.scss";
import "antd/dist/antd.less";
import ethereum from "./services/ethereum";
import GraphData from "./services/GraphData";
import {
  clearSession,
  getSession,
  hasSession,
  setSession,
  updateSession,
} from "./services/session";
import Header from "./components/Header";
import Feed from "./components/Feed";
import ProfileBlock from "./components/Profile";
import { HexString, Profile } from "./utilities/types";

const App: React.FC = () => {
  const [sessionLoading, setSessionLoading] = React.useState(true);
  const [profile, setProfile] = React.useState(null);
  const [walletAddress, setWalletAddress] = React.useState(null);
  const [socialAddress, setSocialAddress] = React.useState(null);
  const [privateGraphKeyCache, setPrivateGraphKeyCache] = React.useState(null);
  const [encryptionKeyCache, setEncryptionKeyCache] = React.useState(null);
  const [graph, setGraph] = React.useState(null);
  // const [loading, setLoading] = React.useState(true);
  const [walletName, setWalletName] = React.useState<string>(
    "Login for Wallet"
  );
  console.log(walletAddress, graph, walletName);
  // const [walletAction, setWalletAction] = React.useState(
  //   WalletAction.LoggedOut
  // );
  // const [announcements, _lastBlock] = useAnnouncements();
  // const feed = useFeed(setLoading, socialAddress, announcements);

  const logout = () => {
    clearSession();
    setProfile(null);
    setWalletAddress(null);
    setSocialAddress(null);
    setPrivateGraphKeyCache(null);
    setEncryptionKeyCache(null);
    setWalletName("Login for Wallet");
    // setWalletAction(WalletAction.LoggedOut);
  };

  const loadSession = useCallback((session) => {
    setProfile(session.profile);
    setWalletAddress(session.walletAddress);
    setSocialAddress(session.socialAddress);
    setPrivateGraphKeyCache(session.privateGraphKeyList);
    setEncryptionKeyCache(session.encryptedKeyList);
    setWalletName("Meta Mask");
    // setWalletAction(WalletAction.Inactive);
    // Logout if we change accounts
    ethereum.on("accountsChanged", (addresses: any[]) => {
      if (
        !addresses[0] ||
        addresses[0].toLowerCase() !== session.walletAddress.toLowerCase()
      ) {
        logout();
      }
    });

    // Logout and reload the page if the chainChanges
    ethereum.on("chainChanged", () => {
      logout();
      window.location.reload();
    });
  }, []);

  // If we have a session, load it.
  useEffect(() => {
    const session = getSession();
    if (session) {
      loadSession(session);
    } else if (hasSession()) {
      // Bad session? Cleanup everything
      logout();
    }
    setSessionLoading(false);
  }, [loadSession]);

  // Load up the graph
  useEffect(() => {
    if (sessionLoading) return;
    const graphInterval = GraphData(
      setGraph,
      socialAddress,
      privateGraphKeyCache
    );
    return () => {
      clearInterval(graphInterval);
    };
  }, [socialAddress, privateGraphKeyCache, sessionLoading]);

  // Update the session if updateable parts change
  useEffect(() => {
    updateSession(profile, privateGraphKeyCache, encryptionKeyCache);
  }, [profile, privateGraphKeyCache, encryptionKeyCache]);
  const onAuthenticate = async (
    walletAddress: HexString,
    socialAddress: HexString,
    profile: Profile,
    privateGraphKeyList: any[],
    encryptedKeyList: any[]
  ) => {
    const session = setSession({
      walletAddress,
      socialAddress,
      profile,
      privateGraphKeyList,
      encryptedKeyList,
    });
    loadSession(session);
  };

  return (
    <div className="App">
      <Header onAuthenticate={onAuthenticate} />
      <main className="App__content">
        <Feed />
        <ProfileBlock />
      </main>
    </div>
  );
};

export default App;
