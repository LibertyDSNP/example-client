import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";
import "antd/dist/antd.less";
import Header from "./components/Header";
import Feed from "./components/Feed";
import ProfileBlock from "./components/ProfileBlock";
import web3Torus, { BuildEnvironment } from "./services/wallets/tweb3";
import * as torus from "./services/wallets/torus";

const App: React.FC = () => {
  useEffect(() => {
    // How to abstract a torus specific functionality?
    const pageUsingTorus = sessionStorage.getItem("pageUsingTorus");
    if (pageUsingTorus && !torus.isInitialized()) {
      web3Torus.initialize(pageUsingTorus as BuildEnvironment);
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
