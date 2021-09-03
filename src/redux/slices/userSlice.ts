import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as wallet from "../../services/wallets/wallet";
import * as session from "../../services/session";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";

interface UserState {
  id?: string;
  walletType: wallet.WalletType;
  displayId?: string;
}

const initialState: UserState = {
  id: session.hasSession() ? session.loadSession()?.id : undefined,
  displayId: session.hasSession() ? session.loadSession()?.id : undefined,
  walletType: session.loadSession()?.walletType ?? wallet.WalletType.NONE,
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
    }),
    userUpdateId: (state, action: PayloadAction<DSNPUserId>) => ({
      ...state,
      id: action.payload.toString(),
      displayId: action.payload.toString(),
    }),
    userUpdateWalletType: (
      state,
      action: PayloadAction<wallet.WalletType>
    ) => ({
      ...state,
      walletType: action.payload,
    }),
    setDisplayId: (state, action: PayloadAction<DSNPUserId>) => ({
      ...state,
      displayId: action.payload.toString(),
    }),
  },
});
export const {
  userLogin,
  userLogout,
  userUpdateId,
  userUpdateWalletType,
  setDisplayId,
} = userSlice.actions;
export default userSlice.reducer;
