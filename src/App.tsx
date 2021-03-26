import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";
import "antd/dist/antd.less";
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
import { Graph, HexString, Profile } from "./utilities/types";

const App: React.FC = () => {
  const [_sessionLoading, setSessionLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [walletAddress, setWalletAddress] = useState<HexString | null>(null);
  const [socialAddress, setSocialAddress] = useState<HexString | null>(null);
  const [graph, setGraph] = useState<Graph | null>(null);

  const logout = () => {
    clearSession();
    setProfile(null);
    setWalletAddress(null);
    setSocialAddress(null);
    setGraph(null);
  };

  const loadSession = useCallback((session) => {
    setProfile(session.profile);
    setWalletAddress(session.walletAddress);
    setSocialAddress(session.socialAddress);
    setGraph(session.graph);
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

  // Update the session if updateable parts change
  useEffect(() => {
    updateSession(profile);
  }, [profile]);

  const onAuthenticate = async (
    walletAddress: HexString,
    socialAddress: HexString,
    profile: Profile,
    graph: Graph
  ) => {
    const session = setSession({
      walletAddress,
      socialAddress,
      profile,
      graph,
    });
    loadSession(session);
  };

  return (
    <Router>
      <div className="App">
        <Header onAuthenticate={onAuthenticate} />
        <main className="App__content">
          <Feed />
          <ProfileBlock />
          <div>
            <div>Wallet Addres: {walletAddress}</div>
            <div>Social Address{socialAddress}</div>
            <div>PRofile Name{profile?.name}</div>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
