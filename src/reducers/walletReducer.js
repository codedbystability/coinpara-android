import { WALLET_CONSTANTS } from "../constants/wallet-constants";

const WalletStates = {
  wallets: [],
  sortType: "cd",
  sortDirection: "asc",
  activeSmallPrices: false,
  isBalanceHidden: false,
};

/*

 ds: { OrgKey: 'DailySpentAmount', Contract: null },
              ws: { OrgKey: 'WeeklySpentAmount', Contract: null },
              ms: { OrgKey: 'MonthlySpentAmount', Contract: null },
              la: { OrgKey: 'DepositMaxLimit', Contract: null },
              da: { OrgKey: 'AllowDeposit', Contract: null },
              wa: { OrgKey: 'AllowWithDraw', Contract: null },
              lb: { OrgKey: 'DepositMinLimit', Contract: null },
              lc: { OrgKey: 'WithdrawMaxLimit', Contract: null },
              ld: { OrgKey: 'WithdrawMinLimit', Contract: null },
              le: { OrgKey: 'UserDailyDepositLimit', Contract: null },
              lf: { OrgKey: 'UserMonthlyDepositLimit', Contract: null },
              lg: {
                OrgKey: 'ValidatedUserDailyDepositLimit',
                Contract: null
              },
              lh: {
                OrgKey: 'ValidatedUserMonthlyDepositLimit',
                Contract: null
              },
              li: { OrgKey: 'UserDailyWithdrawLimit', Contract: null },
              lj: { OrgKey: 'UserMonthlyWithdrawLimit', Contract: null },
              lk: {
                OrgKey: 'ValidatedUserDailyWithdrawLimit',
                Contract: null
              },
              lm: {
                OrgKey: 'ValidatedUserMonthlyWithdrawLimit',
                Contract: null
              },



 */
const walletReducer = (state = WalletStates, action) => {
  switch (action.type) {
    case WALLET_CONSTANTS.SET_WALLETS:
      return {
        ...state,
        wallets: action.data,
      };


    case WALLET_CONSTANTS.UPDATE_WALLET:
      return {
        ...state,
        wallets: state.wallets.map(wall => wall.gd === action.data.gd ? action.data : wall),
      };

    case WALLET_CONSTANTS.SET_SORT_TYPE_AND_DIRECTION_WALLET:
      return {
        ...state,
        sortType: action.sortType,
        sortDirection: action.sortDirection,
      };


    case WALLET_CONSTANTS.SET_ACTIVE_SMALL_PRICES:
      return {
        ...state,
        activeSmallPrices: action.data,
      };


    case WALLET_CONSTANTS.SET_SHOW_BALANCE:
      return {
        ...state,
        isBalanceHidden: action.data,
      };

    default:
      return state;
  }
};

export default walletReducer;
