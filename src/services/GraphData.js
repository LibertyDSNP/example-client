import { decrypt } from "@liberty30/lib-privacy-js/Encryption";
import { getGraph } from "./api";
import { getKeyById } from "../crypto/keyList";

let lastBlock = 0;

const processPrivateGraph = (socialAddress, keyList, privateGraph) => {
  if (!privateGraph[socialAddress] || !keyList) return [];
  return privateGraph[socialAddress].map((msg) => {
    try {
      const key = getKeyById(keyList, msg.k);
      if (!key) return null;
      const decryptedMsg = decrypt(key, msg);
      return JSON.parse(decryptedMsg);
    } catch (e) {
      console.error("Unable to decrypt or parse private graph entry", e);
      return null;
    }
  });
};

const graphChangeEventReplay = (set, [addr, type]) => {
  switch (type) {
    case 0:
      set.add(addr);
      break;
    case 1:
      set.delete(addr);
      break;
    default:
      break;
  }
  return set;
};

// NOTE: This assumes that private graph changes will NEVER be later changed by a public graph change
// This is not a requirement and we should replay based on block number and transaction index instead.
const getGraphFromServer = async (
  lastBlockNumber,
  socialAddress,
  privateGraphKeyList
) => {
  const response = await getGraph();
  const responseData = await response.json();
  if (responseData.lastBlock > lastBlockNumber) {
    const graph = {};
    Object.entries(responseData.graph).forEach(
      ([k, v]) =>
        (graph[k.toLowerCase()] = new Set(v.map((x) => x.toLowerCase())))
    );

    // There is a bug with the way graph reduce hiding private follows and unfollows
    if (privateGraphKeyList) {
      const privateGraph = processPrivateGraph(
        socialAddress,
        privateGraphKeyList,
        responseData.privateGraph
      ).filter((x) => x !== null);
      if (privateGraph) {
        graph[socialAddress] = privateGraph.reduce(
          graphChangeEventReplay,
          graph[socialAddress] || new Set()
        );
      }
    }
    return [graph, responseData.lastBlock];
  }
  return [];
};

const doGetGraph = (
  onGraphChange,
  socialAddress,
  privateGraphKeyList
) => async () => {
  const [g, blockNumber] = await getGraphFromServer(
    lastBlock,
    socialAddress,
    privateGraphKeyList
  );
  if (g && blockNumber) {
    onGraphChange(g);
    lastBlock = blockNumber;
  }
};

const GraphData = (onGraphChange, socialAddress, privateGraphKeyList) => {
  lastBlock = 0;
  const onInterval = doGetGraph(
    onGraphChange,
    socialAddress,
    privateGraphKeyList
  );
  onInterval();
  return setInterval(onInterval, 5000);
};

export const publicOnlyFilter = (item) => !item.inbox && !item.ddid;

export default GraphData;
