import { Button, Popover, Spin } from "antd";
import * as wallet from "../services/wallets/wallet";
import React from "react";
import { userUpdateWalletType } from "../redux/slices/userSlice";
import { useAppDispatch } from "../redux/hooks";
import { upsertSessionWalletType } from "../services/session";

interface LoginModalProps {
  children: JSX.Element;
  popoverVisible: boolean;
  setPopoverVisible: any;
  loginWalletOptions: wallet.WalletType;
  loading: boolean;
  loginWithWalletType: (wallet: wallet.WalletType) => void;
}

const LoginModal = ({
  children,
  popoverVisible,
  setPopoverVisible,
  loginWalletOptions,
  loading,
  loginWithWalletType,
}: LoginModalProps): JSX.Element => {
  const handleVisibleChange = (visible: boolean) => {
    setPopoverVisible(visible);
  };

  const dispatch = useAppDispatch();

  const setWalletType = (wtype: wallet.WalletType) => {
    dispatch(userUpdateWalletType(wtype));
    upsertSessionWalletType(wtype);
    loginWithWalletType(wtype);
  };

  const HeaderLoginModal = (
    <Popover
      placement="bottomRight"
      trigger="click"
      visible={popoverVisible}
      onVisibleChange={handleVisibleChange}
      color={"black"}
      content={
        <div className="LoginModal__loginOptions">
          <div>Log in with</div>
          <button
            className="LoginModal__loginMetamask"
            onClick={() => setWalletType(wallet.WalletType.METAMASK)}
          >
            MetaMask
          </button>
          <div>OR</div>
          <button
            className="LoginModal__loginTorus"
            onClick={() => setWalletType(wallet.WalletType.TORUS)}
          >
            Torus
          </button>
        </div>
      }
    >
      {children}
    </Popover>
  );

  const QuickStartLoginModal = (
    <Button
      className="LoginModal__loginButton LoginModal__loginButton--quickStart"
      aria-label="Login"
      onClick={() => loginWithWalletType(loginWalletOptions)}
    >
      Log In With {loginWalletOptions}
      {loading && <Spin className="LoginModal__spinner" size="small" />}
    </Button>
  );

  return (
    <>
      {loginWalletOptions === wallet.WalletType.NONE
        ? HeaderLoginModal
        : QuickStartLoginModal}
    </>
  );
};
export default LoginModal;
