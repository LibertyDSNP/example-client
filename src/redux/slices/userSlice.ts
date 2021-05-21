import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as wallet from "../../services/wallets/wallet";
import * as session from "../../services/session";
import { Profile } from "../../utilities/types";

interface UserState {
  profile?: Profile;
  walletType: wallet.WalletType;
}

const initialState: UserState = {
  profile: session.hasSession() ? session.loadSession()?.profile : undefined,
  walletType: session.loadSession()?.walletType ?? wallet.WalletType.NONE,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<UserState>) => {
      state.profile = action.payload.profile;
      state.walletType = action.payload.walletType;
      return state;
    },
    userLogout: (state) => {
      state.profile = undefined;
      state.walletType = wallet.WalletType.NONE;
      return state;
    },
    userUpdateProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
      return state;
    },
  },
});
export const { userLogin, userLogout, userUpdateProfile } = userSlice.actions;
export default userSlice.reducer;
