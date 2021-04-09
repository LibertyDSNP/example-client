import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Graph, Profile } from "../../utilities/types";

interface userState {
  profile: Profile | null;
  graph: Graph | null;
}

const initialState: userState = {
  profile: null,
  graph: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<userState>) => {
      const profile: Profile = action.payload.profile as Profile;
      const graph: Graph = action.payload.graph as Graph;
      state.profile = profile;
      state.graph = graph;
      return state;
    },
    userLogout: (state) => {
      state.profile = null;
      state.graph = null;
      return state;
    },
    userUpdateProfile: (state, action: PayloadAction<Profile>) => {
      const profile: Profile = action.payload;
      state.profile = profile;
      return state;
    },
    userUpdateGraph: (state, action: PayloadAction<Graph>) => {
      const graph: Graph = action.payload;
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
