import { createSelector } from "reselect";


const selectMarkets = (state) => state.marketReducer.markets.filter(itm => itm.gd);
const selectLatestTicker = (state) => state.marketReducer.latestTicker;
// const selectLatestAskAndBid = (state) => state.marketReducer.latestAskAndBid;
const selectTry = (state) => state.marketReducer.markets.filter(item => item.fs === "TRY");
const selectUsd = (state) => state.marketReducer.markets.filter(item => item.fs === "USDT");
const selectedMarketGuid = (state) => state.marketReducer.selectedMarketGuid;
const selectFavorites = (state) => state.marketReducer.markets.filter(item => item.if === true);

const selectSortType = (state) => state.marketReducer.sortType;
const selectSortDirection = (state) => state.marketReducer.sortDirection;
const selectActiveType = (state) => state.marketReducer.activeType;


const selectLosers = createSelector(selectMarkets, (markets) => markets.sort((a, b) => (parseFloat(a.cp) > parseFloat(b.cp)) ? 1 : -1).slice(0, 10));
const selectGainers = createSelector(selectMarkets, (markets) => markets.sort((a, b) => (parseFloat(a.cp) > parseFloat(b.cp)) ? -1 : 1).slice(0, 10));
const selectNews = createSelector(selectMarkets, (markets) => markets.filter(a => a.in === true).slice(0, 10));


const selectActiveMarkets = createSelector(
  [selectActiveType, selectMarkets, selectTry, selectUsd, selectFavorites],
  (activeType, markets, tryMarkets, usdMarkets, favMarkets) => {
    switch (activeType) {
      case "ALL":
        return markets;

      case "TRY":
        return tryMarkets;

      case "USDT":
        return usdMarkets;

      case "FAVORITE":
        return favMarkets;

      default:
        return [];

    }
  },
);


export const selectTheMarket = createSelector([
  selectMarkets,
  selectLatestTicker,
  // selectLatestAskAndBid,
  selectedMarketGuid,
], (
  markets,
  latestTicker,
  // latestAskAndBid,
  gd) => {
  return {
    theMarket: markets.find(itm => itm.gd === gd),
    // latestAskAndBid,
    latestTicker,
  };
});

export const selectSortedMarkets = createSelector(
  [selectActiveMarkets, selectSortType, selectSortDirection],
  (markets, sortType, sortDirection) => sortDirection === "asc" ? markets.sort((a, b) => (a[sortType] > b[sortType]) ? 1 : -1)
    : markets.sort((a, b) => (a[sortType] < b[sortType]) ? 1 : -1),
);


//todo - homepage
export const selectGroupedMarkets = createSelector(
  [
    selectGainers,
    selectLosers,
    selectNews,
  ],
  (TOP_GAINERS, TOP_LOSERS, NEW) => ({ TOP_GAINERS, TOP_LOSERS, NEW }),
);


export const handleGroupMarkets = (markets, sortType, sortDirection) => {

}
