import React from "react";
import { Badge, Button } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userLogin, userLogout } from "../redux/slices/userSlice";
import * as sdk from "../services/sdk";
import * as wallet from "../services/wallets/wallet";
import * as session from "../services/session";
import LoginButton from "./LoginButton";
import { Registration } from "@dsnp/sdk/core/contracts/registry";
import RegistrationModal from "./RegistrationModal";
import { core } from "@dsnp/sdk";

interface LoginProps {
  loginWalletOptions: wallet.WalletType;
}

const Login = ({ loginWalletOptions }: LoginProps): JSX.Element => {
  const [loading, startLoading] = React.useState<boolean>(false);
  const [popoverVisible, setPopoverVisible] = React.useState<boolean>(false);
  const [registrationVisible, setRegistrationVisible] = React.useState<boolean>(
    false
  );

  const [walletAddress, setWalletAddress] = React.useState<string>("");
  const [walletType, setWalletType] = React.useState<wallet.WalletType>(
    loginWalletOptions || wallet.WalletType.NONE
  );
  const [registrations, setRegistrations] = React.useState<Registration[]>([]);

  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.id);

  const setLoginAndSession = (fromURI: string) => {
    const fromId = core.identifiers.convertDSNPUserURIToDSNPUserId(fromURI);
    setRegistrationVisible(false);
    dispatch(userLogin({ id: fromId, walletType }));
    session.saveSession({ id: fromId, walletType });
  };

  const resetLoginAndSession = () => {
    setRegistrationVisible(false);
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
      console.log("Setup provider");
      sdk.setupProvider(walletType);
      const registrations = await sdk.getSocialIdentities(waddr);

      if (registrations.length === 1) {
        setLoginAndSession(registrations[0].dsnpUserURI);
      } else {
        dispatch(userLogin({ walletType: walletType }));
        setRegistrations(registrations);
        setRegistrationVisible(true);
      }
    } catch (error) {
      resetLoginAndSession();
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
      {!userId ? (
        <RegistrationModal
          visible={registrationVisible}
          registrations={registrations}
          onIdResolved={setLoginAndSession}
          walletAddress={walletAddress}
        >
          <LoginButton
            popoverVisible={popoverVisible}
            setPopoverVisible={setPopoverVisible}
            loginWalletOptions={loginWalletOptions}
            loading={loading}
            loginWithWalletType={login}
          />
        </RegistrationModal>
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
