export const clearSession = () => {
  sessionStorage.removeItem("session");
};

export const getSession = () => {
  try {
    const sessionData = sessionStorage.getItem("session");
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (e) {
    return null;
  }
};

export const setSession = (newSession) => {
  if (newSession.walletAddress) {
    newSession.walletAddress = newSession.walletAddress.toLowerCase();
  }
  if (newSession.socialAddress) {
    newSession.socialAddress = newSession.socialAddress.toLowerCase();
  }
  sessionStorage.setItem("session", JSON.stringify(newSession));
  return newSession;
};

export const updateSession = (
  profile,
  privateGraphKeyList,
  encryptedKeyList
) => {
  const oldSession = getSession();
  if (oldSession === null) return;
  const newSession = {
    profile: null,
    privateGraphKeyList: null,
    encryptedKeyList: null,
    ...oldSession,
  };
  let saveSession = false;
  if (profile) {
    newSession.profile = profile;
    saveSession = true;
  }
  if (privateGraphKeyList || privateGraphKeyList === []) {
    newSession.privateGraphKeyList = privateGraphKeyList;
    saveSession = true;
  }
  if (encryptedKeyList || encryptedKeyList === []) {
    newSession.encryptedKeyList = encryptedKeyList;
    saveSession = true;
  }
  if (saveSession) {
    sessionStorage.setItem("session", JSON.stringify(newSession));
  }
};

export const hasSession = () => !!sessionStorage.getItem("session");
