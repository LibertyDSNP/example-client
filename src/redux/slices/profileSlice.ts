import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HexString, Profile } from "../../utilities/types";

interface profileState {
  profiles: Record<string, Profile>;
}

const initialState: profileState = {
  profiles: {},
};

// choose latest profile comparing by blockNumber then blockIndex then batchIndex
const latestProfile = (a: Profile, b: Profile): Profile => {
  if (!a || a.blockNumber === undefined) return b;
  if (!b || b.blockNumber === undefined) return a;
  if (b.blockNumber !== a.blockNumber) {
    return b.blockNumber > a.blockNumber ? b : a;
  } else if (b.blockIndex !== a.blockIndex) {
    return b.blockIndex > a.blockIndex ? b : a;
  }
  return b.batchIndex > a.batchIndex ? b : a;
};

export const profileSlice = createSlice({
  name: "profiles",
  initialState,
  reducers: {
    upsertProfile: (state, action: PayloadAction<Partial<Profile>>) => {
      const key = action.payload.fromId?.toString();
      if (!key) return state;
      const oldProfile = state.profiles[key];
      const newProfile = oldProfile
        ? { ...oldProfile, ...action.payload }
        : action.payload;
      return {
        profiles: {
          ...state.profiles,
          [key]: latestProfile(oldProfile, newProfile),
        },
      };
    },
    removeProfile: (state, action: PayloadAction<HexString>) => {
      const { [action.payload]: _, ...newProfiles } = state.profiles;
      return { profiles: newProfiles };
    },
  },
});
export const { upsertProfile, removeProfile } = profileSlice.actions;
export default profileSlice.reducer;
