import { Graph, HexString, Profile } from "../utilities/types";

interface SessionData {
  walletAddress: HexString | null;
  socialAddress: HexString | null;
  profile: Profile | null;
  graph: Graph | null;
}

export const clearSession = (): void => {
  sessionStorage.removeItem("session");
};

export const getSession = (): SessionData | null => {
  try {
    const sessionData = sessionStorage.getItem("session");
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (e) {
    return null;
  }
};

export const setSession = (newSession: SessionData): SessionData => {
  if (newSession.walletAddress) {
    newSession.walletAddress = newSession.walletAddress.toLowerCase();
  }
  if (newSession.socialAddress) {
    newSession.socialAddress = newSession.socialAddress.toLowerCase();
  }
  sessionStorage.setItem("session", JSON.stringify(newSession));
  return newSession;
};

export const updateSession = (profile: Profile | null): void => {
  const oldSession = getSession();
  if (oldSession === null) return;
  const newSession = {
    profile: null,
    ...oldSession,
  };
  let saveSession = false;
  if (profile) {
    newSession.profile = profile;
    saveSession = true;
  }

  if (saveSession) {
    sessionStorage.setItem("session", JSON.stringify(newSession));
  }
};

export const hasSession = (): boolean => !!sessionStorage.getItem("session");
