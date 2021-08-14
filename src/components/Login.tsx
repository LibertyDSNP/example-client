import React from "react";
import { Alert, Badge, Button, Popover } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userLogin, userLogout } from "../redux/slices/userSlice";
import * as sdk from "../services/sdk";
import * as wallet from "../services/wallets/wallet";
import * as session from "../services/session";
import LoginButton from "./LoginButton";
import Register from "./Register";
//import { createRegistration } from "@dsnp/sdk";

interface LoginProps {
  loginWalletOptions: wallet.WalletType;
}

const Login = ({ loginWalletOptions }: LoginProps): JSX.Element => {
  const [loading, startLoading] = React.useState<boolean>(false);
  const [alertError, setAlertError] = React.useState<string>("");
  const [popoverVisible, setPopoverVisible] = React.useState<boolean>(false);
  const [
    registrationVisible,
    setRegistrationVisible,
  ] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.id);
  const walletType = useAppSelector((state) => state.user.walletType);

  const login = async (walletType: wallet.WalletType) => {
    if (loading) return;
    startLoading(true);
    try {
      const walletAddress = await wallet.wallet(walletType).login();
      sdk.setupProvider(walletType);
      const fromId = await sdk.getSocialIdentity(walletAddress);
      if (fromId) {
        dispatch(userLogin({ id: fromId, walletType }));
        session.saveSession({ id: fromId, walletType });
      } else {
        setRegistrationVisible(true);
      }
    } catch (error) {
      console.log("Error in login:", error);
    } finally {
      setPopoverVisible(false);
      startLoading(false);
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
      {!userId &&
        <Register
          loading
          walletOptions={loginWalletOptions}
          onButtonClick={() => setRegistrationVisible(false)}
        >
      }
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
        <div>
          <LoginButton
            popoverVisible={popoverVisible}
            setPopoverVisible={setPopoverVisible}
            loginWalletOptions={loginWalletOptions}
            loading={loading}
            onButtonClick={login}
          />
        </div>
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
