import { Popover } from "antd";
import * as wallet from "../services/wallets/wallet";
import React from "react";
import { userUpdateWalletType } from "../redux/slices/userSlice";
import { useAppDispatch } from "../redux/hooks";
import { upsertSessionWalletType } from "../services/session";

interface LoginModalProps {
  children: JSX.Element;
  popoverVisible: boolean;
  setPopoverVisible: any;
  loginWithWalletType: (wallet: wallet.WalletType) => void;
}

const LoginModal = ({
  children,
  popoverVisible,
  setPopoverVisible,
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

  return (
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
};
export default LoginModal;
