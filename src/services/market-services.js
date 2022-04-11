import React from "react";
import { getFetchInstance, getFetchInstance3, postFetchInstance } from "./fetch-instance";

const ENDPOINT = "Market/";


class MarketServices extends React.Component {

  getCoins = (show) => {
    const scope = "market/getnames";

    return getFetchInstance("API_URL", scope, show);
  };


  getListCoins = (show) => {
    const scope = "coins/getAll?withCurrencies=true";

    return getFetchInstance("API_URL", scope, show);
  };


  marketDetail = (gd) => {
    const scope = "market/summary/detail?MarketGuid=";
    return getFetchInstance("API_URL", scope + gd, false);
  };


  addFavorite = (instance) => {
    const scope = "AddToFavorite";

    return postFetchInstance("API_URL", ENDPOINT + scope, instance, false);
  };


  removeFavorite = (instance) => {
    const scope = "RemoveFavorite";

    return postFetchInstance("API_URL", ENDPOINT + scope, instance, false);
  };

  newOrder = (path, instance) => {
    return postFetchInstance("API_URL", path, instance, true);
  };

  limitOrder = (instance) => {
    const scope = "orders/new";

    return postFetchInstance("API_URL", scope, instance);
  };

  cancelOrder = (orderGuid) => {
    const scope = "orders/cancel/" + orderGuid;

    return getFetchInstance("API_URL", scope);
  };


  cancelMarketOrders = (marketGuid) => {
    const scope = "orders/bulk/cancel/" + marketGuid;
    return getFetchInstance("API_URL", scope);
  };

  getMarketInfo = (from, to) => {
    const scope = "Market/GetInfo/" + from + "/" + to;
    return getFetchInstance("API_URL", scope, false);
  };


  getMarketChangesByAPI = (gd) => {
    const scope = "market/getsummaries?MarketGuid=";
    return getFetchInstance("API_URL", scope + gd, false);
  };


  getFullMarketChangesByAPI = (params) => {
    const scope = "wallets/summaries";
    return postFetchInstance("API_URL", scope, params, false, true);
  };

  getMarketCommissions = (gd) => {
    const scope = "commissions/getbyuser/" + gd;
    return getFetchInstance("API_URL", scope, false);
  };
}

const marketServices = new MarketServices();
export default marketServices;
