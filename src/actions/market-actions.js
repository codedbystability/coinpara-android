import { MARKET_CONSTANTS } from "../constants/market-constants";
import { ORDER_HISTORY_CONSTANTS } from "../constants/order-history-constants";


export function setCoins(data) {
  return {
    type: MARKET_CONSTANTS.SET_COINS,
    data: data,
  };
}

export function setMarkets(data) {
  return {
    type: MARKET_CONSTANTS.SET_MARKETS,
    data: data,
  };
}

export function updateMarketPR(data) {
  return {
    type: MARKET_CONSTANTS.UPDATE_MARKET_PR,
    data: data,
  };
}


export function updateMarkets(data) {
  return {
    type: MARKET_CONSTANTS.UPDATE_MARKETS,
    data: data,
  };
}


export function updateMarketHS(data) {
  return {
    type: MARKET_CONSTANTS.UPDATE_MARKET_HS,
    data: data,
  };
}


export function sortMarkets(data) {
  return {
    type: MARKET_CONSTANTS.SORT_MARKETS,
    data: data,
  };
}

export function setIsFavorite(data, gd) {
  return {
    type: MARKET_CONSTANTS.SET_FAVORITE,
    data: data,
    gd: gd,
  };
}


export function filterMarkets(data) {
  return {
    type: MARKET_CONSTANTS.FILTER_MARKETS,
    data: data,
  };
}


export function filterMarketsByText(data) {
  return {
    type: MARKET_CONSTANTS.FILTER_MARKETS_BY_TEXT,
    data: data,
  };
}


export function setSelectedMarketGuid(data) {
  return {
    type: MARKET_CONSTANTS.SET_SELECTED_MARKET_GUID,
    data: data,
  };
}


export function resetMarketOrders() {
  return {
    type: MARKET_CONSTANTS.RESET_MARKET_ORDERS,
  };
}


export function setActiveTypeF(type) {
  return {
    type: MARKET_CONSTANTS.SET_ACTIVE_TYPE,
    data: type,
  };
}

export function setLatestTicker(data) {
  return {
    type: MARKET_CONSTANTS.SET_LATEST_TICKER,
    data: data,
  };
}


export function setLatestAskBid(latestAsk, latestBid) {
  return {
    type: MARKET_CONSTANTS.SET_LATEST_ASK_BID,
    latestBid,
    latestAsk,
  };
}

export function setSortTypeAndDirection(sortType, sortDirection) {
  return {
    type: MARKET_CONSTANTS.SET_SORT_TYPE_AND_DIRECTION,
    sortType,
    sortDirection,
  };
}
