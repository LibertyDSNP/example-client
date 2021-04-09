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
    login: (state, action: PayloadAction<userState>) => {
      const profile: Profile = action.payload.profile as Profile;
      const graph: Graph = action.payload.graph as Graph;
      state.profile = profile;
      state.graph = graph;
      return { ...state };
    },
    logout: (state) => {
      state.profile = null;
      state.graph = null;
      return { ...state };
    },
    updateProfile: (state, action: PayloadAction<Profile>) => {
      const profile: Profile = action.payload;
      state.profile = profile;
      return { ...state };
    },
    updateGraph: (state, action: PayloadAction<Graph>) => {
      const graph: Graph = action.payload;
      state.graph = graph;
      return { ...state };
    },
  },
});
export const { login, logout, updateProfile, updateGraph } = userSlice.actions;
export default userSlice.reducer;
