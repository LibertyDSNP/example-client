import { noteToActivityPub } from "../utilities/activityPub";
import { FeedItem, HexString } from "../utilities/types";
import { ActivityPub } from "../utilities/activityPubTypes";
import {
  Content,
  WriteStreamCallback,
  WriteStream,
  StoreInterface,
} from "@dsnp/sdk/core/store";

export const createNote = async (
  actor: HexString,
  note: string,
  uriList: string[]
): Promise<FeedItem> => {
  // send content to api
  const activityPubNote: ActivityPub = noteToActivityPub(actor, note, uriList);
  const newPostFeedItem: FeedItem = {
    fromAddress: actor,
    content: activityPubNote,
    blockNumber: 0x123,
    timestamp: Math.floor(Math.random() * 999999),
  };
  return newPostFeedItem;
};

export class Store implements StoreInterface {
  put(targetPath: string, _content: Content): Promise<URL> {
    return Promise.resolve(
      new URL(`${process.env.REACT_APP_UPLOAD_HOST}/${targetPath}`)
    );
  }

  async putStream(
    targetPath: string,
    doWriteToStream: WriteStreamCallback
  ): Promise<URL> {
    const ws = new ServerWriteStream(targetPath);
    await doWriteToStream(ws);
    return new URL(`${process.env.REACT_APP_UPLOAD_HOST}/${targetPath}`);
  }
}

type WriteCallback = (error: Error | null | undefined) => void;
type EndCallback = () => void;

const isFunction = (o: any) => typeof o == "function";
const isUint8Array = (o: any) =>
  typeof o == "object" && o.constructor === Uint8Array;

/* eslint-disable no-dupe-class-members */
class ServerWriteStream implements WriteStream {
  chunks: Uint8Array[] = [];
  targetPath: string;

  constructor(path: string) {
    this.targetPath = path;
  }

  write(chunk: unknown, encoding?: string, callback?: WriteCallback): boolean;
  write(chunk: unknown, cb?: WriteCallback): boolean;

  write(
    chunk: unknown,
    param1?: string | WriteCallback,
    param2?: WriteCallback
  ): boolean {
    const cb = typeof param1 == "string" ? param2 : param1;

    this.chunks.push(chunk as Uint8Array);

    if (cb) cb(null);
    return true;
  }

  end(cb?: EndCallback): void;
  end(chunk: unknown, cb?: EndCallback): void;
  end(chunk: unknown, encoding?: string, cb?: EndCallback): void;

  end(
    param0?: unknown | EndCallback,
    param1?: string | EndCallback,
    param2?: EndCallback
  ): void {
    if (isUint8Array(param0)) {
      this.chunks.push(param0 as Uint8Array);
    }

    const cb = (isFunction(param0)
      ? param0
      : isFunction(param1)
      ? param1
      : param2) as () => void;

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
    ).then((res: Response) => {
      if (res.status !== 201) {
        throw Error(`failed to post stream: ${res.status} ${res.statusText}`);
      }
      if (cb) cb();
    });
  }
}
