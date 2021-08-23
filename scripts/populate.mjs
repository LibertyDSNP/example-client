import { setConfig, core, createRegistration, follow } from "@dsnp/sdk";
import { providers, Wallet } from "ethers";
import fetch from "node-fetch";
import web3 from "web3-utils";
import { createReadStream } from "fs";
import path from "path";

import dotenv from "dotenv";
dotenv.config();

const createImageAttachment = (url) => {
  return core.activityContent.createImageAttachment([
    core.activityContent.createImageLink(url, "image/jpg", [
      core.activityContent.createHash(url),
    ]),
  ]);
};

const createVideoAttachment = (url, type) => {
  return core.activityContent.createVideoAttachment([
    core.activityContent.createVideoLink(url, type, [
      core.activityContent.createHash(url),
    ]),
  ]);
};

const createAudioAttachment = (url, type) => {
  return core.activityContent.createAudioAttachment([
    core.activityContent.createAudioLink(url, type, [
      core.activityContent.createHash(url),
    ]),
  ]);
};

const accounts = [
  {
    address: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    handle: "NumberOneFan",
    pk: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    name: "Tanya Lee",
    text: "Good food = good mood",
    attachment: [
      createImageAttachment(
        "https://www.dietandi.com/wp-content/uploads/2011/11/Eating-Cereal.jpg"
      ),
    ],
    tag: [{ name: "#foodpics" }, { name: "#foodblogger" }],
    follows: [1, 2, 3, 4],
  },
  {
    address: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    handle: "tinydancer",
    pk: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    name: "Eva Rockett",
    text: "My snack beats your snack.",
    attachment: [
      createImageAttachment(
        "https://brooklynfarmgirl.com/wp-content/uploads/2015/06/Mexican-Taco-Salsa-Hot-Dog_12.jpg"
      ),
    ],
    tag: [
      { name: "#platepics" },
      { name: "#basic" },
      { name: "#wholesomemeal" },
    ],
    follows: [2, 3, 4, 5],
  },
  {
    address: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
    handle: "WasabiWomen",
    pk: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
    name: "Yuriko",
    attachment: [
      createImageAttachment(
        "https://bridgehunter.com/photos/13/65/136594-L.jpg"
      ),
    ],
    tag: [{ name: "#foodblogger" }],
    follows: [3, 4, 5, 6, 7],
  },
  {
    address: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
    handle: "lovestoeat",
    pk: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
    name: "Alice",
    text: "I just don’t want to look back and think “I could’ve eaten that.",
    attachment: [
      createImageAttachment(
        "http://1.bp.blogspot.com/-0Lz9Z4Cz0lE/T3-VN2wYleI/AAAAAAAADaI/3Ovse11FzoQ/s1600/cereal%2Brussian%2Bkrave.jpg"
      ),
    ],
    tag: [{ name: "#seafood" }, { name: "#sushi" }, { name: "#restaurant" }],
    follows: [4, 5, 6],
  },
  {
    address: "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
    handle: "Gthomas82",
    pk: "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
    name: "Greg Thomas",
    attachment: [
      createVideoAttachment("https://vimeo.com/27732793", "text/html"),
    ],
    tag: [{ name: "#foodblogger" }],
    follows: [5, 6, 7],
  },
  {
    address: "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc",
    handle: "nosoup4you",
    pk: "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
    name: "Amit",
    text:
      "I found this little hole in the wall – look at this deliciousness they served up.",
    tag: [
      { name: "#foodpics" },
      { name: "#foodblogger" },
      { name: "#rollsandrolls" },
    ],
    follows: [6, 7, 8, 0, 1],
  },
  {
    address: "0x976ea74026e726554db657fa54763abd0c3a0aa9",
    handle: "moremoremore",
    pk: "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e",
    name: "Rosie",
    attachment: [
      createVideoAttachment(
        "https://soundcloud.com/sistema-bomb/bemba-y-tablao-sistema-bomb",
        "text/html"
      ),
    ],
    text: "Surround yo-self with sushi, not negativity.",
    tag: [
      { name: "#sushipics" },
      { name: "#food" },
      { name: "#rollsandrolls" },
    ],
    follows: [7, 8, 9],
  },
  {
    address: "0x14dc79964da2c08b23698b3d3cc7ca32193d9955",
    handle: "neverenough",
    pk: "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356",
    name: "Bob",
    attachment: [
      createVideoAttachment(
        "https://www.youtube.com/watch?v=csQaDbFol28",
        "text/html"
      ),
      createImageAttachment(
        "https://live.staticflickr.com/2680/4461377833_becff3c191_k.jpg"
      ),
      createAudioAttachment(
        "https://www.freesoundslibrary.com/wp-content/uploads/2017/11/duck-quack.mp3",
        "audio/mpeg"
      ),
    ],
    text: "Good food is very often simple food.",
    tag: [
      { name: "#salmon" },
      { name: "#freshfish" },
      { name: "#rollsandrolls" },
    ],
    follows: [8, 0, 1, 2, 3],
  },
  {
    address: "0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f",
    handle: "lovestoeat",
    pk: "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97",
    name: "Alice",
    attachment: [
      createVideoAttachment(
        "https://filesamples.com/samples/video/mp4/sample_960x540.mp4",
        "video/mp4"
      ),
    ],
    text: "Fish and rice make everything nice.",
    tag: [
      { name: "#sushilovers" },
      { name: "#sushipics" },
      { name: "#foodblogger" },
      { name: "#restaurant" },
    ],
    follows: [0, 1, 2],
  },
];

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
  store: new Store(),
});

