import { TRANSFER_CONSTANTS } from "../constants/transfer-constants";

export function setTransfers(data) {
  return {
    type: TRANSFER_CONSTANTS.SET_TRANSFERS,
    data: data,
  };
}


export function setDepositTransfers(data) {
  return {
    type: TRANSFER_CONSTANTS.SET_DEPOSITS,
    data: data,
  };
}


export function appendDeposit(data) {
  return {
    type: TRANSFER_CONSTANTS.APPEND_DEPOSIT,
    data: data,
  };
}


export function deleteDeposit(data) {
  return {
    type: TRANSFER_CONSTANTS.DELETE_DEPOSIT,
    data: data,
  };
}


export function deleteWithdraw(data) {
  return {
    type: TRANSFER_CONSTANTS.DELETE_WITHDRAW,
    data: data,
  };
}

export function appendWithdraw(data) {
  return {
    type: TRANSFER_CONSTANTS.APPEND_WITHDRAW,
    data: data,
  };
}


export function setWithdrawTransfers(data) {
  return {
    type: TRANSFER_CONSTANTS.SET_WITHDRAWS,
    data: data,
  };
}

