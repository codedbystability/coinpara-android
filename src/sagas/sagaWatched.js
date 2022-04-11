import React from "react";
import { call, put, takeEvery, delay, takeLatest } from "redux-saga/effects";
import { NOTIFICATION_CONSTANTS } from "../constants/notification-constants";
import { deleteNotification } from "../actions/notification-actions";
import { AUTHENTICATION_CONSTANTS } from "../constants/authentication-constants";
import { fetch } from "react-native/Libraries/Network/fetch";
import { disableInvalidToken, setUser, setValidUser } from "../actions/auth-actions";
import LocalStorage from "../providers/LocalStorage";
import BackgroundTimer from "react-native-background-timer";
import moment from "moment";
import { getDifferenceInSeconds } from "../helpers/math-helper";
import userServices from "../services/user-services";
import store from "../reducers/createReducers";

let timeoutId;

function* watchNotification(action) {
  yield delay(2000);
  try {
    yield put(deleteNotification(action.data));
  } catch (e) {
  }
}


const handleRefreshAction = (intervalCountInSecs) => {
  if (timeoutId) {
    BackgroundTimer.clearTimeout(timeoutId);
  }
  const timeOutProcess = intervalCountInSecs * 1000;

  if (timeOutProcess >= 180) {
    return;
  }
  timeoutId = BackgroundTimer.setTimeout(() => {
    const refreshToken = LocalStorage.getItem("refresh_token");
    if (refreshToken) {
      const instance = {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      };
      userServices.token(instance, false).then((response) => {
        if (response && response.Id) {
          store.dispatch(setUser(response));
        } else {
          LocalStorage.removeItem("token");
          LocalStorage.removeItem("refresh_token");
          store.dispatch(disableInvalidToken(null));
        }
      });
    }
  }, timeOutProcess);
};

function* watchUserToken(action) {

  const serviceDate = action.response[".expires"];
  const localFinishDate = moment.utc(serviceDate).unix();

  const nowDate = moment().format("YYYY-MM-DD HH:mm:ss");
  const intervalCountInSecs = getDifferenceInSeconds(moment(nowDate).unix(), localFinishDate) - 10;
  if (intervalCountInSecs >= 1) {
    handleRefreshAction(intervalCountInSecs);
  }

  const options = { method: "GET", header: {} };
  const response = yield call(fetch, "https://apiv2.coinpara.com/api/" + "user/get", addHeader(options, action.data));

  try {
    const responseJson = yield response.json();
    yield put(setValidUser(responseJson.Data));
  } catch (error) {
    yield put(disableInvalidToken());
    LocalStorage.removeItem("token");
  }
}

export function* sagaWatched() {
  yield takeLatest(NOTIFICATION_CONSTANTS.SET_NOTIFICATION, watchNotification);
  yield takeEvery(AUTHENTICATION_CONSTANTS.SET_USER_TOKEN, watchUserToken);
}


function addHeader(options = {}, token) {
  const newOptions = { ...options };
  if (!options.headers) {
    newOptions.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    };
  }

  if (token) {
    newOptions.headers.Authorization = `Bearer ${token}`;
  }

  return newOptions;
}
