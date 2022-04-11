import { WALLET_CONSTANTS } from "../constants/wallet-constants";

export function setWallets(data) {
  return {
    type: WALLET_CONSTANTS.SET_WALLETS,
    data: data,
  };
}


export function updateWallet(data) {
  return {
    type: WALLET_CONSTANTS.UPDATE_WALLET,
    data: data,
  };
}


export function setSortTypeWallet(sortType, sortDirection) {
  return {
    type: WALLET_CONSTANTS.SET_SORT_TYPE_AND_DIRECTION_WALLET,
    sortType, sortDirection,
  };
}


export function setActiveSmallPrices(data) {
  return {
    type: WALLET_CONSTANTS.SET_ACTIVE_SMALL_PRICES,
    data,
  };
}

export function setShowBalance(data) {
  return {
    type: WALLET_CONSTANTS.SET_SHOW_BALANCE,
    data,
  };
}


