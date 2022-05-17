import React from "react";
import { getFetchInstance, postFetchInstance } from "./fetch-instance";


const ENDPOINT = "transfers/";


class TransferServices extends React.Component {

  getUserTransfers(page) {
    const scope = "transactions/getusertransactions/search?RowLimit=15&PageNumber=" + page + "&OrderBy=TimeStamp";

    return getFetchInstance("API_URL", scope);
  }

  addFavorite = (instance) => {
    const scope = "AddToFavorite";

    return postFetchInstance("API_URL", ENDPOINT + scope, instance);
  };


  getBankList = () => {
    const scope = "banklist";

    return getFetchInstance("API_URL", ENDPOINT + scope);
  };


  getBankNames = () => {
    const scope = "banknames";

    return getFetchInstance("API_URL", ENDPOINT + scope);
  };


  cryptoWithdraw = (instance) => {
    const scope = "coin/withdraw";

    return postFetchInstance("API_URL", ENDPOINT + scope, instance);
  };

  cryptoDeposit = (instance) => {
    const scope = "crypto/deposit";

    return postFetchInstance("API_URL", ENDPOINT + scope, instance);
  };

  currencyDeposit = (instance) => {
    const scope = "currency/deposit";

    return postFetchInstance("API_URL", ENDPOINT + scope, instance);
  };

  currencyWithdraw = (instance) => {
    const scope = "currency/withdraw";

    return postFetchInstance("API_URL", ENDPOINT + scope, instance);
  };


  cancelTransfer = (transferGuid) => {
    const scope = "transfer/cancel/";
    return getFetchInstance("API_URL", scope + transferGuid);
  };

  getUserBankHistory = () => {
    const scope = "bankhistory";

    return getFetchInstance("API_URL", ENDPOINT + scope, false);
  };


  getOtp = () => {
    const scope = "otpget";

    return getFetchInstance("API_URL", ENDPOINT + scope);
  };


  validateOtp = (instance) => {
    const scope = "otpvalidate";

    return postFetchInstance("API_URL", ENDPOINT + scope, instance);
  };


  search = (allUrl) => {
    return getFetchInstance(allUrl,'',true,true);
  };


}

const transferServices = new TransferServices();
export default transferServices;
