import { Button, Popover, Spin } from "antd";
import * as wallet from "../services/wallets/wallet";
import React from "react";
import { userUpdateWalletType } from "../redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { upsertSessionWalletType } from "../services/session";
import UserAvatar from "./UserAvatar";
import { HexString, Profile } from "../utilities/types";

interface LoginButtonProps {
  popoverVisible: boolean;
  setPopoverVisible: any;
  loginWalletOptions: wallet.WalletType;
  loading: boolean;
  loginWithWalletType: (wallet: wallet.WalletType) => void;
}

const LoginButton = ({
  popoverVisible,
  setPopoverVisible,
  loginWalletOptions,
  loading,
  loginWithWalletType,
}: LoginButtonProps): JSX.Element => {
  const userId = useAppSelector((state) => state.user.id);
  const currentWalletType = useAppSelector((state) => state.user.walletType);
  const profiles: Record<HexString, Profile> = useAppSelector(
    (state) => state.profiles.profiles
  );
  const profile: Profile | undefined = userId ? profiles[userId] : undefined;

  const handleVisibleChange = (visible: boolean) => {
    setPopoverVisible(visible);
  };

  const dispatch = useAppDispatch();

  const setWalletType = (wtype: wallet.WalletType) => {
    dispatch(userUpdateWalletType(wtype));
    upsertSessionWalletType(wtype);
    loginWithWalletType(wtype);
  };

  const HeaderLoginButton = (
    <Popover
      placement="bottomRight"
      trigger="click"
      visible={popoverVisible}
      onVisibleChange={handleVisibleChange}
      color={"black"}
      content={
        <div className="LoginButton__loginOptions">
          <div>Log in with</div>
          <button
            className="LoginButton__loginMetamask"
            onClick={() => setWalletType(wallet.WalletType.METAMASK)}
          >
            MetaMask
          </button>
          <div>OR</div>
          <button
            className="LoginButton__loginTorus"
            onClick={() => setWalletType(wallet.WalletType.TORUS)}
          >
            Torus
          </button>
        </div>
      }
    >
      {!userId ? (
        <Button className="LoginButton__loginButton" aria-label="Login">
          Log In
          {loading && <Spin className="LoginButton__spinner" size="small" />}
        </Button>
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
    </Popover>
  );

  const QuickStartLoginButton = (
    <Button
      className="LoginButton__loginButton LoginButton__loginButton--quickStart"
      aria-label="Login"
      onClick={() => loginWithWalletType(loginWalletOptions)}
    >
      Log In With {loginWalletOptions}
      {loading && <Spin className="LoginButton__spinner" size="small" />}
    </Button>
  );

  return (
    <>
      {loginWalletOptions === wallet.WalletType.NONE
        ? HeaderLoginButton
        : QuickStartLoginButton}
    </>
  );
};
export default LoginButton;
