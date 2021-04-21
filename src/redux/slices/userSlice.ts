import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WalletType } from "../../services/wallets/wallet";
import { Graph, Profile } from "../../utilities/types";

interface UserState {
  profile?: Profile;
  graph?: Graph;
  wallet?: WalletType;
}

const initialState: UserState = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<UserState>) => {
      state.profile = action.payload.profile;
      state.graph = action.payload.graph;
      state.wallet = action.payload.wallet;
      return state;
    },
    userLogout: (state) => {
      state = initialState;
      return state;
    },
    userUpdateProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
      return state;
    },
    userUpdateGraph: (state, action: PayloadAction<Graph>) => {
      state.graph = action.payload;
      return state;
    },
  },
});
export const {
  userLogin,
  userLogout,
  userUpdateProfile,
  userUpdateGraph,
} = userSlice.actions;
export default userSlice.reducer;
