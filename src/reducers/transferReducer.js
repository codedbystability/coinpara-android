import { TRANSFER_CONSTANTS } from "../constants/transfer-constants";

const WalletStates = {
  transfers: [],
  deposits: [],
  withdraws: [],
};

const transferReducer = (state = WalletStates, action) => {
  switch (action.type) {

    case TRANSFER_CONSTANTS.SET_DEPOSITS:

      const wrappedDeposits = action.data.map(item => {
        item["id"] = Math.random();
        return item;
      });

      return {
        ...state,
        deposits: wrappedDeposits,
      };

    case TRANSFER_CONSTANTS.APPEND_DEPOSIT:
      const dep = action.data;
      dep.id = Math.random();
      return {
        ...state,
        deposits: [...state.deposits, dep],
      };

    case TRANSFER_CONSTANTS.DELETE_DEPOSIT:
      return {
        ...state,
        deposits: state.deposits.filter(deposit => deposit.id !== action.data.id),
      };

    case TRANSFER_CONSTANTS.DELETE_WITHDRAW:
      return {
        ...state,
        withdraw: state.withdraw.filter(withdraw => withdraw.id !== withdraw.data.id),
      };

    case TRANSFER_CONSTANTS.APPEND_WITHDRAW:
      const withdraw = action.data;
      withdraw.id = Math.random();
      return {
        ...state,
        withdraws: [...state.withdraws, withdraw],
      };

    case TRANSFER_CONSTANTS.SET_WITHDRAWS:

      const wrappedWithdraws = action.data.map(item => {
        item["id"] = Math.random();
        return item;
      });


      return {
        ...state,
        withdraws: wrappedWithdraws,
      };


    default:
      return state;
  }
};

export default transferReducer;
