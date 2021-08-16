import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GraphChange } from "../../utilities/types";

interface graphState {
  follows: Record<DSNPUserId, Record<DSNPUserId, boolean>>;
  followed: Record<DSNPUserId, Record<DSNPUserId, boolean>>;
}

const initialState: graphState = {
  follows: {},
  followed: {},
};

export const graphSlice = createSlice({
  name: "graphs",
  initialState,
  reducers: {
    upsertGraph: (state, action: PayloadAction<GraphChange>) => {
      const { follower, followee } = action.payload;
      if (action.payload.unfollow) {
        // unfollow
        const { [followee]: _a, ...newFollows } = state.follows[follower] || {};
        const { [follower]: _b, ...newFollowed } =
          state.followed[followee] || {};
        return {
          follows: { ...state.follows, [follower]: newFollows },
          followed: { ...state.followed, [followee]: newFollowed },
        };
      } else {
        // follow
        return {
          follows: {
            ...state.follows,
            [follower]: {
              ...(state.follows[follower] || {}),
              [followee]: true,
            },
          },
          followed: {
            ...state.followed,
            [followee]: {
              ...(state.followed[followee] || {}),
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
