import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Graph, Profile } from "../../utilities/types";

interface UserState {
  profile?: Profile;
  graph?: Graph;
}

const initialState: UserState = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<UserState>) => {
      const profile = action.payload.profile;
      const graph = action.payload.graph;
      state.profile = profile;
      state.graph = graph;
      return state;
    },
    userLogout: (state) => {
      state = initialState;
      return state;
    },
    userUpdateProfile: (state, action: PayloadAction<Profile>) => {
      const profile = action.payload;
      state.profile = profile;
      return state;
    },
    userUpdateGraph: (state, action: PayloadAction<Graph>) => {
      const graph = action.payload;
      state.graph = graph;
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
