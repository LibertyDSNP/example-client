import React from "react";
import { useHistory } from "react-router-dom";
import { Alert, Button, Form, Layout, Spin } from "antd";
import logo from "../images/friendly-logo-green.svg";
import * as sdk from "../services/sdk";
import { Graph, HexString, Profile } from "../utilities/types";
import * as torus from "../services/wallets/torus";

interface LoginProps {
  onAuthenticate: (
    walletAddress: HexString,
    socialAddress: HexString,
    profile: Profile,
    graph: Graph
  ) => void;
}

const Login = ({ onAuthenticate }: LoginProps): JSX.Element => {
  const [loading, startLoading] = React.useState<boolean>(false);
  const [alertError, setAlertError] = React.useState<string>("");

  const history = useHistory();

  const auth = async (
    walletAddress: HexString,
    socialAddress: HexString,
    profile: Profile,
    graph: Graph
  ) => {
    await onAuthenticate(walletAddress, socialAddress, profile, graph);
    history.push("/");
  };

  const startTorusLogin = async () => {
    if (loading) return;
    startLoading(true);
    try {
      await torus.enableTorus();
      const walletAddress = await torus.getWalletAddress();
      console.log("connAddr: ", walletAddress);
      const socialAddress = await sdk.getSocialIdentity(walletAddress);
      const profile = await sdk.getProfile(socialAddress);
      const graph = await sdk.getGraph(socialAddress);
      auth(walletAddress, socialAddress, profile as Profile, graph as Graph);
    } catch (error) {
      if (error.code === 4001) {
        // EIP 1193 userRejectedRequest error
        setAlertError("Please connect to MetaMask.");
        startLoading(false);
      } else {
        setAlertError("Unknown error with login.");
        // eslint-disable-next-line no-console
        console.error(error);
        startLoading(false);
      }
    }
  };

  return (
    <div className="Login">
      {alertError && (
        <Alert
          type="error"
          message={alertError}
          banner
          closable={true}
          onClose={() => setAlertError("")}
        />
      )}
      <header className="Login__header">
        <div className="Login__block">Welcome to</div>
        <h1 className="Login__h1">
          <img src={logo} alt="friendly logo" />
        </h1>
      </header>
      <Form className="Login__form">
        <Button
          className="Login__loginButton Login__btns"
          aria-label="Login"
          onClick={startTorusLogin}
        >
          Log In
          {loading && <Spin className="Login__spinner" size="small" />}
        </Button>
        <Button
          className="Login__signUpButton Login__btns"
          aria-label="Sign Up"
          onClick={startTorusLogin}
        >
          Sign Up
        </Button>
      </Form>
      <Layout.Footer className="Login__footer">
        Copyright 2020 Project Liberty
      </Layout.Footer>
    </div>
  );
};

export default Login;
