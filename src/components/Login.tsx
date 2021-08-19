import React from "react";
import { Alert, Badge, Button } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userLogin, userLogout } from "../redux/slices/userSlice";
import * as sdk from "../services/sdk";
import * as wallet from "../services/wallets/wallet";
import * as session from "../services/session";
import LoginButton from "./LoginButton";
import Register from "./Register";
import { Registration } from "@dsnp/sdk/core/contracts/registry";
import RegistrationModal from "./RegistrationModal";
import { core } from "@dsnp/sdk";

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
  const [registrations, setRegistrations] = React.useState<Registration[]>([]);

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
      const registrations = await sdk.getSocialIdentities(walletAddress);

      if (registrations.length === 1) {
        completeRegistration(registrations[0]);
      } else {
        dispatch(userLogin({ walletType: walletType }));
        setRegistrations(registrations);
        setRegistrationVisible(true);
      }
    } catch (error) {
      resetLoginAndSession(error);
    } finally {
      setPopoverVisible(false);
      startLoading(false);
    }
  };

  const completeRegistration = (registration: Registration) => {
    const fromId = core.identifiers.convertDSNPUserURIToDSNPUserId(
      registration.dsnpUserURI
    );
    dispatch(userLogin({ id: fromId, walletType }));
    session.saveSession({ id: fromId, walletType });
    setRegistrationVisible(false);
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
      <RegistrationModal
        visible={registrationVisible}
        registrations={registrations}
        onIdResolved={completeRegistration}
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
    </div>
  );
};

export default Login;
