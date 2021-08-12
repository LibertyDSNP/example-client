import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as wallet from "../../services/wallets/wallet";
import * as session from "../../services/session";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";

interface UserState {
  id?: DSNPUserId;
  walletType: wallet.WalletType;
}

const initialState: UserState = {
  id: "",
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
    userLogout: (state) => ({ ...state, walletType: wallet.WalletType.NONE }),
    userUpdateId: (state, action: PayloadAction<DSNPUserId>) => ({
      ...state,
      id: action.payload,
    }),
  },
});
export const { userLogin, userLogout, userUpdateId } = userSlice.actions;
export default userSlice.reducer;
