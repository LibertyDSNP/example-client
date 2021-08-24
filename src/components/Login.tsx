import React from "react";
import { Alert, Dropdown, Button } from "antd";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userLogin, userLogout } from "../redux/slices/userSlice";
import * as sdk from "../services/sdk";
import * as wallet from "../services/wallets/wallet";
import * as session from "../services/session";
import LoginButton from "./LoginButton";
import Register from "./Register";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import * as types from "../utilities/types";
import UserAvatar from "./UserAvatar";

interface LoginProps {
  loginWalletOptions: wallet.WalletType;
}

const Login = ({ loginWalletOptions }: LoginProps): JSX.Element => {
  const [loading, startLoading] = React.useState<boolean>(false);
  const [alertError, setAlertError] = React.useState<string>("");
  const [popoverVisible, setPopoverVisible] = React.useState<boolean>(false);
  const [registrationVisible, setRegistrationVisible] = React.useState<boolean>(
    false
  );

  const [walletAddress, setWalletAddress] = React.useState<string>("");
  const [walletType, setWalletType] = React.useState<wallet.WalletType>(
    loginWalletOptions || wallet.WalletType.NONE
  );

  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.id);

  const setLoginAndSession = (fromId: string) => {
    setRegistrationVisible(false);
    dispatch(userLogin({ id: fromId, walletType }));
    session.saveSession({ id: fromId, walletType });
  };

  const resetLoginAndSession = (e: Error) => {
    setRegistrationVisible(false);
    setAlertError(e.message);
    setWalletAddress("");
    setWalletType(wallet.WalletType.NONE);
    session.saveSession({ id: undefined, walletType });
  };

  const login = async (walletType: wallet.WalletType) => {
    if (loading) return;
    startLoading(true);
    setWalletType(walletType);
    try {
      const waddr = await wallet.wallet(walletType).login();
      sdk.setupProvider(walletType);
      const fromId = await sdk.getSocialIdentity(waddr);
      if (fromId) {
        setLoginAndSession(fromId);
      } else {
        setWalletAddress(waddr);
        setRegistrationVisible(true);
      }
    } catch (error) {
      resetLoginAndSession(error);
    } finally {
      setPopoverVisible(false);
      startLoading(false);
    }
  };

  const profiles: Record<DSNPUserId, types.Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const handle = userId && profiles[userId]?.handle;
  const profileName = (userId && profiles[userId]?.name) || userId;
  const avatar =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Hans_Ulrich_Obrist_2017.jpg/440px-Hans_Ulrich_Obrist_2017.jpg";

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
        <div>
          <LoginButton
            popoverVisible={popoverVisible}
            setPopoverVisible={setPopoverVisible}
            loginWalletOptions={loginWalletOptions}
            loading={loading}
            loginWithWalletType={login}
          />
          {registrationVisible && (
            <Register
              walletAddress={walletAddress}
              onSuccess={setLoginAndSession}
              onFailure={resetLoginAndSession}
            />
          )}
        </div>
      ) : (
        <>
          <Dropdown
            overlay={
              <>
                <Button
                  className="Login__logOutButton"
                  aria-label="Logout"
                  onClick={logout}
                >
                  Log Out
                </Button>
              </>
            }
            placement="bottomRight"
          >
            <Button className="Login__avatarButton">
              <UserAvatar
                avatarSize="medium"
                profileAddress={userId}
                avatarUrl={avatar}
              />
            </Button>
          </Dropdown>
          <div className="Login__profileInfo">
            <div className="Login__handle">@{handle}</div>
            <div className="Login__profileName">{profileName}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
