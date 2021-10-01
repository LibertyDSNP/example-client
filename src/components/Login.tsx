import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userLogout, userUpdateId } from "../redux/slices/userSlice";
import * as dsnp from "../services/dsnp";
import * as wallet from "../services/wallets/wallet";
import * as session from "../services/session";
import LoginModal from "./LoginModal";
import UserAvatar from "./UserAvatar";
import EditRegistration from "./EditRegistration";
import { core } from "@dsnp/sdk";
import ethereum from "../services/wallets/metamask/ethereum";
import { HexString } from "../utilities/types";
import * as types from "../utilities/types";
import { ProfileQuery } from "../services/content";
import { Button, Popover, Spin } from "antd";
import { clearFeedItems } from "../redux/slices/feedSlice";
import { Registration } from "@dsnp/sdk/core/contracts/registry";

const Login = (): JSX.Element => {
  const [loading, startLoading] = React.useState<boolean>(false);
  const [loginPopoverVisible, setLoginPopoverVisible] = React.useState<boolean>(
    false
  );
  const [
    registrationPopoverVisible,
    setRegistrationPopoverVisible,
  ] = React.useState<boolean>(false);

  const [walletAddress, setWalletAddress] = React.useState<string>("");
  const [registrations, setRegistrations] = React.useState<Registration[]>([]);

  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.id);
  const currentWalletType = useAppSelector((state) => state.user.walletType);
  const profiles: Record<types.HexString, types.User> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const user: types.User | undefined = userId ? profiles[userId] : undefined;

  const { data: profile } = ProfileQuery(user);

  const setUserID = (fromURI: string) => {
    const fromId = core.identifiers.convertToDSNPUserId(fromURI);
    dispatch(userUpdateId(fromId.toString()));
    session.upsertSessionUserId(fromId);
    setRegistrationPopoverVisible(false);
  };

  useEffect(() => {
    if (currentWalletType && currentWalletType !== wallet.WalletType.NONE) {
      // Ensure wallet address is set for all components this component owns.
      const walletImpl = wallet.wallet(currentWalletType);
      (async () => setWalletAddress(await walletImpl.getAddress()))();
    } else {
      // close modals if something clears the wallet type (e.g. an error connecting to the provider)
      closeModals();
    }
  }, [currentWalletType]);

  const loginWithWalletAddress = async (
    waddr: HexString,
    selectedType: wallet.WalletType
  ) => {
    setWalletAddress(waddr);
    await dsnp.setupProvider(selectedType);
    const registrations = await dsnp.getSocialIdentities(waddr);
    setRegistrations(registrations);
    if (registrations.length === 1) {
      setUserID(registrations[0].dsnpUserURI);
    } else {
      setLoginPopoverVisible(false);
      setRegistrationPopoverVisible(true);
    }
  };

  const connectWallet = async (selectedType: wallet.WalletType) => {
    if (loading) return;
    startLoading(true);
    try {
      const waddr = await wallet.wallet(selectedType).login();
      await loginWithWalletAddress(waddr, selectedType);
    } catch (error: any) {
      console.warn("Login error", error);
      logout();
    }
  };

  const registrationCreated = (registration: Registration) => {
    setRegistrations([...registrations, registration]);
  };

  const logout = () => {
    closeModals();
    setWalletAddress("");
    if (!userId) return;
    session.clearSession();
    if (currentWalletType !== wallet.WalletType.NONE) {
      wallet.wallet(currentWalletType)?.logout();
    }
    dispatch(userLogout());
  };

  // Listen for wallet account changes
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

  ethereum?.removeAllListeners("chainChanged").on("chainChanged", () => {
    logout();
    dispatch(clearFeedItems());
  });

  const handleVisibleChange = (visible: boolean) => {
    setRegistrationPopoverVisible(visible);
    // Signal if user closes the modal.
    if (!userId && !visible) logout();
  };

  const closeModals = () => {
    startLoading(false);
    setRegistrationPopoverVisible(false);
    setLoginPopoverVisible(false);
  };

  return (
    <div className="Login__block">
      {!userId && !registrationPopoverVisible ? (
        <LoginModal
          popoverVisible={loginPopoverVisible}
          setPopoverVisible={setLoginPopoverVisible}
          loginWithWalletType={connectWallet}
        >
          <Button className="Login__loginButton" aria-label="Login">
            Connect Wallet
            {loading && <Spin className="Login__spinner" size="small" />}
          </Button>
        </LoginModal>
      ) : (
        <Popover
          placement="bottomRight"
          visible={registrationPopoverVisible}
          trigger="click"
          onVisibleChange={handleVisibleChange}
          content={
            <EditRegistration
              logout={logout}
              walletAddress={walletAddress}
              onIdResolved={setUserID}
              registrations={registrations}
              registrationCreated={registrationCreated}
            />
          }
        >
          <div className="Login__userBlock">
            <UserAvatar user={user} avatarSize="small" />
            <div className="Login__userTitle">
              {user?.handle ? "@" + user.handle : profile?.name || user?.fromId}
            </div>
          </div>
        </Popover>
      )}
    </div>
  );
};

export default Login;
