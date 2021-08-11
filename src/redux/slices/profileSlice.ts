import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HexString, Profile } from "../../utilities/types";

interface profileState {
  profiles: Record<HexString, Profile>;
}

const initialState: profileState = {
  profiles: {},
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
      return { profiles: { ...state.profiles, [key]: newProfile } };
    },
    removeProfile: (state, action: PayloadAction<HexString>) => {
      const { [action.payload]: _, ...newProfiles } = state.profiles;
      return { profiles: newProfiles };
    },
  },
});
export const { upsertProfile, removeProfile } = profileSlice.actions;
export default profileSlice.reducer;
