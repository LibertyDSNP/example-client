import React from "react";
import { Badge, Button, Dropdown } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userLogout, userUpdateId } from "../redux/slices/userSlice";
import { core } from "@dsnp/sdk";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import { Registration } from "@dsnp/sdk/core/contracts/registry";
import * as sdk from "../services/sdk";
import * as wallet from "../services/wallets/wallet";
import * as session from "../services/session";
import LoginButton from "./LoginButton";
import RegistrationModal from "./RegistrationModal";
import * as types from "../utilities/types";
import UserAvatar from "./UserAvatar";

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

  const profiles: Record<DSNPUserId, types.Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  const handle = userId && profiles[userId]?.handle;
  const profileName = (userId && profiles[userId]?.name) || userId;
  const avatar =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Hans_Ulrich_Obrist_2017.jpg/440px-Hans_Ulrich_Obrist_2017.jpg";

  const logout = () => {
    session.clearSession();
    setRegistrationVisible(false);
    setWalletAddress("");
    if (currentWalletType !== wallet.WalletType.NONE) {
      wallet.wallet(currentWalletType).logout();
    }
    dispatch(userLogout());
  };

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
          <Dropdown
            overlay={
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
            }
            placement="bottomRight"
          >
            <Button className="Login__avatarButton">
              <UserAvatar
                avatarSize="medium"
                profileAddress={userId}
                avatarUrl={avatar}
              />
            </Button>
          </Dropdown>
          <div className="Login__profileInfo">
            <div className="Login__handle">@{handle}</div>
            <div className="Login__profileName">{profileName}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
