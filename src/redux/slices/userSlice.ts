import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as wallet from "../../services/wallets/wallet";
import * as session from "../../services/session";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";

interface UserState {
  id?: DSNPUserId;
  walletType: wallet.WalletType;
  displayedProfileId?: DSNPUserId;
}

const initialState: UserState = {
  id: session.hasSession() ? session.loadSession()?.id : undefined,
  walletType: session.loadSession()?.walletType ?? wallet.WalletType.NONE,
  displayedProfileId: session.hasSession()
    ? session.loadSession()?.id
    : undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<UserState>) => ({
      ...state,
      ...action.payload,
    }),
    userLogout: (_state) => ({
      walletType: wallet.WalletType.NONE,
      displayedProfileId: undefined,
    }),
    userUpdateId: (state, action: PayloadAction<DSNPUserId>) => ({
      ...state,
      id: action.payload,
      displayedProfileId: action.payload,
    }),
    userUpdateWalletType: (
      state,
      action: PayloadAction<wallet.WalletType>
    ) => ({
      ...state,
      walletType: action.payload,
    }),
    setDisplayedProfileId: (state, action: PayloadAction<DSNPUserId>) => ({
      ...state,
      displayedProfileId: action.payload,
    }),
  },
});
export const {
  userLogin,
  userLogout,
  userUpdateId,
  userUpdateWalletType,
  setDisplayedProfileId,
} = userSlice.actions;
export default userSlice.reducer;
