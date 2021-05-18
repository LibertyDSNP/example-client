import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import profileSlice from "./slices/profileSlice";
import graphSlice from "./slices/graphSlice";
import feedSlice from "./slices/feedSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    profiles: profileSlice,
    graphs: graphSlice,
    feed: feedSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
