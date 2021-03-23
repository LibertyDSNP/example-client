import web3Torus from "./tweb3";

export const getAccount = async () => {
  return await web3Torus.torus.accounts;
  //web3Torus.web3.eth.getAccounts().then(accounts => {
  //  return accounts[accountIndex];
  //});
};

export const getBalance = (account) => {
  web3Torus.web3.eth.getBalance(account).then((balance) => {
    return balance;
  });
};

export const enableTorus = async (buildEnv) => {
  try {
    await web3Torus.initialize(buildEnv || "Testing");
  } catch (error) {
    console.error(error);
  }
};

export const changeProvider = async (provider) => {
  await web3Torus.torus.setProvider({ host: provider });
  console.log("finished changing provider");
};

export const getUserInfo = async () => {
  const userInfo = await web3Torus.torus.getUserInfo();
  return userInfo;
};

export const logout = () => {
  web3Torus.torus.cleanUp().then(() => {
    sessionStorage.setItem("pageUsingTorus", false);
  });
};

export const signMessage = (account) => {
  const message =
    "0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad";
  web3Torus.torus.web3.currentProvider.send(
    {
      method: "eth_sign",
      params: [account, message],
      from: account,
    },
    (err, result) => {
      if (err) {
        return console.error(err);
      }
      console.log("sign message => true \n", result);
    }
  );
};

export const signTypedDataV1 = (account) => {
  const typedData = [
    {
      type: "string",
      name: "message",
      value: "Hi, Alice!",
    },
    {
      type: "uint8",
      name: "value",
      value: 10,
    },
  ];
  web3Torus.torus.web3.currentProvider.send(
    {
      method: "eth_signTypedData",
      params: [typedData, account],
      from: account,
    },
    (err, result) => {
      if (err) {
        return console.error(err);
      }
      console.log("sign typed message v1 => true \n", result);
    }
  );
};

export const signTypedDataV3 = () => {
  const typedData = {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      Person: [
        { name: "name", type: "string" },
        { name: "wallet", type: "address" },
      ],
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person" },
        { name: "contents", type: "string" },
      ],
    },
    primaryType: "Mail",
    domain: {
      name: "Ether Mail",
      version: "1",
      chainId: 4,
      verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
    },
    message: {
      from: {
        name: "Cow",
        wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
      },
      to: {
        name: "Bob",
        wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
      },
      contents: "Hello, Bob!",
    },
  };
  web3Torus.torus.web3.currentProvider.send(
    {
      method: "eth_signTypedData_v3",
      params: [this.state.account, JSON.stringify(typedData)],
      from: this.state.account,
    },
    (err, result) => {
      if (err) {
        return console.error(err);
      }
      console.log("sign typed message v3 => true \n", result);
    }
  );
};

export const signTypedDataV4 = (account) => {
  const typedData = {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      Person: [
        { name: "name", type: "string" },
        { name: "wallets", type: "address[]" },
      ],
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person[]" },
        { name: "contents", type: "string" },
      ],
      Group: [
        { name: "name", type: "string" },
        { name: "members", type: "Person[]" },
      ],
    },
    domain: {
      name: "Ether Mail",
      version: "1",
      chainId: 4,
      verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
    },
    primaryType: "Mail",
    message: {
      from: {
        name: "Cow",
        wallets: [
          "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
          "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
        ],
      },
      to: [
        {
          name: "Bob",
          wallets: [
            "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
            "0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57",
            "0xB0B0b0b0b0b0B000000000000000000000000000",
          ],
        },
      ],
      contents: "Hello, Bob!",
    },
  };
  web3Torus.torus.web3.currentProvider.send(
    {
      method: "eth_signTypedData_v4",
      params: [account, JSON.stringify(typedData)],
      from: account,
    },
    (err, result) => {
      if (err) {
        return console.error(err);
      }
      console.log("sign typed message v4 => true \n", result);
    }
  );
};

export const sendEth = (account) => {
  web3Torus.web3.eth.sendTransaction({
    from: account,
    to: account,
    value: web3Torus.web3.utils.toWei("0.01"),
  });
};

export const createPaymentTx = () => {
  web3Torus.torus
    .initiateTopup("wyre", {
      selectedCurrency: "USD",
      fiatValue: "250",
      selectedCryptoCurrency: "ETH",
    })
    .catch((err) => console.log(err.message));
};

export const getPublicAddress = async (verifier, verifierId) => {
  return await web3Torus.torus.getPublicAddress({
    verifier,
    verifierId,
    isExtended: true,
  });
};

export const getWalletAddress = async () => {
  const { verifier, verifierId } = await getUserInfo();
  console.log("user info: ", await getUserInfo());
  console.log("verifier: ", verifier);
  console.log("verifierId: ", verifierId);
  console.log("public address: ", await getPublicAddress(verifier, verifierId));
  return (await getPublicAddress(verifier, verifierId)).address;
};
