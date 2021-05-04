import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HexString, Graph } from "../../utilities/types";

interface graphState {
  graphs: Graph[];
}

const initialState: graphState = {
  graphs: [],
};

interface AddressHolder {
  userAddress: HexString;
  targetAddress: HexString;
}

export const graphSlice = createSlice({
  name: "graphs",
  initialState,
  reducers: {
    upsertGraph: (state, action: PayloadAction<Graph>) => {
      const newGraph = action.payload;
      const oldGraph = state.graphs.find(
        (graph) => graph.socialAddress === newGraph.socialAddress
      );
      if (oldGraph) state.graphs.splice(state.graphs.indexOf(oldGraph), 1);
      state.graphs.push(newGraph);
      return state;
    },
    removeGraph: (state, action: PayloadAction<HexString>) => {
      const oldGraph = state.graphs.find(
        (graph) => graph.socialAddress === action.payload
      );
      if (oldGraph) state.graphs.splice(state.graphs.indexOf(oldGraph), 1);
      return state;
    },
    follow: (state, action: PayloadAction<AddressHolder>) => {
      const socialAddress = action.payload.userAddress;
      const followAddress = action.payload.targetAddress;
      state.graphs
        .find((graph) => graph.socialAddress === socialAddress)
        ?.following.push(followAddress);
      state.graphs
        .find((graph) => graph.socialAddress === followAddress)
        ?.followers.push(socialAddress);
      return state;
    },
    unfollow: (state, action: PayloadAction<AddressHolder>) => {
      const socialAddress = action.payload.userAddress;
      const unfollowAddress = action.payload.targetAddress;
      const following = state.graphs.find(
        (graph) => graph.socialAddress === socialAddress
      )?.following;
      const followers = state.graphs.find(
        (graph) => graph.socialAddress === unfollowAddress
      )?.followers;
      following?.splice(following.indexOf(unfollowAddress));
      followers?.splice(followers.indexOf(socialAddress));
      return state;
    },
  },
});
export const {
  upsertGraph,
  removeGraph,
  follow,
  unfollow,
} = graphSlice.actions;
export default graphSlice.reducer;
