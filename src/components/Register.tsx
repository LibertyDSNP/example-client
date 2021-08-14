import React from "react";
import { Button, Popover, Spin } from "antd";
import * as sdk from "../services/sdk";
import * as wallet from "../services/wallets/wallet";
import * as session from "../services/session";
import { userLogin } from "../redux/slices/userSlice";
import { upsertGraph } from "../redux/slices/graphSlice";
import { useAppSelector } from "../redux/hooks";

interface RegisterProps {
  walletOptions: wallet.walletType;
  loading: boolean;
  onButtonClick: (wallet: wallet.walletType) => void;
}

const Register = ({
  walletOptions,
  onButtonClick,
  loading,
}: RegisterProps): JSX.Element => {
  const [
    registrationPopoverVisible,
    setRegistrationPopoverVisible,
  ] = React.useState<boolean>(false);

  const userId = useAppSelector((state) => state.user.id);
  const walletType = useAppSelector((state) => state.user.walletType);

  const register = async () => {
    if (loading) return;
    // startLoading(true);
    try {
      const walletAddress = await wallet.wallet(walletType).login();
      sdk.setupProvider(walletType);
      const fromId = await sdk.getSocialIdentity(walletAddress);
      if (!fromId) {
        setRegistrationPopoverVisible(true);
      } else {
        return;
      }
    } catch (error) {
      console.log("Error in login:", error);
    } finally {
      setRegistrationPopoverVisible(false);
      // startLoading(false);
    }
  };

  const showAlert = () => {
    alert("You tried to register");
    setRegistrationPopoverVisible(false);
  };

  return (
    <Popover visible={registrationPopoverVisible} placement="bottomLeft">
      <div className="LoginButton__loginOptions">
        You need to register first.
      </div>
      <Button autoFocus={true} onClick={showAlert}>
        Register
      </Button>
    </Popover>
  );
};

export default Register;