const dsnpIdToURI = (dsnpId) =>
  core.identifiers.convertBigNumberToDSNPUserURI(
    core.identifiers.convertDSNPUserIdOrURIToBigNumber(dsnpId)
  );

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

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const storeAvatar = async (handle) => {
  await fetch(
    `${process.env.REACT_APP_UPLOAD_HOST}/upload?filename=${handle + ".jpg"}`,
    {
      method: "POST",
      body: createReadStream(`${__dirname}/avatars/${handle}.jpg`),
    }
  );
  return core.activityContent.createImageLink(
    `${process.env.REACT_APP_UPLOAD_HOST}/${handle}.jpg`,
    "image/jpg",
    [core.activityContent.createHash("0x123")],
    { height: 72, width: 72 }
  );
};

/**
 * Populate all profiles and notes
 */
for await (let account of accounts.values()) {
  console.log("Setting up account", account.address);

  const provider = new providers.JsonRpcProvider(
    process.env.REACT_APP_CHAIN_HOST
  );

  const wallet = new Wallet(account.pk, provider);
  setConfig({
    signer: wallet,
    provider: provider,
  });

  // register handle to get dsnp id
  account.id = await createRegistration(account.address, account.handle);

  // store avatar
  const avatar = await storeAvatar(account.handle);
  console.log(avatar);

  // create profile
  const profile = core.activityContent.createProfile({
    name: account.name,
    icon: [avatar],
  });
  profile.published = Date.now.toString(16);

  // create a note
  const content = core.activityContent.createNote(`${account.text}`, {
    attachment: account.attachment,
    tag: account.tag,
    name: account.name,
  });
  content.published = new Date().toISOString();

  const {
    hash: profileHash,
    announcement: profileAnnouncement,
  } = await storeAnnouncement(profile, account.id, wallet);

  const {
    hash: contentHash,
    announcement: noteAnnouncement,
  } = await storeAnnouncement(content, account.id, wallet);

  const hash = web3.keccak256(profileHash + contentHash);

  const batchData = await core.batch.createFile(hash + ".parquet", [
    profileAnnouncement,
    noteAnnouncement,
  ]);

  const publication = {
    announcementType: core.announcements.AnnouncementType.Broadcast,
    fileUrl: batchData.url.toString(),
    fileHash: batchData.hash,
  };

  await core.contracts.publisher.publish([publication], { signer: wallet });
}

/**
 * Populate follows
 */
for await (let account of accounts.values()) {
  console.log("Setting up follows", account.address);

  const provider = new providers.JsonRpcProvider(
    process.env.REACT_APP_CHAIN_HOST
  );

  const wallet = new Wallet(account.pk, provider);
  setConfig({
    signer: wallet,
    provider: provider,
  });

  // create follow
  const follows = await Promise.all(
    account.follows.map((accountIndex) =>
      follow(dsnpIdToURI(accounts[accountIndex].id), {
        currentFromURI: dsnpIdToURI(account.id),
      })
    )
  );

  const hash = web3.keccak256(follows.reduce((m, f) => m + f.signature, ""));

  const batchData = await core.batch.createFile(hash + ".parquet", follows);

  const publication = {
    announcementType: core.announcements.AnnouncementType.GraphChange,
    fileUrl: batchData.url.toString(),
    fileHash: batchData.hash,
  };

  await core.contracts.publisher.publish([publication], { signer: wallet });
}

console.log("All accounts created.");
