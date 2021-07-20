export const isFunction = (o: unknown): boolean => typeof o == "function";
export const isUint8Array = (o: unknown): boolean =>
  typeof o == "object" && (o as any).constructor === Uint8Array;
