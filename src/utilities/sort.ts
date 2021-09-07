export interface BatchedMessage {
  // block containing last observed change to this relationship
  blockNumber: number;

  // index of log message in block contaiing batch
  blockIndex: number;

  // index of graph change within batch
  batchIndex: number;
}

// choose latest profile comparing by blockNumber then blockIndex then batchIndex
export const latestBatchedMessage = <T extends BatchedMessage>(
  a: T,
  b: T
): T => {
  if (!a || a.blockNumber === undefined) return b;
  if (!b || b.blockNumber === undefined) return a;
  if (b.blockNumber !== a.blockNumber) {
    return b.blockNumber > a.blockNumber ? b : a;
  } else if (b.blockIndex !== a.blockIndex) {
    return b.blockIndex > a.blockIndex ? b : a;
  }
  return b.batchIndex > a.batchIndex ? b : a;
};
