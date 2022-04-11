import { ORDER_HISTORY_CONSTANTS } from "../constants/order-history-constants";
import { MARKET_CONSTANTS } from "../constants/market-constants";
// import { MARKET_CONSTANTS } from "../constants/market-constants";

const OrderHistoryStates = {
  orderHistories: [],
  totalAsk: 0,
  totalBid: 0,
  bids: [],
  bidsObject: {},
  asksObject: {},
  asks: [],
  history: [],
  visibleHistory: [],

};

const orderHistoryReducer = (state = OrderHistoryStates, action) => {
  switch (action.type) {
    case ORDER_HISTORY_CONSTANTS.SET_ORDER_HISTORIES:
      return {
        ...state,
        orderHistories: action.data,
      };

    case ORDER_HISTORY_CONSTANTS.DELETE_ORDER:
      return {
        ...state,
        orderHistories: state.orderHistories.filter(item => item.og !== action.data),
      };

    case ORDER_HISTORY_CONSTANTS.SET_HISTORY:

      return {
        ...state,
        history: action.data.slice(0, 50),
      };

    case ORDER_HISTORY_CONSTANTS.APPEND_HISTORY:

      const existHistory = state.history.find(bid => bid.ov === action.data.ov && bid.di === action.data.di); // TODO -1 === null
      let allHistory = state.history;

      if (existHistory) {
        allHistory = allHistory.map(bid => bid.ov === action.data.ov ? action.data : bid);
      } else {
        allHistory = [action.data, ...allHistory];
      }

      return {
        ...state,
        history: allHistory.slice(0, 50),
      };

    case MARKET_CONSTANTS.SET_SELECTED_MARKET_GUID:
      return {
        ...state,
        history: [],
        visibleHistory: [],
      };
    default:
      return state;
  }
};

export default orderHistoryReducer;
