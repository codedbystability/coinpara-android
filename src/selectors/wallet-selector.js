import { createSelector } from "reselect";
import { orderBy } from "lodash";

const selectWallets = (state) => state.walletReducer.wallets;
const selectBTCWallet = (state) => state.walletReducer.wallets.find(wall => wall.cd === "BTC");
const selectTRYWallet = (state) => state.walletReducer.wallets.find(wall => wall.cd === "TRY");
const selectSortType = (state) => state.walletReducer.sortType;
const selectSortDirection = (state) => state.walletReducer.sortDirection;
const selectActiveSmallPrices = (state) => state.walletReducer.activeSmallPrices;


export const getBTCMarket = createSelector(
  [selectBTCWallet],
  (btcWallet) => btcWallet,
);

export const getTRYMarket = createSelector(
  [selectTRYWallet],
  (tryWallet) => tryWallet,
);

export const selectSortedWallets = createSelector(
  [selectWallets, selectActiveSmallPrices, selectSortType, selectSortDirection],
  (wallets, activeSmallPrices, sortType, sortDirection) => {
    if (activeSmallPrices) {
      wallets.filter(wallet => parseFloat(wallet.am) > 0);
    }
    return sortDirection === "asc" ?
      wallets.sort((a, b) => (a[sortType] > b[sortType]) ? 1 : -1)
      : wallets.sort((a, b) => (a[sortType] < b[sortType]) ? 1 : -1);
  },
);

// pr - cd
export const selectSortByMarket = createSelector(
  [selectWallets],
  (wallets) => ({
    cd: orderBy(wallets, ["cd"]),
    am: orderBy(wallets, ["am"]),
    wb: orderBy(wallets, ["wb"]),
    EstimatedTRY: orderBy(wallets, ["EstimatedTRY"]),
    EstimatedBTC: orderBy(wallets, ["EstimatedBTC"]),
  }),
);


