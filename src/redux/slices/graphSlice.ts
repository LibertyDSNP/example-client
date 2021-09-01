import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GraphChange } from "../../utilities/types";

export enum RelationshipStatus {
  ESTABlISHED,
  UPDATING,
}

export interface graphState {
  following: Record<string, Record<string, RelationshipStatus>>;
  followers: Record<string, Record<string, RelationshipStatus>>;
}

export interface RelationshipStatusUpdate {
  follower: string;
  followee: string;
  status: RelationshipStatus;
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
              [followee]: RelationshipStatus.ESTABlISHED,
            },
          },
          followers: {
            ...state.followers,
            [followee]: {
              ...(state.followers[followee] || {}),
              [follower]: RelationshipStatus.ESTABlISHED,
            },
          },
        };
      }
    },
    updateRelationshipStatus: (
      state,
      action: PayloadAction<RelationshipStatusUpdate>
    ) => {
      const { follower, followee, status } = action.payload;
      return {
        following: {
          ...state.following,
          [follower]: {
            ...(state.following[follower] || {}),
            [followee]: status,
          },
        },
        followers: {
          ...state.followers,
          [followee]: {
            ...(state.followers[followee] || {}),
            [follower]: status,
          },
        },
      };
    },
  },
});
export const { upsertGraph, updateRelationshipStatus } = graphSlice.actions;
export default graphSlice.reducer;
