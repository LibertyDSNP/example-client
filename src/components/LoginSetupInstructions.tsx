import React from "react";

const LoginSetupInstructions = (): JSX.Element => {
  return (
    <>
      <div className="ProfileBlock__loginHeaderText"> Login Quick Start</div>
      <p>To use the Example Client, you must connect with MetaMask</p>
      <div className="ProfileBlock__loginTitleText">
        MetaMask Connection Guide
      </div>
      <>
        <p>
          Before we can access the browser we need to install the MetaMask
          browser extension to give us a cryptowallet. Pin MetaMask to your
          extension bar.
        </p>
        <ul>
          <li>
            <a
              href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
              target="_blank"
              rel="noreferrer"
            >
              Download For Chrome
            </a>
          </li>
          <li>
            <a
              href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
              target="_blank"
              rel="noreferrer"
            >
              Download For Firefox
            </a>
          </li>
        </ul>
        <p>Setup MetaMask by following these steps.</p>

        <p>For local development:</p>
        <ul>
          <li>
            Clone{" "}
            <a
              href="https://github.com/LibertyDSNP/contracts"
              target="_blank"
              rel="noreferrer"
            >
              the contracts repository
            </a>{" "}
            and follow the instructions to build and launch the local Hardhat
            node and deploy the contracts.
          </li>
          <li>
            In Metamask, import Secret Recovery Phrase:{" "}
            <code>
              test test test test test test test test test test test junk
            </code>{" "}
            and click <code>Restore</code>.
          </li>
          <li>
            Click on the Networks dropdown in the top right corner and select{" "}
            <code>Localhost 8545</code>.
          </li>
          <li>
            Go to Settings &#8594; Networks, then change the Chain ID of
            Localhost 8545 to <code>31337</code>.
          </li>
        </ul>

        <p>For Rinkeby:</p>
        <ul>
          <li>
            Click <code>Create Account</code> and set an account name.
          </li>
          <li>
            Click on the Networks dropdown in the top right corner and select{" "}
            <code>Rinkeby Test Network</code>.
          </li>
          <li>
            If it displays <code>Not Connected</code>, click on that and select{" "}
            <code>Connect</code> on your desired account.
          </li>
          <li>
            Use a faucet to transfer ETH to your account. We recommend{" "}
            <a
              href="http://rinkeby-faucet.com/"
              target="_blank"
              rel="noreferrer"
            >
              this one
            </a>
            .
          </li>
        </ul>

        <p>
          <b>
            You should now see ETH in your account and are ready to use the
            Example Client!
          </b>
        </p>
        <aside>
          Note: look to{" "}
          <a
            href="https://github.com/LibertyDSNP/example-client"
            target="_blank"
            rel="noreferrer"
          >
            the README
          </a>{" "}
          for more details.
        </aside>
      </>
    </>
  );
};

export default LoginSetupInstructions;
