import React from "react";
import { useHistory } from "react-router-dom";
import { Alert, Button, Form, Layout, Spin } from "antd";
import logo from "../images/friendly-logo-green.svg";
import { connect } from "../services/web3";
import * as api from "../services/api";
import { createSocialIdentity } from "../services/chain";
import { getSocialIdentityContract } from "../services/readChain";
import { Graph, HexString, Profile } from "../utilities/types";
import * as torus from "../services/torus/torus";

interface LoginProps {
  onAuthenticate: (
    walletAddress: HexString,
    socialAddress: HexString,
    profile: Profile,
    graph: Graph
  ) => void;
}

const Login = ({ onAuthenticate }: LoginProps): JSX.Element => {
  const [loading, startLoading] = React.useState<boolean>(false);
  const [alertError, setAlertError] = React.useState<string>("");

  const history = useHistory();

  const auth = async (
    walletAddress: HexString,
    socialAddress: HexString,
    profile?: Profile
  ) => {
    const contract = await getSocialIdentityContract(socialAddress);

    contract.

    await onAuthenticate(walletAddress, socialAddress, profile, graph);
    history.push("/");
  };

  const getProfile = async (siAddress: HexString): Promise<Profile | null> => {
    const friendlyProfileRequest = await api.getPersonFromSocialIdentity(
      siAddress
    );
    if ((friendlyProfileRequest as Response).status === 200) {
      return await (friendlyProfileRequest as Response).json();
    }
    return null;
  };

  const getGraph = async (siAddress: HexString): Promise<Graph | null> => {
    const friendlyProfileRequest = await api.getPersonFromSocialIdentity(
      siAddress
    );
    if ((friendlyProfileRequest as Response).status === 200) {
      return await (friendlyProfileRequest as Response).json();
    }
    return null;
  };

  const startMetaMaskLogin = async () => {
    if (loading) return;
    startLoading(true);
    try {
      const connAddr = await connect();
      const { address } = await (
        await api.getSocialIdentityFromOwner(connAddr)
      ).json();

      if (address) {
        const profile = await getProfile(address);
        auth(connAddr, address, profile);
      } else {
        const socAddress = await createSocialIdentity(connAddr);
        if (socAddress) {
          auth(connAddr, socAddress, null);
        } else {
          setAlertError(
            "Looks like the transaction is taking a while. Please try to login after the transaction is confirmed."
          );
          startLoading(false);
        }
      }
    } catch (error) {
      if (error.code === 4001) {
        // EIP 1193 userRejectedRequest error
        setAlertError("Please connect to MetaMask.");
        startLoading(false);
      } else {
        setAlertError("Unknown error with login.");
        console.error(error);
        startLoading(false);
      }
    }
  };

  const startTorusLogin = async () => {
    if (loading) return;
    startLoading(true);
    try {
      await torus.enableTorus();
      const connAddr = await torus.getWalletAddress();
      console.log("connAddr: ", connAddr);
      const { address } = await (
        await api.getSocialIdentityFromOwner(connAddr)
      ).json();
      if (address) {
        const profile = await getProfile(address);
        auth(connAddr, address, profile);
      } else {
        const socAddress = await createSocialIdentity(connAddr);
        if (socAddress) {
          auth(connAddr, socAddress, null);
        } else {
          setAlertError(
            "Looks like the transaction is taking a while. Please try to login after the transaction is confirmed."
          );
          startLoading(false);
        }
      }
    } catch (error) {
      if (error.code === 4001) {
        // EIP 1193 userRejectedRequest error
        setAlertError("Please connect to MetaMask.");
        startLoading(false);
      } else {
        setAlertError("Unknown error with login.");
        // eslint-disable-next-line no-console
        console.error(error);
        startLoading(false);
      }
    }
  };

  return (
    <div className="Login">
      {alertError && (
        <Alert
          type="error"
          message={alertError}
          banner
          closable={true}
          onClose={() => setAlertError("")}
        />
      )}
      <header className="Login__header">
        <div className="Login__block">Welcome to</div>
        <h1 className="Login__h1">
          <img src={logo} alt="friendly logo" />
        </h1>
      </header>
      <Form className="Login__form">
        <Button
          className="Login__loginButton Login__btns"
          aria-label="Login"
          onClick={startLogin}
        >
          Log In
          {loading && <Spin className="Login__spinner" size="small" />}
        </Button>
        <Button
          className="Login__signUpButton Login__btns"
          aria-label="Sign Up"
          onClick={startLogin}
        >
          Sign Up
        </Button>
      </Form>
      <Layout.Footer className="Login__footer">
        Copyright 2020 Project Liberty
      </Layout.Footer>
    </div>
  );
};

export default Login;
