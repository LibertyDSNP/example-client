import { Button, Popover, Spin } from "antd";
import * as wallet from "../services/wallets/wallet";
import React from "react";

interface LoginButtonProps {
  popoverVisible: boolean;
  setPopoverVisible: any;
  loginWalletOptions: wallet.WalletType;
  loading: boolean;
  onButtonClick: (wallet: wallet.WalletType) => void;
}

const LoginButton = ({
  popoverVisible,
  setPopoverVisible,
  loginWalletOptions,
  loading,
  onButtonClick,
}: LoginButtonProps): JSX.Element => {
  const handleVisibleChange = (visible: boolean) => {
    setPopoverVisible(visible);
  };

  const HeaderLoginButton = (
    <Popover
      placement="bottomRight"
      trigger="click"
      visible={popoverVisible}
      onVisibleChange={handleVisibleChange}
      content={
        <div className="LoginButton__loginOptions">
          <Button
            className="LoginButton__loginTorus"
            onClick={() => onButtonClick(wallet.WalletType.TORUS)}
          >
            Torus
          </Button>
          <Button
            className="LoginButton__loginMetamask"
            onClick={() => onButtonClick(wallet.WalletType.METAMASK)}
          >
            MetaMask
          </Button>
        </div>
      }
    >
      <Button className="LoginButton__loginButton" aria-label="Login">
        Log In
        {loading && <Spin className="LoginButton__spinner" size="small" />}
      </Button>
    </Popover>
  );

  const QuickStartLoginButton = (
    <Button
      className="LoginButton__loginButton LoginButton__loginButton--quickStart"
      aria-label="Login"
      onClick={() => onButtonClick(loginWalletOptions)}
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
