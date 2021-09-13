export interface BatchedMessage {
  // block containing last observed change to this relationship
  blockNumber: number;

  // index of log message in block contaiing batch
  blockIndex: number;

  // index of graph change within batch
  batchIndex: number;
}

export const latestBatchedMessageComparator = <T extends BatchedMessage>(
  a: T,
  b: T
): number => {
  if (!a || a.blockNumber === undefined) return 1;
  if (!b || b.blockNumber === undefined) return -1;
  if (b.blockNumber !== a.blockNumber)
    return b.blockNumber > a.blockNumber ? 1 : -1;
  if (b.blockIndex !== a.blockIndex)
    return b.blockIndex > a.blockIndex ? 1 : -1;
  if (b.batchIndex !== a.batchIndex)
    return b.batchIndex > a.batchIndex ? 1 : -1;
  return 0;
};

// choose latest profile comparing by blockNumber then blockIndex then batchIndex
export const latestBatchedMessage = <T extends BatchedMessage>(a: T, b: T): T =>
  latestBatchedMessageComparator(a, b) > 0 ? b : a;
