import { setConfig, core } from "@dsnp/sdk";
import { providers, Wallet } from "ethers";
import fetch from "node-fetch";
import web3 from "web3-utils";

import dotenv from "dotenv";
dotenv.config();

const accounts = [
  {
    address: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    id: "0x10001",
    pk: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    name: "Sid Rouse",
  },
  {
    address: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    id: "0x10002",
    pk: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    name: "Reese Armstrong",
  },
  {
    address: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
    id: "0x10003",
    pk: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
    name: "Son Egerton",
  },
  {
    address: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
    id: "0x10004",
    pk: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
    name: "Donnie Bartley",
  },
  {
    address: "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
    id: "0x10005",
    pk: "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
    name: "Louis Bollen",
  },
  {
    address: "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc",
    id: "0x10006",
    pk: "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
    name: "Anderson Penn",
  },
  {
    address: "0x976ea74026e726554db657fa54763abd0c3a0aa9",
    id: "0x10007",
    pk: "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e",
    name: "Clayton Pabst",
  },
  {
    address: "0x14dc79964da2c08b23698b3d3cc7ca32193d9955",
    id: "0x10008",
    pk: "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356",
    name: "Orie Howe",
  },
  {
    address: "0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f",
    id: "0x10009",
    pk: "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97",
    name: "Odell Pettitt",
  },
  {
    address: "0xa0ee7a142d267c1f36714e4a8f75612f20a79720",
    id: "0x1000a",
    pk: "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
    name: "Edison Gillis",
  },
  {
    address: "0xbcd4042de499d14e55001ccbb24a551f3b954096",
    id: "0x1000b",
    pk: "0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897",
    name: "Will Lawlor",
  },
  {
    address: "0x71be63f3384f5fb98995898a86b02fb2426c5788",
    id: "0x1000c",
    pk: "0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82",
    name: "Lillie Scenay",
  },
  {
    address: "0xfabb0ac9d68b0b445fb7357272ff202c5651694a",
    id: "0x1000d",
    pk: "0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1",
    name: "Wm Beley",
  },
  {
    address: "0x1cbd3b2770909d4e10f157cabc84c7264073c9ec",
    id: "0x1000e",
    pk: "0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd",
    name: "Juan Harrington",
  },
  {
    address: "0xdf3e18d64bc6a983f673ab319ccae4f1a57c7097",
    id: "0x1000f",
    pk: "0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa",
    name: "Axel Howlett",
  },
  {
    address: "0xcd3b766ccdd6ae721141f452c550ca635964ce71",
    id: "0x10010",
    pk: "0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61",
    name: "Jonathan Weakman",
  },
  {
    address: "0x2546bcd3c84621e976d8185a91a922ae77ecec30",
    id: "0x10011",
    pk: "0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0",
    name: "Percival Lite",
  },
  {
    address: "0xbda5747bfd65f08deb54cb465eb87d40e51b197e",
    id: "0x10012",
    pk: "0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd",
    name: "Isaiah Brownhill",
  },
  {
    address: "0xdd2fd4581271e230360230f9337d5c0430bf44c0",
    id: "0x10013",
    pk: "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0",
    name: "Howard Fergusson",
  },
  {
    address: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
    id: "0x10014",
    pk: "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e",
    name: "Alan Dart",
  },
];

const provider = new providers.JsonRpcProvider(
  process.env.REACT_APP_CHAIN_HOST
);

/**
 * Store implementation.
 */

class Store {
  put(targetPath) {
    return Promise.resolve(
      new URL(`${process.env.REACT_APP_UPLOAD_HOST}/${targetPath}`)
    );
  }

  async putStream(targetPath, doWriteToStream) {
    const ws = new ServerWriteStream(targetPath);
    await doWriteToStream(ws);
    return new URL(`${process.env.REACT_APP_UPLOAD_HOST}/${targetPath}`);
  }
}

const isFunction = (o) => typeof o == "function";
const isUint8Array = (o) =>
  typeof o == "object" && o.constructor === Uint8Array;

class ServerWriteStream {
  chunks = [];
  targetPath;

  constructor(path) {
    this.targetPath = path;
  }

  write(chunk, param1, param2) {
    const cb = typeof param1 == "string" ? param2 : param1;

    this.chunks.push(chunk);

    if (cb) cb(null);
    return true;
  }

  end(...args) {
    if (isUint8Array(args[0])) {
      this.chunks.push(args[0]);
    }

    let cb;
    if (isFunction(args[0])) {
      cb = args[0];
    } else if (isFunction(args[1])) {
      cb = args[1];
    } else {
      cb = args[2];
    }

    const fileLength = this.chunks.reduce((m, s) => m + s.length, 0);
    const file = new ArrayBuffer(fileLength);
    const bytes = new Uint8Array(file);
    for (let i = 0, offset = 0; i < this.chunks.length; i++) {
      bytes.set(this.chunks[i], offset);
      offset += this.chunks[i].length;
    }

    fetch(
      `${
        process.env.REACT_APP_UPLOAD_HOST
      }/upload?filename=${encodeURIComponent(this.targetPath)}`,
      {
        method: "POST",
        mode: "cors",
        body: file,
      }
    ).then((res) => {
      if (res.status !== 201) {
        throw Error(`failed to post stream: ${res.status} ${res.statusText}`);
      }
      if (cb) cb();
    });
  }
}

/**
 * Populate chain and storage server
 */

setConfig({
  provider: provider,
  store: new Store(),
});

const storeAnnouncement = async (content, accountId, signer) => {
  const hash = web3.keccak256(core.activityContent.serialize(content));

  // store note content
  await fetch(
    `${process.env.REACT_APP_UPLOAD_HOST}/upload?filename=${encodeURIComponent(
      hash + ".json"
    )}`,
    {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(content),
    }
  );

  // create and store announcement of content to batch
  const announcement = core.announcements.sign(
    core.announcements.createBroadcast(
      accountId,
      `${process.env.REACT_APP_UPLOAD_HOST}/${hash}.json`,
      hash
    ),
    { signer: signer }
  );

  return { hash, announcement };
};

Promise.all(
  accounts.map(async (account) => {
    console.log("Setting up account", account.address);

    const wallet = new Wallet(account.pk, provider);

    // create profile
    const profile = core.activityContent.createProfile(account.name);
    const {
      hash: profileHash,
      announcement: profileAnnouncement,
    } = await storeAnnouncement(profile, account.id, wallet);

    // create a note
    const content = core.activityContent.createNote(`Hello from ${account.id}`, true);
    content.published = Date.now.toString()
    const {
      hash: contentHash,
      announcement: noteAnnouncement,
    } = await storeAnnouncement(content, account.id, wallet);

    const hash = web3.keccak256(profileHash + contentHash);

    const batchData = await core.batch.createFile(hash + ".parquet", [
      profileAnnouncement,
      noteAnnouncement,
    ]);

    // publish batch to chain
    const publication = {
      announcementType: core.announcements.AnnouncementType.Broadcast,
      fileUrl: batchData.url.toString(),
      fileHash: batchData.hash,
    };

    setConfig({ signer: wallet });
    await core.contracts.publisher.publish([publication], { signer: wallet });
  })
).then(() => console.log("All accounts created."));
