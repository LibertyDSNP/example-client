import { EthereumProvider } from "./wallets/metamask/ethereum";

/**
 * Replace known errors with friendlier messages.
 * @param message text of received error.
 * @returns friendly error message if recognized, original message otherwise
 */
export const friendlyError = (
  error: Error | string,
  handle?: string
): string => {
  const message =
    typeof error == "string"
      ? error
      : (error as any).data?.message || error.message || error.toString();

  const ethereum = (window as any).ethereum as
    | EthereumProvider
    | null
    | undefined;

  if (message.match(/MissingContractAddressError/)) {
    return `You are trying to connect to a network that is not yet supported by DSNP.
            Change your network settings in your wallet to connect to a supported network.`;
  }

  if (message.match(/User denied transaction signature/)) {
    return "Transaction canceled.";
  }

  if (message.match(/Handle already exists/)) {
    const displayHandle = handle ? `@${handle}` : "That handle";
    return `${displayHandle} is not available. Please choose another.`;
  }

  return message;
};
