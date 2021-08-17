import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GraphChange } from "../../utilities/types";

interface graphState {
  following: Record<DSNPUserId, Record<DSNPUserId, boolean>>;
  followers: Record<DSNPUserId, Record<DSNPUserId, boolean>>;
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
        const { [followee]: _a, ...newFollows } =
          state.following[follower] || {};
        const { [follower]: _b, ...newFollowed } =
          state.followers[followee] || {};
        return {
          following: { ...state.following, [follower]: newFollows },
          followers: { ...state.followers, [followee]: newFollowed },
        };
      } else {
        // follow
        return {
          following: {
            ...state.following,
            [follower]: {
              ...(state.following[follower] || {}),
              [followee]: true,
            },
          },
          followers: {
            ...state.followers,
            [followee]: {
              ...(state.followers[followee] || {}),
              [follower]: true,
            },
          },
        };
      }
    },
  },
});
export const { upsertGraph } = graphSlice.actions;
export default graphSlice.reducer;
