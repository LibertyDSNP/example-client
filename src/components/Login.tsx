import React from "react";
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
import { HexString, Profile } from "../utilities/types";
import UserAvatar from "./UserAvatar";

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
  const profiles: Record<HexString, Profile> = useAppSelector(
    (state) => state.profiles.profiles
  );
  const profile: Profile | undefined = userId ? profiles[userId] : undefined;

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
      <RegistrationModal
        visible={registrationVisible}
        registrations={registrations}
        onIdResolved={setUserID}
        logout={logout}
        walletAddress={walletAddress}
      >
        <>
          {!userId ? (
            <LoginButton
              popoverVisible={popoverVisible}
              setPopoverVisible={setPopoverVisible}
              loginWalletOptions={loginWalletOptions}
              loading={loading}
              loginWithWalletType={login}
            />
          ) : (
            <div className="RegistrationHub__userBlock">
              <UserAvatar
                icon={profile?.icon?.[0]?.href}
                profileAddress={userId}
                avatarSize="small"
              />
              <div className="RegistrationHub__userTitle">
                {profile?.handle
                  ? "@" + profile.handle
                  : profile?.name || profile?.fromId}
              </div>
            </div>
          )}
        </>
      </RegistrationModal>
    </div>
  );
};

export default Login;
