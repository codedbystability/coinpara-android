import { ORDER_HISTORY_CONSTANTS } from "../constants/order-history-constants";
import { MARKET_CONSTANTS } from "../constants/market-constants";

export function setOrderHistories(data) {
  return {
    type: ORDER_HISTORY_CONSTANTS.SET_ORDER_HISTORIES,
    data: data,
  };
}


export function deleteOrder(data) {
  return {
    type: ORDER_HISTORY_CONSTANTS.DELETE_ORDER,
    data: data,
  };
}


export function setBids(data) {
  return {
    type: MARKET_CONSTANTS.SET_BIDS,
    data: data,
  };
}


export function setAsks(data) {
  return {
    type: MARKET_CONSTANTS.SET_ASKS,
    data: data,
  };
}


export function updateAsks(data) {
  return {
    type: MARKET_CONSTANTS.UPDATE_ASK,
    data: data,
  };
}


export function updateBids(data) {
  return {
    type: MARKET_CONSTANTS.UPDATE_BID,
    data: data,
  };
}



export function setHistory(data) {
  return {
    type: ORDER_HISTORY_CONSTANTS.SET_HISTORY,
    data: data,
  };
}


export function appendHistory(data) {
  return {
    type: ORDER_HISTORY_CONSTANTS.APPEND_HISTORY,
    data: data,
  };
}


