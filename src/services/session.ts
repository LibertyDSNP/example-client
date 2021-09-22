import { DSNPUserId } from "@dsnp/sdk/core/identifiers";
import { WalletType } from "./wallets/wallet";
import { Registration } from "@dsnp/sdk/core/contracts/registry";

interface SessionData {
  id: string | undefined;
  walletType: WalletType;
  registrations: Registration[] | undefined;
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
    registrations: undefined,
  };

  saveSession({ ...curSession, walletType: wtype });
};

export const upsertSessionUserId = (newId: DSNPUserId): void => {
  const curSession = loadSession() || {
    id: undefined,
    walletType: WalletType.NONE,
    registrations: undefined,
  };
  saveSession({ ...curSession, id: newId.toString() });
};

export const upsertSessionRegistrations = (
  registrations: Registration[]
): void => {
  const curSession = loadSession() || {
    id: undefined,
    walletType: WalletType.NONE,
    registrations: undefined,
  };
  saveSession({ ...curSession, registrations: registrations });
};

export const hasSession = (): boolean => !!sessionStorage.getItem("session");
