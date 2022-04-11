/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { sagaWatched } from "../sagas/sagaWatched";

import authenticationReducer from "./authenticationReducer";
import themeReducer from "./themeReducer";
import languageReducer from "./languageReducer";
import appReducer from "./appReducer";
import marketReducer from "./marketReducer";
import notificationReducer from "./notificationReducer";
import orderHistoryReducer from "./orderHistoryReducer";
import walletReducer from "./walletReducer";
import transferReducer from "./transferReducer";
import globalReducer from "./globalReducer";

const sagaMiddleware = createSagaMiddleware();


const rootReducer = combineReducers({
  authenticationReducer,
  languageReducer,
  themeReducer,
  appReducer,
  marketReducer,
  orderHistoryReducer,
  notificationReducer,
  walletReducer,
  transferReducer,
  globalReducer,
});

const enhancers = [];
const windowIfDefined = typeof window === "undefined" ? null : window;
if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
  enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
}


const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware),
);

sagaMiddleware.run(sagaWatched);
export default store;
