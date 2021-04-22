import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WalletType } from "../../services/wallets/wallet";
import { hasSession, loadSession } from "../../services/session";
import { Profile } from "../../utilities/types";

interface UserState {
  profile?: Profile;
  wallet?: WalletType;
}

const initialState: UserState = {
  profile: hasSession() ? loadSession()?.profile : undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<UserState>) => {
      state.profile = action.payload.profile;
      state.wallet = action.payload.wallet;
      return state;
    },
    userLogout: (state) => {
      state.profile = hasSession() ? loadSession()?.profile : undefined;
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
