import React from "react";
import { Badge, Button } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userLogout, userUpdateId } from "../redux/slices/userSlice";
import * as sdk from "../services/sdk";
import * as wallet from "../services/wallets/wallet";
import * as session from "../services/session";
import LoginButton from "./LoginButton";
import { Registration } from "@dsnp/sdk/core/contracts/registry";
import RegistrationModal from "./RegistrationModal";
import { core } from "@dsnp/sdk";
import ethereum from "../services/wallets/metamask/ethereum";

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
  const [registrations, setRegistrations] = React.useState<Registration[]>([]);

  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.id);
  const currentWalletType = useAppSelector((state) => state.user.walletType);

  const setUserID = (fromURI: string) => {
    const fromId = core.identifiers.convertDSNPUserURIToDSNPUserId(fromURI);
    dispatch(userUpdateId(fromId));
    session.upsertSessionUserId(fromId);
    setRegistrationVisible(false);
  };

  const login = async (selectedType: wallet.WalletType) => {
    if (loading) return;
    startLoading(true);
    try {
      const waddr = await wallet.wallet(selectedType).login();
      setWalletAddress(waddr);
      sdk.setupProvider(selectedType);
      const registrations = await sdk.getSocialIdentities(waddr);
      if (registrations.length === 1) {
        setUserID(registrations[0].dsnpUserURI);
      } else {
        setRegistrations(registrations);
        setRegistrationVisible(true);
      }
    } catch (error) {
      logout();
    } finally {
      setPopoverVisible(false);
      startLoading(false);
    }
  };

  const logout = () => {
    session.clearSession();
    setRegistrationVisible(false);
    setWalletAddress("");
    if (currentWalletType !== wallet.WalletType.NONE) {
      wallet.wallet(currentWalletType).logout();
    }
    dispatch(userLogout());
  };

  ethereum?.on("accountsChanged", () => {
    logout();
  });

  return (
    <div className="Login__block">
      {!userId ? (
        <RegistrationModal
          visible={registrationVisible}
          registrations={registrations}
          onIdResolved={setUserID}
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
              src={wallet.wallet(currentWalletType).icon}
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
