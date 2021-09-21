import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as wallet from "../../services/wallets/wallet";
import * as session from "../../services/session";
import { Registration } from "@dsnp/sdk/core/contracts/registry";

interface UserState {
  id?: string;
  walletType: wallet.WalletType;
  displayId?: string;
  registrations?: Registration[];
  tempIconUri?: string;
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
    userUpdateId: (state, action: PayloadAction<string>) => ({
      ...state,
      id: action.payload,
      displayId: action.payload,
    }),
    userUpdateWalletType: (
      state,
      action: PayloadAction<wallet.WalletType>
    ) => ({
      ...state,
      walletType: action.payload,
    }),
    setDisplayId: (state, action: PayloadAction<string>) => ({
      ...state,
      displayId: action.payload,
    }),
    setRegistrations: (state, action: PayloadAction<Registration[]>) => ({
      ...state,
      registrations: action.payload,
    }),
    setTempIconUri: (state, action: PayloadAction<string | undefined>) => ({
      ...state,
      tempIconUri: action.payload,
    }),
  },
});
export const {
  userLogin,
  userLogout,
  userUpdateId,
  userUpdateWalletType,
  setDisplayId,
  setRegistrations,
  setTempIconUri,
} = userSlice.actions;
export default userSlice.reducer;
