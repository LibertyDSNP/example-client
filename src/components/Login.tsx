import React from "react";
import { Alert, Button, Popover, Spin } from "antd";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userLogin, userLogout } from "../redux/slices/userSlice";
import * as sdk from "../services/sdk";
import * as wallet from "../services/wallets/wallet";
import * as session from "../services/session";

import { upsertGraph } from "../redux/slices/graphSlice";

const Login = (): JSX.Element => {
  const [loading, startLoading] = React.useState<boolean>(false);
  const [alertError, setAlertError] = React.useState<string>("");
  const [popoverVisible, setPopoverVisible] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const walletType = useAppSelector((state) => state.user.walletType);

  const login = async (walletType: wallet.WalletType) => {
    if (loading) return;
    startLoading(true);
    try {
      const walletAddress = await wallet.wallet(walletType).login();
      const socialAddress = await sdk.getSocialIdentity(walletAddress);
      const graph = await sdk.getGraph(socialAddress);
      const profile = await sdk.getProfile(socialAddress);
      dispatch(userLogin({ profile, walletType }));
      dispatch(upsertGraph(graph));
      session.saveSession({ profile, walletType });
      startLoading(false);
    } catch (error) {
      setAlertError(error.toString());
    }
    startLoading(false);
    setPopoverVisible(false);
  };

  const logout = () => {
    session.clearSession();
    if (walletType !== wallet.WalletType.NONE)
      wallet.wallet(walletType).logout();
    dispatch(userLogout());
  };

  const handleVisibleChange = (visible: boolean) => {
    setPopoverVisible(visible);
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
        <Popover
          placement="bottomRight"
          trigger="click"
          visible={popoverVisible}
          onVisibleChange={handleVisibleChange}
          content={
            <div className="Login__loginOptions">
              <Button
                className="Login__loginTorus"
                onClick={() => login(wallet.WalletType.TORUS)}
              >
                Torus
              </Button>
              <Button
                className="Login__loginMetamask"
                onClick={() => login(wallet.WalletType.METAMASK)}
              >
                MetaMask
              </Button>
            </div>
          }
        >
          <Button className="Login__loginButton" aria-label="Login">
            Log In
            {loading && <Spin className="Login__spinner" size="small" />}
          </Button>
        </Popover>
      ) : (
        <>
          {walletType && (
            <img
              className="Login__walletIcon"
              src={wallet.wallet(walletType).icon}
              alt="Wallet Symbol"
            ></img>
          )}
          <Button
            className="Login__logOutButton"
            aria-label="Logout"
            onClick={logout}
          >
            Log Out
          </Button>
        </>
      )}
    </div>
  );
};

export default Login;
