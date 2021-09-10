import React from "react";
import { Badge, Button } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userLogout, userUpdateId } from "../redux/slices/userSlice";
import * as dsnp from "../services/dsnp";
import * as wallet from "../services/wallets/wallet";
import * as session from "../services/session";
import LoginButton from "./LoginButton";
import { Registration } from "@dsnp/sdk/core/contracts/registry";
import RegistrationModal from "./RegistrationModal";
import { core } from "@dsnp/sdk";
import ethereum from "../services/wallets/metamask/ethereum";
import { HexString } from "../utilities/types";
import RegistrationHub from "./RegistrationHub";

interface LoginProps {
  isPrimary: boolean;
  loginWalletOptions: wallet.WalletType;
}

const Login = ({ isPrimary, loginWalletOptions }: LoginProps): JSX.Element => {
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
    const fromId = core.identifiers.convertToDSNPUserId(fromURI);
    dispatch(userUpdateId(fromId.toString()));
    session.upsertSessionUserId(fromId);
    setRegistrationVisible(false);
  };

  const loginWithWalletAddress = async (
    waddr: HexString,
    selectedType: wallet.WalletType
  ) => {
    setWalletAddress(waddr);
    dsnp.setupProvider(selectedType);
    const registrations = await dsnp.getSocialIdentities(waddr);
    if (registrations.length === 1) {
      setUserID(registrations[0].dsnpUserURI);
    } else {
      setRegistrations(registrations);
      setRegistrationVisible(true);
    }
  };

  const login = async (selectedType: wallet.WalletType) => {
    if (loading) return;
    startLoading(true);
    try {
      const waddr = await wallet.wallet(selectedType).login();
      await loginWithWalletAddress(waddr, selectedType);
    } catch (error) {
      logout();
      setPopoverVisible(false);
      startLoading(false);
    }
  };

  const logout = () => {
    startLoading(false);
    setRegistrationVisible(false);
    setWalletAddress("");
    if (!userId) return;
    session.clearSession();
    if (currentWalletType !== wallet.WalletType.NONE) {
      wallet.wallet(currentWalletType)?.logout();
    }
    dispatch(userLogout());
  };

  // Listen for wallet account changes if this is the primary login button (there should only be one).
  if (isPrimary) {
    const handleAccountsChange = async (waddrs: HexString[]) => {
      logout();
      if (waddrs[0] && currentWalletType !== wallet.WalletType.NONE) {
        startLoading(true);
        await loginWithWalletAddress(waddrs[0], currentWalletType);
      }
    };

    ethereum
      ?.removeAllListeners("accountsChanged")
      .on("accountsChanged", handleAccountsChange);
  }

  return (
    <div className="Login__block">
      {!userId ? (
        <RegistrationModal
          visible={registrationVisible}
          registrations={registrations}
          onIdResolved={setUserID}
          onCancel={logout}
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
        <RegistrationHub logout={logout} />
      )}
    </div>
  );
};

export default Login;
