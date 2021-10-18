import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { latestBatchedMessage } from "../../utilities/sort";
import { GraphChange } from "../../utilities/types";

export enum RelationshipStatus {
  FOLLOWING,
  UNFOLLOWING,
  UPDATING,
}

export interface RelationshipState {
  status: RelationshipStatus;
  blockNumber: number;
  blockIndex: number;
  batchIndex: number;
}

export interface graphState {
  following: Record<string, Record<string, RelationshipState>>;
  followers: Record<string, Record<string, RelationshipState>>;
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
      const { follower, followee, unfollow } = action.payload;

      const follows = state.following[follower] || {};
      const followers = state.followers[followee] || {};

      // new state is latest of new and existing changes
      const nextState = latestBatchedMessage(
        {
          status: unfollow
            ? RelationshipStatus.UNFOLLOWING
            : RelationshipStatus.FOLLOWING,
          blockNumber: action.payload.blockNumber,
          blockIndex: action.payload.blockIndex,
          batchIndex: action.payload.batchIndex,
        },
        follows[followee]
      );

      // short circuit if message is stale
      if (nextState === follows[followee]) return state;

      return {
        following: {
          ...state.following,
          [follower]: { ...follows, [followee]: nextState },
        },
        followers: {
          ...state.followers,
          [followee]: { ...followers, [follower]: nextState },
        },
      };
    },
    updateRelationshipStatus: (
      state,
      action: PayloadAction<RelationshipStatusUpdate>
    ) => {
      const { follower, followee, status } = action.payload;

      const follows = state.following[follower] || {};

      const oldState: RelationshipState = follows[follower] || {
        status: RelationshipStatus.UPDATING,
        blockNumber: -1,
        blockIndex: -1,
        batchNumber: -1,
      };
      const newState = { ...oldState, status };

      return {
        following: {
          ...state.following,
          [follower]: {
            ...(state.following[follower] || {}),
            [followee]: newState,
          },
        },
        followers: {
          ...state.followers,
          [followee]: {
            ...(state.followers[followee] || {}),
            [follower]: newState,
          },
        },
      };
    },
    clearGraph: (_state) => {
      return initialState;
    },
  },
});

export const {
  upsertGraph,
  updateRelationshipStatus,
  clearGraph,
} = graphSlice.actions;
export default graphSlice.reducer;
