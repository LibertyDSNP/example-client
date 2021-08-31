import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GraphChange } from "../../utilities/types";

interface graphState {
  following: Record<string, Record<string, boolean>>;
  followers: Record<string, Record<string, boolean>>;
}

const initialState: graphState = {
  following: {},
  followers: {},
};

export const graphSlice = createSlice({
  name: "graphs",
  initialState,
  reducers: {
    upsertGraph: (state, action: PayloadAction<GraphChange>) => {
      const { follower, followee } = action.payload;
      if (action.payload.unfollow) {
        // unfollow
        const { [followee.toString()]: _a, ...newFollows } =
          state.following[follower.toString()] || {};
        const { [follower.toString()]: _b, ...newFollowed } =
          state.followers[followee.toString()] || {};
        return {
          following: { ...state.following, [follower.toString()]: newFollows },
          followers: { ...state.followers, [followee.toString()]: newFollowed },
        };
      } else {
        // follow
        return {
          following: {
            ...state.following,
            [follower.toString()]: {
              ...(state.following[follower.toString()] || {}),
              [followee.toString()]: true,
            },
          },
          followers: {
            ...state.followers,
            [followee.toString()]: {
              ...(state.followers[followee.toString()] || {}),
              [follower.toString()]: true,
            },
          },
        };
      }
    },
  },
});
export const { upsertGraph } = graphSlice.actions;
export default graphSlice.reducer;
