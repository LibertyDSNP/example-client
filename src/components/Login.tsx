import React from "react";
import { useHistory } from "react-router-dom";
<<<<<<< HEAD
import { Alert, Button, Form, Layout, Spin } from "antd";
=======
<<<<<<< HEAD
<<<<<<< HEAD
import { Alert, Button, Spin } from "antd";
import * as sdk from "../services/sdk";
import { Graph, HexString, Profile } from "../utilities/types";
import * as torus from "../services/wallets/torus";
=======
import { Alert, Button, Form, Layout, Spin } from "antd";
=======
import { Alert, Button, Spin } from "antd";
>>>>>>> 5a295a2... simplify login button UI elements and classed
>>>>>>> begun wallet login process
import logo from "../images/friendly-logo-green.svg";
import { connect } from "../services/web3";
import * as api from "../services/api";
import { createSocialIdentity } from "../services/chain";
import { getSocialIdentityContract } from "../services/readChain";
import { Graph, HexString, Profile } from "../utilities/types";
<<<<<<< HEAD
import * as torus from "../services/torus/torus";
=======
<<<<<<< HEAD
import * as torus from "../services/torus/torus";
>>>>>>> 9f3606e... begun wallet login process
=======
import * as torus from "../services/wallets/torus";
>>>>>>> ced0d1f... More login progress
>>>>>>> begun wallet login process

interface LoginProps {
  onAuthenticate: (
    walletAddress: HexString,
    socialAddress: HexString,
    profile: Profile,
    graph: Graph
  ) => void;
  logout: () => void;
  socialAddress: HexString | null;
}

const Login = ({
  onAuthenticate,
  logout,
  socialAddress,
}: LoginProps): JSX.Element => {
  const [loading, startLoading] = React.useState<boolean>(false);
  const [alertError, setAlertError] = React.useState<string>("");

  const history = useHistory();

  const auth = async (
    walletAddress: HexString,
    socialAddress: HexString,
<<<<<<< HEAD
    profile?: Profile
  ) => {
=======
<<<<<<< HEAD
<<<<<<< HEAD
    profile: Profile,
    graph: Graph
  ) => {
=======
    profile?: Profile
  ) => {
>>>>>>> begun wallet login process
    const contract = await getSocialIdentityContract(socialAddress);

    contract.

<<<<<<< HEAD
=======
>>>>>>> 9f3606e... begun wallet login process
=======
    profile: Profile,
    graph: Graph
  ) => {
>>>>>>> ced0d1f... More login progress
>>>>>>> begun wallet login process
    await onAuthenticate(walletAddress, socialAddress, profile, graph);
    history.push("/");
  };

<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> begun wallet login process
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
<<<<<<< HEAD
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
=======
    if (loading) return;
    startLoading(true);
    try {
      const connAddr = await connect();
      const { address } = await (
        await api.getSocialIdentityFromOwner(connAddr)
      ).json();

>>>>>>> begun wallet login process
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

>>>>>>> 9f3606e... begun wallet login process
=======
>>>>>>> ced0d1f... More login progress
  const startTorusLogin = async () => {
=======
  const torusLogin = async () => {
>>>>>>> 1659e25... changes made from review
    if (loading) return;
    startLoading(true);
    try {
      await torus.enableTorus();
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> ced0d1f... More login progress
      const walletAddress = await torus.getWalletAddress();
      console.log("connAddr: ", walletAddress);
      const socialAddress = await sdk.getSocialIdentity(walletAddress);
      const profile = await sdk.getProfile(socialAddress);
      const graph = await sdk.getGraph(socialAddress);
      auth(walletAddress, socialAddress, profile as Profile, graph as Graph);
<<<<<<< HEAD
<<<<<<< HEAD
=======
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
>>>>>>> 9f3606e... begun wallet login process
=======
>>>>>>> ced0d1f... More login progress
=======
      startLoading(false);
<<<<<<< HEAD
>>>>>>> eff27b2... minor styling
=======
      setAlertError("");
>>>>>>> 1659e25... changes made from review
    } catch (error) {
      setAlertError("Unknown error with login.");
      console.error(error);
      startLoading(false);
    }
  };

  const torusLogout = () => {
    torus.logout();
    logout();
  };

  return (
<<<<<<< HEAD
    <div className="Login">
=======
<<<<<<< HEAD
<<<<<<< HEAD
    <div className="Login__block">
=======
    <div className="Login">
>>>>>>> 9f3606e... begun wallet login process
=======
    <div className="Login__block">
>>>>>>> 5a295a2... simplify login button UI elements and classed
>>>>>>> begun wallet login process
      {alertError && (
        <Alert
          className="Loin__alert"
          type="error"
          message={alertError}
          banner
          closable={true}
          onClose={() => setAlertError("")}
        />
      )}
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
      {!socialAddress ? (
>>>>>>> eff27b2... minor styling
        <Button
          className="Login__loginButton"
          aria-label="Login"
<<<<<<< HEAD
          onClick={startTorusLogin}
<<<<<<< HEAD
=======
>>>>>>> begun wallet login process
      <header className="Login__header">
        <div className="Login__block">Welcome to</div>
        <h1 className="Login__h1">
          <img src={logo} alt="friendly logo" />
        </h1>
      </header>
      <Form className="Login__form">
<<<<<<< HEAD
=======
=======
>>>>>>> 5a295a2... simplify login button UI elements and classed
>>>>>>> begun wallet login process
        <Button
          className="Login__loginButton Login__btns"
          aria-label="Login"
<<<<<<< HEAD
          onClick={startLogin}
=======
<<<<<<< HEAD
          onClick={startLogin}
>>>>>>> 9f3606e... begun wallet login process
=======
          onClick={startTorusLogin}
>>>>>>> ced0d1f... More login progress
=======
>>>>>>> eff27b2... minor styling
=======
          onClick={torusLogin}
>>>>>>> 1659e25... changes made from review
>>>>>>> begun wallet login process
        >
          Log In
          {loading && <Spin className="Login__spinner" size="small" />}
        </Button>
<<<<<<< HEAD
        <Button
          className="Login__signUpButton Login__btns"
          aria-label="Sign Up"
          onClick={startLogin}
=======
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
        <Button
          className="Login__signUpButton Login__btns"
          aria-label="Sign Up"
          onClick={startTorusLogin}
>>>>>>> begun wallet login process
        >
          Sign Up
        </Button>
      </Form>
      <Layout.Footer className="Login__footer">
        Copyright 2020 Project Liberty
      </Layout.Footer>
<<<<<<< HEAD
=======
>>>>>>> 9f3606e... begun wallet login process
=======
>>>>>>> 5a295a2... simplify login button UI elements and classed
=======
      <Button
        className="Login__loginButton"
        aria-label="Login"
        onClick={startTorusLogin}
      >
        Log In
        {loading && <Spin className="Login__spinner" size="small" />}
      </Button>
>>>>>>> 3abd998... major wip
=======
      ) : (
        <Button
          className="Login__logOutButton"
          aria-label="Login"
          onClick={torusLogout}
        >
          Log Out
        </Button>
      )}
>>>>>>> eff27b2... minor styling
>>>>>>> begun wallet login process
    </div>
  );
};

export default Login;
