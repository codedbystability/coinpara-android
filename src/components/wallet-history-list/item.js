import React from "react";
import RenderTransferDepositItem from "./deposit-item";
import RenderTransferWithdrawItem from "./withdraw-item";

const RenderTransferItem = ({ item, handleNavigation, cancelWithdraw }) => {

  const isDeposit = item.di === 1;
  return isDeposit ? <RenderTransferDepositItem
    {...{
      item, handleNavigation, cancelWithdraw,
    }} /> : <RenderTransferWithdrawItem {...{
    item, handleNavigation, cancelWithdraw,
  }} />;
};


export default RenderTransferItem;

