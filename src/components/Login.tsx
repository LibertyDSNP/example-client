import React from "react";
import { useHistory } from "react-router-dom";
import { Alert, Button, Spin } from "antd";
import * as sdk from "../services/sdk";
import * as torus from "../services/wallets/torus";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userLogin, userLogout } from "../redux/slices/userSlice";

const Login = (): JSX.Element => {
  const [loading, startLoading] = React.useState<boolean>(false);
  const [alertError, setAlertError] = React.useState<string>("");

  const history = useHistory();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);

  const torusLogin = async () => {
    if (loading) return;
    startLoading(true);
    try {
      await torus.enableTorus();
      const walletAddress = await torus.getWalletAddress();
      const socialAddress = await sdk.getSocialIdentity(walletAddress);
      const profile = await sdk.getProfile(socialAddress);
      const graph = await sdk.getGraph(socialAddress);
      dispatch(userLogin({ profile, graph }));
      history.push("/");
      startLoading(false);
    } catch (error) {
      setAlertError(error.toString());
    }
    startLoading(false);
  };

  const torusLogout = () => {
    dispatch(userLogout());
    if (torus.isInitialized()) {
      torus.logout();
    }
  };

  return (
    <div className="Login__block">
      {alertError && (
        <Alert
          className="Login__alert"
          type="error"
          message={alertError}
          banner
          closable={true}
          onClose={() => setAlertError("")}
        />
      )}
      {!profile ? (
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
