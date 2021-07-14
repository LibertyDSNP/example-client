const { setConfig, generators, core } = require("@dsnp/sdk");
const { PassThrough } = require("stream");
const { dsnp } = generators;
const { batch } = core;
const fetch = require("cross-fetch");

const app = require("../app");

const getRandomHex = (size) =>
[...Array(size)]
  .map(() => Math.floor(Math.random() * 16).toString(16))
  .join("");

class Storage {
  async putStream(targetPath, callback) {
    const readWriteStream = new PassThrough();

    callback(readWriteStream);

    await fetch(`http://localhost:3000/upload?filename=${targetPath}`, {
      method: "POST",
      body: readWriteStream,
    });

    return new URL(`http://localhost:3000/${targetPath}`);
  }
}

describe("/uploads", () => {
  beforeAll(() => {
    setConfig({
      store: new Storage(),
    });
  });

  it("stores a file to public directory", async () => {
    const messages = [{ ...dsnp.generateBroadcast(), signature: "0xfa1ce" }];
    const filename = `${getRandomHex(16)}.parquet`;
    const response = await batch.createFile(filename, messages);
    expect(response).toEqual(
      expect.objectContaining({
        url: expect.any(URL),
        hash: expect.any(String),
      })
    );
  });
});
