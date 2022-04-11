import { AUTHENTICATION_CONSTANTS } from "../constants/authentication-constants";
import LocalStorage from "../providers/LocalStorage";
import moment from "moment";

export function setUser(data) {
  LocalStorage.setItem("token", data.access_token);
  LocalStorage.setItem("refresh_token", data.refresh_token);
  LocalStorage.setItem("guid", data.guid);
  const expireDate = data[".expires"];
  const expireTS = moment.utc(expireDate).unix();
  LocalStorage.setItem("expireDate", expireTS.toString());

  return {
    type: AUTHENTICATION_CONSTANTS.SET_USER_TOKEN,
    data: data.access_token,
    response: data,
  };
}


export function setNonUser() {
  return {
    type: AUTHENTICATION_CONSTANTS.SET_NON_USER,
  };
}


export function setLoggedUserWithLocalToken(data) {
  return {
    type: AUTHENTICATION_CONSTANTS.SET_USER_TOKEN,
    data,
  };
}


export function disableInvalidToken(data) {
  return {
    type: AUTHENTICATION_CONSTANTS.DISABLE_INVALID_TOKEN,
    data: data,
  };
}


export function setValidUser(data) {
  return {
    type: AUTHENTICATION_CONSTANTS.SET_VALID_USER,
    data,
  };
}

export function updateUserField(data) {
  return {
    type: AUTHENTICATION_CONSTANTS.UPDATE_USER_FIELD,
    data,
  };
}


export function setUserVerifyType(data) {
  return {
    type: AUTHENTICATION_CONSTANTS.UPDATE_USER_VERIFY_TYPE,
    data,
  };
}

