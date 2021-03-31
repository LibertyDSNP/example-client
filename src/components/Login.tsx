import React from "react";
import { useHistory } from "react-router-dom";
import { Alert, Button, Spin } from "antd";
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
  logout: () => void;
  socialAddress: HexString | null;
}

const Login = ({
  onAuthenticate,
  logout,
  socialAddress,
}: LoginProps): JSX.Element => {
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

  const torusLogin = async () => {
    if (loading) return;
    startLoading(true);
    try {
      await torus.enableTorus();
      const walletAddress = await torus.getWalletAddress();
      const socialAddress = await sdk.getSocialIdentity(walletAddress);
      const profile = await sdk.getProfile(socialAddress);
      const graph = await sdk.getGraph(socialAddress);
      auth(walletAddress, socialAddress, profile as Profile, graph as Graph);
      startLoading(false);
      setAlertError("");
    } catch (error) {
      setAlertError(error.toString());
      startLoading(false);
    }
  };

  const torusLogout = () => {
    logout();
    torus.logout();
  };

  return (
    <div className="Login__block">
      {alertError && (
        <Alert
          className="Loin__alert"
          type="error"
          message={alertError}
          banner
          closable={true}
          onClose={() => setAlertError("")}
        />
      )}
      {!socialAddress ? (
        <Button
          className="Login__loginButton"
          aria-label="Login"
          onClick={torusLogin}
        >
          Log In
          {loading && <Spin className="Login__spinner" size="small" />}
        </Button>
      ) : (
        <Button
          className="Login__logOutButton"
          aria-label="Logout"
          onClick={torusLogout}
        >
          Log Out
        </Button>
      )}
    </div>
  );
};

export default Login;
