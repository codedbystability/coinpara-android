import React from "react";
import { getFetchInstance, postFetchInstance } from "./fetch-instance";

const ENDPOINT = "wallets/";

class WalletServices extends React.Component {

  get = () => {
    const scope = "get";

    return getFetchInstance("API_URL", ENDPOINT + scope);
  };

  getNetworks = (gd) => {
    const scope = "networks?guid=";

    return getFetchInstance("API_URL", ENDPOINT + scope + gd, false);
  };

  create = (instance) => {
    const scope = "create";

    return postFetchInstance("API_URL", ENDPOINT + scope, instance, false);
  };

  checkWalletAddress = (instance) => {
    const scope = "create";

    return postFetchInstance("API_URL", ENDPOINT + scope, instance, false);
  };


  check = (currency, walletAddress, networkType = null) => {
    return getFetchInstance("https://w-validator.coinpara.com/check?currency=" + currency + "&walletAddress=" + walletAddress + "&networkType=" + networkType, false, true, true);
  };
}

const walletServices = new WalletServices();
export default walletServices;
