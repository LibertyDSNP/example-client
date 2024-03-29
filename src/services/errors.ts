import { EthereumProvider } from "./wallets/metamask/ethereum";

/**
 * Replace known errors with friendlier messages.
 * @param message text of received error.
 * @returns friendly error message if recognized, original message otherwise
 */
export const friendlyError = (error: Error | string): string => {
  const message =
    typeof error == "string"
      ? error
      : (error as any).data?.message || error.message || error.toString();

  const ethereum = (window as any).ethereum as
    | EthereumProvider
    | null
    | undefined;

  const wallet = ethereum?.isMetaMask ? "MetaMask" : "Torus";
  if (message.match(/MissingContractAddressError/)) {
    return `You are trying to connect to a network that is not yet supported by DSNP.
            Change your network settings in ${wallet} to connect to a supported network.`;
  }

  if (message.match(/User denied transaction signature/)) {
    return "Transaction canceled.";
  }

  if (message.match(/Handle already exists/)) {
    return "This handle is taken. Please choose another.";
  }

  return message;
};
