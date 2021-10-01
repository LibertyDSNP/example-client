import { QueryObserverResult } from "react-query";

export const mockQueryResult = <T>(data: T): QueryObserverResult<T, Error> => ({
  data,
  error: null,
  isError: false,
  isIdle: false,
  isLoading: false,
  isLoadingError: false,
  isRefetchError: false,
  isSuccess: true,
  status: "success",
  dataUpdatedAt: 0,
  errorUpdatedAt: 0,
  failureCount: 0,
  isFetched: true,
  isFetchedAfterMount: false,
  isFetching: false,
  isPlaceholderData: false,
  isPreviousData: false,
  isStale: false,
  refetch: (_options) => Promise.reject(),
  remove: () => undefined,
});
