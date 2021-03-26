import Web3 from "web3";
import fetch from "node-fetch";
import { AbiInput, AbiItem } from "web3-utils";
import { Log } from "web3-core";
import { CONTRACT_HOST } from "../utilities/secrets";

export interface ContractSchema {
  abi: AbiItem[];
  networks: {
    [key: string]: {
      address: string;
      events: {
        [key: string]: AbiItem;
      };
    };
  };
}

const web3Instance = new Web3();
// let isConnected = false;

const onConnectCalls: Array<(web3Instance: Web3) => Promise<void>> = [];
// export const onWeb3Connect = (call: (web3Instance: Web3) => Promise<void>) => {
//   if (isConnected) call(web3Instance);
//   onConnectCalls.push(call);
// };

let restartTimeout: any;
const restartProvider = (wsHost: string, timeout: number) => {
  if (restartTimeout) return;
  restartTimeout = setTimeout(() => {
    web3Instance.setProvider(getProvider(wsHost));
    restartTimeout = null;
  }, timeout);
};

const onEndError = (provider: any, wsHost: string) => () => {
  // isConnected = false;
  provider.reset();
  restartProvider(wsHost, 2000);
};

const getProvider = (wsHost: string) => {
  const provider = new Web3.providers.WebsocketProvider(wsHost);
  provider.on("connect", () => {
    // isConnected = true;
    onConnectCalls.map((x) => x(web3Instance));
    console.log("Web3 Connected");
  });

  provider.on("error", onEndError(provider, wsHost) as any);

  provider.on("end", onEndError(provider, wsHost) as any);

  return provider;
};

const fetchContractSchema = (jsonFile: string): Promise<ContractSchema> =>
  fetch(`${CONTRACT_HOST}/${jsonFile}`).then((x) => x.json());

const contractSchemas: { [key: string]: Promise<ContractSchema> } = {};
export const getContractSchema = async (
  jsonFile: string
): Promise<ContractSchema> => {
  if (contractSchemas[jsonFile]) return await contractSchemas[jsonFile];
  return (contractSchemas[jsonFile] = fetchContractSchema(jsonFile));
};

export const getContract = (abi: AbiItem[] | AbiItem, address: string): any => {
  return new web3Instance.eth.Contract(abi, address);
};

// export const getWeb3Instance = () => web3Instance;

export const decodeReturnValues = (inputs: AbiInput[], topic: string) => (
  log: Log
): any => {
  return web3Instance.eth.abi.decodeLog(inputs, log.data, [topic]);
};

// export const initializeWeb3 = (wsHost: string) => {
//   console.log(`Web3 Connecting to ${wsHost}...`);
//   web3Instance.setProvider(getProvider(wsHost));
// };
