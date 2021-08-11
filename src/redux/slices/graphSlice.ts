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
        (graph) => graph.dsnpUserId === newGraph.dsnpUserId
      );
      if (oldGraph) state.graphs.splice(state.graphs.indexOf(oldGraph), 1);
      state.graphs.push(newGraph);
      return state;
    },
    removeGraph: (state, action: PayloadAction<HexString>) => {
      const oldGraph = state.graphs.find(
        (graph) => graph.dsnpUserId === action.payload
      );
      if (oldGraph) state.graphs.splice(state.graphs.indexOf(oldGraph), 1);
      return state;
    },
    follow: (state, action: PayloadAction<AddressHolder>) => {
      const dsnpUserId = action.payload.userAddress;
      const followAddress = action.payload.targetAddress;
      state.graphs
        .find((graph) => graph.dsnpUserId === dsnpUserId)
        ?.following.push(followAddress);
      state.graphs
        .find((graph) => graph.dsnpUserId === followAddress)
        ?.followers.push(dsnpUserId);
      return state;
    },
    unfollow: (state, action: PayloadAction<AddressHolder>) => {
      const dsnpUserId = action.payload.userAddress;
      const unfollowAddress = action.payload.targetAddress;
      const following = state.graphs.find(
        (graph) => graph.dsnpUserId === dsnpUserId
      )?.following;
      const followers = state.graphs.find(
        (graph) => graph.dsnpUserId === unfollowAddress
      )?.followers;
      following?.splice(following.indexOf(unfollowAddress));
      followers?.splice(followers.indexOf(dsnpUserId));
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
