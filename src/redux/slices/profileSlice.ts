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
      const key = action.payload.socialAddress;
      const oldProfile = state.profiles[key];
      const newProfile = oldProfile
        ? { ...oldProfile, ...action.payload }
        : action.payload;
      state.profiles = { ...state.profiles, [key]: newProfile };
      return state;
    },
    removeProfile: (state, action: PayloadAction<HexString>) => {
      delete state.profiles[action.payload];
      return state;
    },
  },
});
export const { upsertProfile, removeProfile } = profileSlice.actions;
export default profileSlice.reducer;
