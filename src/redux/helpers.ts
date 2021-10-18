import { userLogout } from "./slices/userSlice";
import { clearFeedItems } from "./slices/feedSlice";
import { clearProfiles } from "./slices/profileSlice";
import { clearGraph } from "./slices/graphSlice";
import { AppDispatch } from "./store";

export const reduxLogout = (dispatch: AppDispatch): void => {
  dispatch(userLogout());
  dispatch(clearFeedItems());
  dispatch(clearProfiles());
  dispatch(clearGraph());
};
