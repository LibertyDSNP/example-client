import React, { useState, useEffect } from "react";
import * as wallet from "../services/wallets/wallet";
import { Button } from "antd";
import { useAppSelector } from "../redux/hooks";
import ConnectionsList from "./ConnectionsList";
import UserAvatar from "./UserAvatar";
import { Profile } from "../utilities/types";
import { Tabs } from "antd";
import { isInstalled } from "../services/wallets/metamask/metamask";
import Login from "./Login";

const ProfileBlock = (): JSX.Element => {
  const profile: Profile | undefined = useAppSelector(
    (state) => state.user.profile
  );
  const socialAddress = profile?.socialAddress;

  const handle = "insert_handle_here";
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string | null>(null);
  const [newHandle, setNewHandle] = useState<string | null>(null);
  const [didEditProfile, setDidEditProfile] = useState<boolean>(false);

  const profileName = profile?.name || "Anonymous";

  useEffect(() => {
    if (
      (newName && newName !== profileName) ||
      (newHandle && newHandle !== handle)
    ) {
      setDidEditProfile(true);
      return;
    }
    setDidEditProfile(false);
  }, [newName, newHandle, profileName]);

  const getClassName = (sectionName: string) => {
    return isEditing
      ? `ProfileBlock__${sectionName} ProfileBlock__editing`
      : `ProfileBlock__${sectionName}`;
  };

  const saveEditProfile = () => {
    //this is where we write to the blockchain
    setIsEditing(!isEditing);
  };

  const cancelEditProfile = () => {
    setIsEditing(!isEditing);
    setNewName(null);
    setNewHandle(null);
  };

  return (
    <div className="ProfileBlock__block">
      {socialAddress ? (
        <>
          <div className="ProfileBlock__personalInfoBlock">
            <div className="ProfileBlock__avatarBlock">
              <UserAvatar
                profileAddress={profile?.socialAddress}
                avatarSize="large"
              />
              {isEditing ? (
                <>
                  <Button
                    className="ProfileBlock__editButton"
                    onClick={() => saveEditProfile()}
                    disabled={!didEditProfile}
                  >
                    save
                  </Button>
                  <Button
                    className="ProfileBlock__editButton"
                    onClick={() => cancelEditProfile()}
                  >
                    cancel
                  </Button>
                </>
              ) : (
                <Button
                  className="ProfileBlock__editButton"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  edit
                </Button>
              )}
            </div>
            <div className="ProfileBlock__personalInfo">
              <label className="ProfileBlock__personalInfoLabel">NAME</label>
              <input
                className={getClassName("name")}
                value={newName || newName === "" ? newName : profileName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={!isEditing}
              />
              <label className="ProfileBlock__personalInfoLabel">HANDLE</label>
              <input
                className={getClassName("handle")}
                value={newHandle || newHandle === "" ? newHandle : handle}
                onChange={(e) => setNewHandle(e.target.value)}
                disabled={!isEditing}
              />
              <label className="ProfileBlock__personalInfoLabel">
                SOCIAL ADDRESS
              </label>
              <input
                className={getClassName("socialAddress")}
                value={socialAddress || "Anonymous"}
                disabled={true}
              />
            </div>
          </div>
          <ConnectionsList />
        </>
      ) : (
        <>
          <div className="ProfileBlock__loginHeaderText">
            {" "}
            Login Quick Start
          </div>
          <p>
            To use the Example Client, you must log in with either MetaMask or
            Torus. Read the guides below to get started!
          </p>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="MetaMask" key="1">
              <div className="ProfileBlock__loginTitleText">
                MetaMask Log In Guide
              </div>
              {isInstalled() ? (
                <>
                  <p>
                    You already have MetaMask installed! Just click the{" "}
                    <code>Log In &#8594; MetaMask</code> button.
                  </p>
                  <Login loginWalletOptions={wallet.WalletType.METAMASK} />
                </>
              ) : (
                <>
                  <p>
                    Before we can access the browser we need to install MetaMask
                    to give us a cryptowallet. MetaMask is a browser extension
                    Chrome or Firefox are recommended. Download them from your
                    chosen browsers extension manager. Pin MetaMask to your
                    extension bar.
                  </p>
                  <p>
                    Once{" "}
                    <a
                      href="https://metamask.io/download.html"
                      target="__blank"
                    >
                      installed correctly
                    </a>
                    , setup MetaMask by following these steps:
                  </p>
                  <ul>
                    <li>Use an existing account do not create a new one.</li>
                    <li>
                      For account data use the following seed:{" "}
                      <code>
                        stove ankle number crucial clay heavy toilet entire bid
                        betray cluster degree
                      </code>
                    </li>
                    <li>
                      Connect to a new Custom RLC.
                      <ul>
                        <li>Connect to a new Custom RLC.</li>
                        <li>
                          Name: <code>???</code>
                        </li>
                        <li>
                          New RPC URL: <code>http://localhost:7545</code>
                        </li>
                        <li>
                          ChainID: <code>1337</code>
                        </li>
                      </ul>
                    </li>
                    <li>Once setup, select/connect to that Custom RPC.</li>
                  </ul>
                  <Login loginWalletOptions={wallet.WalletType.METAMASK} />
                </>
              )}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Torus" key="2">
              <div className="ProfileBlock__loginTitleText">
                Torus Log In Guide
              </div>
              <p>
                There is no setup required for Torus. Just click the{" "}
                <code>Log In &#8594; Torus</code> button.
              </p>
              <Login loginWalletOptions={wallet.WalletType.TORUS} />
            </Tabs.TabPane>
          </Tabs>
        </>
      )}
    </div>
  );
};
export default ProfileBlock;
