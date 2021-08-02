import { Tabs } from "antd";
import { isInstalled } from "../services/wallets/metamask/metamask";
import Login from "./Login";
import * as wallet from "../services/wallets/wallet";
import React from "react";

const LoginSetupInstructions = (): JSX.Element => {
  return (
    <>
      <div className="ProfileBlock__loginHeaderText"> Login Quick Start</div>
      <p>
        To use the Example Client, you must log in with either MetaMask or
        Torus. Read the guides below to get started!
      </p>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="MetaMask" key="1">
          <div className="ProfileBlock__loginTitleText">
            MetaMask Log In Guide
          </div>
          {isInstalled() ? (
            <>
              <p>
                You already have MetaMask installed! Just click the{" "}
                <code>Log In &#8594; MetaMask</code> button.
              </p>
              <Login loginWalletOptions={wallet.WalletType.METAMASK} />
            </>
          ) : (
            <>
              <p>
                Before we can access the browser we need to install MetaMask to
                give us a cryptowallet. MetaMask is a browser extension Chrome
                or Firefox are recommended. Download them from your chosen
                browsers extension manager. Pin MetaMask to your extension bar.
              </p>
              <p>
                Once{" "}
                <a href="https://metamask.io/download.html" target="__blank">
                  installed correctly
                </a>
                , setup MetaMask by following these steps:
              </p>
              <ul>
                <li>Use an existing account do not create a new one.</li>
                <li>
                  For account data use the following seed:{" "}
                  <code>
                    stove ankle number crucial clay heavy toilet entire bid
                    betray cluster degree
                  </code>
                </li>
                <li>
                  Connect to a new Custom RPC.
                  <ul>
                    <li>Connect to a new Custom RPC.</li>
                    <li>
                      Name: <code>*determined by user</code>
                    </li>
                    <li>
                      New RPC URL: <code>http://localhost:7545</code>
                    </li>
                    <li>
                      ChainID: <code>1337</code>
                    </li>
                  </ul>
                </li>
                <li>Once setup, select/connect to that Custom RPC.</li>
              </ul>
              <Login loginWalletOptions={wallet.WalletType.METAMASK} />
            </>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Torus" key="2">
          <div className="ProfileBlock__loginTitleText">Torus Log In Guide</div>
          <p>
            There is no setup required for Torus. Just click the{" "}
            <code>Log In &#8594; Torus</code> button.
          </p>
          <Login loginWalletOptions={wallet.WalletType.TORUS} />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default LoginSetupInstructions;
