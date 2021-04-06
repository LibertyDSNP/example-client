import { createStore } from "redux";
import rootReducer from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import { HexString, Profile, Graph } from "../utilities/types";

const store = createStore(
  rootReducer,
  {
    profileReducer: { profiles: new Map<HexString, Profile>() },
    graphReducer: { graphs: new Map<HexString, Graph>() },
    feedReducer: { feed: [] },
  },
  composeWithDevTools()
);

export default store;
