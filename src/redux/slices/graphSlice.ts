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
      const newGraph: Graph = action.payload;
      state.graphs.set(newGraph.socialAddress, newGraph);
      return {
        ...state,
        graphs: new Map(state.graphs),
      };
    },
    removeGraph: (state, action: PayloadAction<HexString>) => {
      const socialAddress = action.payload;
      state.graphs.delete(socialAddress);
      return {
        ...state,
        graphs: new Map(state.graphs),
      };
    },
    follow: (state, action: PayloadAction<AddressHolder>) => {
      const socialAddress = action.payload.userAddress;
      const followAddress = action.payload.targetAddress;
      state.graphs.get(socialAddress)?.following.add(followAddress);
      state.graphs.get(followAddress)?.followers.add(socialAddress);
      return {
        ...state,
        graphs: new Map(state.graphs),
      };
    },
    unfollow: (state, action: PayloadAction<AddressHolder>) => {
      const socialAddress = action.payload.userAddress;
      const unfollowAddress = action.payload.targetAddress;
      state.graphs.get(socialAddress)?.following.delete(unfollowAddress);
      state.graphs.get(unfollowAddress)?.followers.delete(socialAddress);
      return {
        ...state,
        graphs: new Map(state.graphs),
      };
    },
  },
});
export const { setGraph, removeGraph, follow, unfollow } = graphSlice.actions;
export default graphSlice.reducer;
