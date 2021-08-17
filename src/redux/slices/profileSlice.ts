import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HexString, Profile } from "../../utilities/types";

interface profileState {
  profiles: Record<HexString, Profile>;
}

const initialState: profileState = {
  profiles: {},
};

const latestProfile = (existing: Profile, current: Profile): Profile => {
  if (!existing || existing.blockNumber === undefined) return current;
  if (current.blockNumber !== existing.blockNumber) {
    return current.blockNumber > existing.blockNumber ? current : existing;
  } else if (current.blockIndex !== existing.blockIndex) {
    return current.blockIndex > existing.blockIndex ? current : existing;
  }
  return current.batchIndex > existing.batchIndex ? current : existing;
};

export const profileSlice = createSlice({
  name: "profiles",
  initialState,
  reducers: {
    upsertProfile: (state, action: PayloadAction<Profile>) => {
      const key = action.payload.fromId;
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
