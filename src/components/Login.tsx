import React from "react";
import { Alert, Button, Popover, Spin } from "antd";
import * as sdk from "../services/sdk";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userLogin, userLogout } from "../redux/slices/userSlice";
import { wallet, WalletType } from "../services/wallets/wallet";
import { clearSession, saveSession } from "../services/session";
import { setGraph } from "../redux/slices/graphSlice";
import { Graph, Profile } from "../utilities/types";

const Login = (): JSX.Element => {
  const [loading, startLoading] = React.useState<boolean>(false);
  const [alertError, setAlertError] = React.useState<string>("");
  const [popoverVisible, setPopoverVisible] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const walletType = useAppSelector((state) => state.user.walletType);

  const login = async (walletType: WalletType) => {
    if (loading) return;
    startLoading(true);
    try {
      const walletAddress = await wallet(walletType).login();
      const socialAddress = await sdk.getSocialIdentity(walletAddress);
      const profile = (await sdk.getProfile(socialAddress)) as Profile;
      const graph = (await sdk.getGraph(socialAddress)) as Graph;
      dispatch(userLogin({ profile, walletType: walletType }));
      dispatch(setGraph(graph));
      saveSession({ profile, walletType: walletType });
      startLoading(false);
    } catch (error) {
      setAlertError(error.toString());
    }
    startLoading(false);
    setPopoverVisible(false);
  };

  const logout = () => {
    clearSession();
    if (walletType) wallet(walletType).logout();
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
                onClick={() => login(WalletType.TORUS)}
              >
                Torus
              </Button>
              <Button
                className="Login__loginMetamask"
                onClick={() => login(WalletType.METAMASK)}
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
          <img
            className="Login__walletIcon"
            src={wallet(walletType as WalletType).icon}
            alt="Paris"
          ></img>
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
