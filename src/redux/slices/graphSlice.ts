import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HexString, Graph } from "../../utilities/types";

interface graphState {
  graphs: Map<HexString, Graph>;
}

const initialState: graphState = {
  graphs: new Map<HexString, Graph>(),
};

interface AddressHolder {
  userAddress: HexString;
  targetAddress: HexString;
}

export const graphSlice = createSlice({
  name: "graphs",
  initialState,
  reducers: {
    setGraph: (state, action: PayloadAction<Graph>) => {
      const newGraph = action.payload;
      state.graphs.set(newGraph.socialAddress, newGraph);
      return state;
    },
    removeGraph: (state, action: PayloadAction<HexString>) => {
      const socialAddress = action.payload;
      state.graphs.delete(socialAddress);
      return state;
    },
    follow: (state, action: PayloadAction<AddressHolder>) => {
      const socialAddress = action.payload.userAddress;
      const followAddress = action.payload.targetAddress;
      state.graphs.get(socialAddress)?.following.push(followAddress);
      state.graphs.get(followAddress)?.followers.push(socialAddress);
      return state;
    },
    unfollow: (state, action: PayloadAction<AddressHolder>) => {
      const socialAddress = action.payload.userAddress;
      const unfollowAddress = action.payload.targetAddress;
      const following = state.graphs.get(socialAddress)?.following;
      const followers = state.graphs.get(unfollowAddress)?.followers;
      following?.splice(following.indexOf(unfollowAddress));
      followers?.splice(followers.indexOf(socialAddress));
      return state;
    },
  },
});
export const { setGraph, removeGraph, follow, unfollow } = graphSlice.actions;
export default graphSlice.reducer;
