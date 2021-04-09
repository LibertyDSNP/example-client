import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HexString, Profile } from "../../utilities/types";

interface profileState {
  profiles: Map<HexString, Profile>;
}

const initialState: profileState = {
  profiles: new Map<HexString, Profile>(),
};

export const profileSlice = createSlice({
  name: "profiles",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      const newProfile: Profile = action.payload;
      state.profiles.set(newProfile.socialAddress, newProfile);
      return {
        ...state,
        profiles: new Map(state.profiles),
      };
    },
    removeProfile: (state, action: PayloadAction<HexString>) => {
      state.profiles.delete(action.payload);
      return {
        ...state,
        profiles: new Map(state.profiles),
      };
    },
  },
});
export const { setProfile, removeProfile } = profileSlice.actions;
export default profileSlice.reducer;
