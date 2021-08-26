import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import { WalletType } from "./wallets/wallet";

interface SessionData {
  id: DSNPUserId | undefined;
  walletType: WalletType;
}

const saveSession = (sessionData: SessionData): SessionData => {
  sessionStorage.setItem("session", JSON.stringify(sessionData));
  return sessionData;
};

export const clearSession = (): void => {
  sessionStorage.removeItem("session");
};

export const loadSession = (): SessionData | null => {
  try {
    const sessionData = sessionStorage.getItem("session");
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (e) {
    return null;
  }
};

export const upsertSessionWalletType = (wtype: WalletType): void => {
  const curSession = loadSession() || {
    id: undefined,
    walletType: WalletType.NONE,
  };

  saveSession({ ...curSession, walletType: wtype });
};

export const upsertSessionUserId = (newId: DSNPUserId): void => {
  const curSession = loadSession() || {
    id: undefined,
    walletType: WalletType.NONE,
  };
  saveSession({ ...curSession, id: newId });
};

export const hasSession = (): boolean => !!sessionStorage.getItem("session");
