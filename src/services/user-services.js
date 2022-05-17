import React from "react";
import { getFetchInstance, postFetchInstance } from "./fetch-instance";
import { serialize } from "../helpers/object-helper";
import axios from "axios";


const ENDPOINT = "user/";


class UserServices extends React.Component {

  sendOtp = (instance) => {
    const scope = "sendotp?";
    const queryParams = serialize(instance);

    return getFetchInstance("API_URL", ENDPOINT + scope + queryParams);
  };

  validateOtp = (otpId, userOtp) => {
    const scope = "validateotp";

    return getFetchInstance("API_URL", ENDPOINT + scope + "/" + otpId + "/" + userOtp);
  };

  register = (instance) => {
    const scope = "Register";

    return postFetchInstance("API_URL", ENDPOINT + scope, instance);
  };

  check = (instance) => {
    const scope = "check";

    return postFetchInstance("API_URL", ENDPOINT + scope, instance);
  };


  token = (instance, isToken = true) => {
    const scope = "token";
    return postFetchInstance("API_URL", scope, instance, true, isToken);
  };


  refreshToken = (instance) => {
    const scope = "token";
    return postFetchInstance("API_URL", scope, instance);
  };


  changeTimeExpiration(time) {
    const scope = "lockoutchange/" + time;

    return postFetchInstance("API_URL", ENDPOINT + scope, {});
  }

  getApproval() {
    const scope = "userApproval";

    return getFetchInstance("API_URL", scope, false);
  }

  changePassword(instance) {
    const scope = "changepass";

    return postFetchInstance("API_URL", ENDPOINT + scope, instance);
  }


  getNotifications() {
    const scope = "GetAllNotSeenUserNotifications";

    return getFetchInstance("API_URL", scope, false);
  }

  deleteNotification(instance) {
    const scope = "user/MakeNotificationSeen";

    return postFetchInstance("API_URL", scope, instance);
  }


  getAnnouncements(LangId) {
    const scope = `announcements/list?LangId=${LangId}&RowLimit=20`;

    return getFetchInstance("API_URL", scope, false);
  }


  getUserLogs(page) {
    const scope = "GetUserLogs/search?RowLimit=20&PageNumber=" + page;

    return getFetchInstance("API_URL", ENDPOINT + scope);
  }

  getUserLinks() {
    const scope = "user/affiliatecode/list";

    return getFetchInstance("API_URL", scope, false);
  }

  getCommissions() {
    const scope = "user/affiliatecommission/get";

    return getFetchInstance("API_URL", scope, false);
  }

  getFriendList() {
    const scope = "user/friendlist/get";

    return getFetchInstance("API_URL", scope, false);
  }

  createAffiliateCode(instance) {
    const scope = "user/affiliatecode/create";

    return postFetchInstance("API_URL", scope, instance);

  }

  checkForQr(guid) {
    const scope = "qrLogin/check?token=" + guid;

    return getFetchInstance("API_URL", scope);
  }

  //
  // getDummyQrId() {
  //   const scope = "GetQrLoginId";
  //
  //   return getFetchInstance(API_URL + scope);
  // }

  resetPassword(instance) {
    const scope = "mobile/reset";

    return postFetchInstance("API_URL", ENDPOINT + scope, instance);
  }


  validateReset(instance) {
    const scope = "mobile/validatereset";

    return postFetchInstance("API_URL", ENDPOINT + scope, instance);
  }

  setPassword(instance) {
    const scope = "mobile/submitpass";

    return postFetchInstance("API_URL", ENDPOINT + scope, instance);
  }

  activeGoogleAuth(code) {
    const scope = "ActiveGoogleAuth/";
    return getFetchInstance("API_URL", ENDPOINT + scope + code);
  }

  deActiveGoogleAuth(code) {
    const scope = "PassiveGoogleAuth/";
    return getFetchInstance("API_URL", ENDPOINT + scope + code);
  }


  getSettings() {
    const scope = "Settings";
    return getFetchInstance("API_URL", ENDPOINT + scope);
  }

  updateUser(instance) {
    const scope = "update";
    return postFetchInstance("API_URL", ENDPOINT + scope, instance);
  }


  setDeviceToken(instance) {
    axios.post("https://push.coinpara.com/api/devices/store", instance, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      timeout: 5000,
    })
      .then((response) => {
      }).catch(error => console.log("eeer - ", error));
    const scope = "devicetoken/set";
    return postFetchInstance("API_URL", ENDPOINT + scope, instance);
  }

  removeBankHistory(instance) {
    const scope = "transfers/removebankhistory";
    return postFetchInstance("API_URL", scope, instance);
  }




  ///api/GetQrLoginId
  ///api/qrLogin/check/${login}
  //https://apicore.bitbu.com/api/
}

const userServices = new UserServices();
export default userServices;
