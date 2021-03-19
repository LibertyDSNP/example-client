import React from "react";

const MetamaskInstructions = (): JSX.Element => {
  return (
    <>
      <h1>Prerequisite: Setup Metamask</h1>
      <p>
        Before we can access the browser we need to install MetaMask, a browser
        extension, to give us a cryptowallet. Download it from your chosen
        browser's extension manager. Chrome or Firefox are recommended. Pin
        MetaMask to your extension bar.
      </p>
      <ul>
        <li>
          <a
            href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download for Chrome
          </a>
        </li>
        <li>
          <a
            href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download for Firefox
          </a>
        </li>
      </ul>
      <p>Next, setup MetaMask by following these steps:</p>
      <ul>
        <li>Use an existing account. Do not create a new one.</li>
        <li>
          For account data use the following seed:{" "}
          <code>
            stove ankle number crucial clay heavy toilet entire bid betray
            cluster degree
          </code>
        </li>
        <li>
          Connect to a new Custom RLC.
          <ul>
            <li>Name:</li>
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
    </>
  );
};
export default MetamaskInstructions;
