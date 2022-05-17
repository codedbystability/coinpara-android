import { MARKET_CONSTANTS } from "../constants/market-constants";
import { orderBy } from "lodash";

const MAX_ITEM_COUNT = 10;
const MarketStates = {
  marketCount: 1,
  markets: [],
  initialMarkets: [],
  coinList: [],
  selectedMarketGuid: null,
  sortType: "pr",
  sortDirection: "desc",
  activeType: "ALL",
  latestTicker: {},
  latestAskAndBid: {},

  marketsWithKey: [],
  marketsWithFs: [],
  btcTryGd: "",
  usdtTryGd: "",

  NEW: [],
  TOP_LOSERS: [],
  TOP_GAINERS: [],
  T_MARKETS: {
    ALL: [],
    TRY: [],
    USDT: [],
    FAVORITE: [],
  },
};

const marketReducer = (state = MarketStates, action) => {
  switch (action.type) {
    case MARKET_CONSTANTS.SET_MARKETS:
      const selectMarkets = action.data;
      const sorted = orderBy(selectMarkets, ["cp"], ["desc"]);
      const prSorted = orderBy(selectMarkets, ["pr"], ["desc"]);
      const btcTry = sorted.find(itm => itm.fs === "TRY" && itm.to === "BTC");
      const usdtTry = sorted.find(itm => itm.fs === "TRY" && itm.to === "USDT");

      const NEW = selectMarkets.filter(a => a.in === true).slice(0, 7);
      const TOP_GAINERS = sorted.slice(0, 7);
      const TOP_LOSERS = orderBy(selectMarkets, ["cp"], ["asc"]).slice(0, 7);

      return {
        ...state,
        markets: sorted,
        initialMarkets: sorted,
        marketsWithKey: prSorted.reduce((a, v) => ({
          ...a, [v.gd]: {
            svp: v.svp,
            spp: v.spp,
            fdp: v.fdp,
            tdp: v.tdp,
            fs: v.fs,
            to: v.to,
            cp: v.cp,
            gd: v.gd,
            pr: v.pr,
            cd: v.cd,
            in: v.in,
            if: v.if,
            it: v.it,
            hd: v.hd,
            vd: v.vd,
            ld: v.ld,
          },
        }), {}),
        NEW: NEW,
        TOP_GAINERS: TOP_GAINERS,
        TOP_LOSERS: TOP_LOSERS,
        btcTryGd: btcTry.gd,
        usdtTryGd: usdtTry.gd,

      };

    case MARKET_CONSTANTS.UPDATE_MARKETS:
      const marketsWithKey2 = state.marketsWithKey;
      action.data.map(v => {
        marketsWithKey2[v.gd] = {
          fs: v.fs,
          to: v.to,
          cp: v.cp,
          pr: v.pr,
          cd: v.cd,
          gd: v.gd,
          in: v.in,
          if: v.gd in marketsWithKey2 ? marketsWithKey2[v.gd].if : v.if,
          hd: v.hd,
          vd: v.vd,
          ld: v.ld,
          it: v.it,
          svp: v.svp,
          spp: v.spp,
          fdp: v.fdp,
          tdp: v.tdp,
        };
      });


      return {
        ...state,
        marketCount: state.marketCount + 1,
        marketsWithKey: marketsWithKey2,
      };


    case MARKET_CONSTANTS.UPDATE_MARKET_PR:
      const exist = state.markets.findIndex(market => market.gd === action.data.gd);
      // console.log('exist - ', exist)
      if (exist !== -1) {
        return {
          ...state,
          markets: state.markets.map(
            market => action.data.gd === market.gd ? {
                ...market,
                cp: action.data.cp,
                pr: action.data.pr,
                cd: action.data.cd,
                svp: action.data.svp,
                spp: action.data.spp,
              }
              : market,
          ),
        };
      }

      return {
        ...state,
        markets: [...state.markets, action.data],
      };

    case MARKET_CONSTANTS.UPDATE_MARKET_HS:
      const newData = state.markets;
      action.data.map(updateItem => {
        const exist = newData.findIndex(market => market.gd === updateItem.gd);
        if (exist !== -1) {
          newData[exist]["hs"] = updateItem.hs;
        } else {
          newData.push(updateItem);
        }

      });
      return {
        ...state,
        markets: newData,
      };

    case MARKET_CONSTANTS.SET_COINS:
      return {
        ...state,
        coinList: action.data,
      };

    case MARKET_CONSTANTS.SET_SELECTED_MARKET_GUID:
      return {
        ...state,
        selectedMarketGuid: action.data,
      };

    case MARKET_CONSTANTS.SET_FAVORITE:

      const marketsWithKey3 = state.marketsWithKey;
      marketsWithKey3[action.gd]["if"] = action.data;

      let newInitials = state.initialMarkets;
      const foundIndex = newInitials.findIndex(item => item.gd === action.gd);
      if (foundIndex > -1) {
        newInitials[foundIndex]["if"] = action.data;
      }

      return {
        ...state,
        // markets: state.markets.map(market => market.gd === action.gd ? {
        //   ...market,
        //   if: action.data,
        // } : market),
        // initialMarkets: state.initialMarkets.map(market => market.gd === action.gd ? {
        //   ...market,
        //   if: action.data,
        // } : market),

        marketCount: state.marketCount + 1,
        marketsWithKey: marketsWithKey3,
        initialMarkets: newInitials,
      };

    case MARKET_CONSTANTS.SORT_MARKETS:
      let newMarkets;
      if (action.data.direction === "asc") {
        newMarkets = state.initialMarkets.sort((a, b) => (a[action.data.type] > b[action.data.type]) ? 1 : -1);
      } else {
        newMarkets = state.initialMarkets.sort((a, b) => (a[action.data.type] < b[action.data.type]) ? 1 : -1);
      }


      return {
        ...state,
        markets: newMarkets,
      };

    case MARKET_CONSTANTS.FILTER_MARKETS:
      const type = action.data.type.toUpperCase();
      return {
        ...state,
        markets: type === "ALL" ? state.initialMarkets :
          type === "FAVORITE" ? state.initialMarkets.filter(item => item.if === true) :
            state.initialMarkets.filter(market => market.fs.toUpperCase() === type),
      };

    case MARKET_CONSTANTS.FILTER_MARKETS_BY_TEXT:
      const text = action.data.text ? action.data.text.toUpperCase() : "";
      return {
        ...state,
        markets: state.initialMarkets.filter(market => market.to.toUpperCase().includes(text) || market.tn.toUpperCase().includes(text)),
      };

    case MARKET_CONSTANTS.SET_BIDS:
      const hashObject = {};
      const filtered = action.data
        .filter(item => parseFloat(item.fa) > 0)
        .sort((a, b) => a.bov > b.bov ? -1 : a.bov < b.bov ? 1 : 0)
        .slice(0, MAX_ITEM_COUNT);

      for (let i = 0; i < filtered.length; i++) {
        hashObject[filtered[i]["bov"]] = filtered[i];
      }


      return {
        ...state,
        bidsObject: hashObject,
        bids: filtered,
        // totalBid: filtered.reduce((a, b) => a + (b["fa"] || 0), 0),
      };

    case MARKET_CONSTANTS.SET_ASKS:

      const hashObjectA = {};
      const filteredA = action.data
        .filter(item => parseFloat(item.fa) > 0)
        .sort((a, b) => a.bov < b.bov ? -1 : a.bov > b.bov ? 1 : 0)
        .slice(0, MAX_ITEM_COUNT);

      for (let i = 0; i < filteredA.length; i++) {
        hashObjectA[filteredA[i]["bov"]] = filteredA[i];
      }

      return {
        ...state,
        asksObject: hashObjectA,
        asks: filteredA,
        // totalAsk: filteredA.reduce((a, b) => a + (b["fa"] || 0), 0),

      };

    case MARKET_CONSTANTS.UPDATE_BID:

      if (state.bids.length <= 0) {
        const hashObject4 = [];
        hashObject4[action.data["bov"]] = action.data;
        return {
          ...state,
          bidsObject: hashObject4,
          bids: [action.data],
          // totalBid: [action.data].reduce((a, b) => a + (b["fa"] || 0), 0),
        };
      }
      if (parseFloat(action.data.ov) < parseFloat(state.bids[state.bids.length - 1].ov)) {
        return state;
      }

      const obj = state.bidsObject;
      let allBids = state.bids;
      if (action.data.bov in obj) {
        obj[action.data.bov] = action.data;
        allBids = Object.keys(obj).map(function(k) {
          return obj[k];
        });

        return {
          ...state,
          bids: allBids.slice(0, MAX_ITEM_COUNT),
          // totalBid: allBids.slice(0, MAX_ITEM_COUNT).reduce((a, b) => a + (b["fa"] || 0), 0),

        };

      } else {
        allBids = [...allBids, action.data];
        let allBidsSorted = allBids
          .filter(item => parseFloat(item.fa) > 0)
          .sort((a, b) => a.bov > b.bov ? -1 : a.bov < b.bov ? 1 : 0);

        const hashObject2 = [];
        for (let i = 0; i < allBidsSorted.length; i++) {
          hashObject2[allBidsSorted[i]["bov"]] = allBidsSorted[i];
        }
        return {
          ...state,
          bids: allBidsSorted.slice(0, MAX_ITEM_COUNT),
          // totalBid: allBidsSorted.slice(0, MAX_ITEM_COUNT).reduce((a, b) => a + (b["fa"] || 0), 0),
          bidsObject: hashObject2,
        };
      }

    case MARKET_CONSTANTS.UPDATE_ASK:
      if (state.asks.length <= 0) {
        const hashObject6 = [];
        hashObject6[action.data["bov"]] = action.data;

        return {
          ...state,
          asksObject: hashObject6,
          asks: [action.data],
          // totalAsk: [action.data].reduce((a, b) => a + (b["fa"] || 0), 0),

        };
      }
      if (parseFloat(action.data.ov) > parseFloat(state.asks[state.asks.length - 1].ov)) {
        return state;
      }


      // HER TURLU ARADA BIR DEGER GELDI DEMEK
      const objA = state.asksObject;
      let allAsks = state.asks;
      if (action.data.bov in objA) {
        // ITEM EXIST
        objA[action.data.bov] = action.data;
        allAsks = Object.keys(objA).map(function(k) {
          return objA[k];
        });

        return {
          ...state,
          asks: allAsks.slice(0, MAX_ITEM_COUNT),
          // totalAsk: allAsks.slice(0, MAX_ITEM_COUNT).reduce((a, b) => a + (b["fa"] || 0), 0),

        };

      } else {
        allAsks = [...allAsks, action.data];
        let allAsksSorted = allAsks
          .filter(item => parseFloat(item.fa) > 0)
          .sort((a, b) => a.bov < b.bov ? -1 : a.bov > b.bov ? 1 : 0);


        const hashObject3 = [];
        for (let i = 0; i < allAsksSorted.length; i++) {
          hashObject3[allAsksSorted[i]["bov"]] = allAsksSorted[i];
        }
        return {
          ...state,
          asks: allAsksSorted.slice(0, MAX_ITEM_COUNT),
          asksObject: hashObject3,
          // totalAsk: allAsksSorted.slice(0, MAX_ITEM_COUNT).reduce((a, b) => a + (b["fa"] || 0), 0),

        };
      }

    case MARKET_CONSTANTS.RESET_MARKET_ORDERS:
      return {
        ...state,
        bidsObject: {},
        asksObject: {},
        asks: [],
        bids: [],
        totalAsk: 1,
        totalBid: 1,
        selectedMarketGuid: null,
      };

    case MARKET_CONSTANTS.SET_SORT_TYPE_AND_DIRECTION:
      return {
        ...state,
        sortType: action.sortType,
        sortDirection: action.sortDirection,
      };

    case MARKET_CONSTANTS.SET_ACTIVE_TYPE:
      return {
        ...state,
        activeType: action.data,
      };

    case MARKET_CONSTANTS.SET_LATEST_TICKER:
      return {
        ...state,
        latestTicker: action.data,
      };

    case MARKET_CONSTANTS.SET_LATEST_ASK_BID:
      return {
        ...state,
        latestAskAndBid: {
          latestBidHd: action.latestBid.ov,
          latestAskLd: action.latestAsk.ov,
        },
      };

    default:
      return state;
  }
};

export default marketReducer;
