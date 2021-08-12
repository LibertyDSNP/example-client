import React from "react";
import { Alert, Badge, Button } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userLogin, userLogout } from "../redux/slices/userSlice";
import * as sdk from "../services/sdk";
import * as wallet from "../services/wallets/wallet";
import * as session from "../services/session";
import { upsertGraph } from "../redux/slices/graphSlice";
import LoginButton from "./LoginButton";

interface LoginProps {
  loginWalletOptions: wallet.WalletType;
}

const Login = ({ loginWalletOptions }: LoginProps): JSX.Element => {
  const [loading, startLoading] = React.useState<boolean>(false);
  const [alertError, setAlertError] = React.useState<string>("");
  const [popoverVisible, setPopoverVisible] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.id);
  const walletType = useAppSelector((state) => state.user.walletType);

  const login = async (walletType: wallet.WalletType) => {
    if (loading) return;
    startLoading(true);
    try {
      const walletAddress = await wallet.wallet(walletType).login();
      const socialAddress = await sdk.getSocialIdentity(walletAddress);
      const graph = await sdk.getGraph(socialAddress);
      const profile = await sdk.getProfile(socialAddress);
      dispatch(userLogin({ id: "0x03ee", walletType }));
      dispatch(upsertGraph(graph));
      session.saveSession({ profile, walletType });
      sdk.setupProvider(walletType);
    } catch (error) {
      console.log("Error in login:", error);
      startLoading(false);
      setPopoverVisible(false);
    }
  };

  const logout = () => {
    session.clearSession();
    if (walletType !== wallet.WalletType.NONE)
      wallet.wallet(walletType).logout();
    dispatch(userLogout());
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
      {!userId ? (
        <LoginButton
          popoverVisible={popoverVisible}
          setPopoverVisible={setPopoverVisible}
          loginWalletOptions={loginWalletOptions}
          loading={loading}
          onButtonClick={login}
        />
      ) : (
        <>
          <Badge
            count={<WalletOutlined style={{ color: "#52C41A" }} />}
            offset={[-48, 8]}
          >
            <img
              className="Login__walletIcon"
              src={wallet.wallet(walletType).icon}
              alt="Wallet Symbol"
            />
          </Badge>

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
