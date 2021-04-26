import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WalletType } from "../../services/wallets/wallet";
import { hasSession, loadSession } from "../../services/session";
import { Profile, Graph } from "../../utilities/types";

interface UserState {
  profile?: Profile;
  graph?: Graph;
  walletType?: WalletType;
}

const initialState: UserState = {
  profile: hasSession() ? loadSession()?.profile : undefined,
  graph: hasSession() ? loadSession()?.graph : undefined,
  walletType: hasSession() ? loadSession()?.walletType : undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<UserState>) => {
      state.profile = action.payload.profile;
      state.graph = action.payload.graph;
      state.walletType = action.payload.walletType;
      return state;
    },
    userLogout: (state) => {
      state.profile = hasSession() ? loadSession()?.profile : undefined;
      state.graph = hasSession() ? loadSession()?.graph : undefined;
      state.walletType = hasSession() ? loadSession()?.walletType : undefined;
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
