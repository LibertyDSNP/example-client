import {
  Content,
  WriteStreamCallback,
  WriteStream,
  StoreInterface,
} from "@dsnp/sdk/core/store";
import { isFunction, isUint8Array } from "./utilities";
import { buildBaseUploadHostUrl } from "../utilities/buildBaseUploadHostUrl";

export class Store implements StoreInterface {
  put(targetPath: string, _content: Content): Promise<URL> {
    return Promise.resolve(
      new URL(`${buildBaseUploadHostUrl()}/${targetPath}`)
    );
  }

  async putStream(
    targetPath: string,
    doWriteToStream: WriteStreamCallback
  ): Promise<URL> {
    const ws = new ServerWriteStream(targetPath);
    await doWriteToStream(ws);
    return new URL(`${buildBaseUploadHostUrl()}/${targetPath}`);
  }
}

type WriteCallback = (error: Error | null | undefined) => void;
type EndCallback = () => void;

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

  end(...args: any): void {
    if (isUint8Array(args[0])) {
      this.chunks.push(args[0] as Uint8Array);
    }

    let cb: () => void;
    if (isFunction(args[0])) {
      cb = args[0] as EndCallback;
    } else if (isFunction(args[1])) {
      cb = args[1] as EndCallback;
    } else {
      cb = args[2] as EndCallback;
    }

    const fileLength = this.chunks.reduce((m, s) => m + s.length, 0);
    const file = new ArrayBuffer(fileLength);
    const bytes = new Uint8Array(file);
    for (let i = 0, offset = 0; i < this.chunks.length; i++) {
      bytes.set(this.chunks[i], offset);
      offset += this.chunks[i].length;
    }

    fetch(
      `${buildBaseUploadHostUrl()}/upload?filename=${encodeURIComponent(
        this.targetPath
      )}`,
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
