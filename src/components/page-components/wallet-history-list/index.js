import React from "react";
import { FlatList, Text } from "react-native";
import RenderTransferItem from "./item";
import RenderTransferDepositItemBoth from "./wallet-item–both";

const WalletHistoryList = (props) => {

  const { items, handleNavigation, cancelWithdraw, activeHistory, isBoth = false } = props;

  return (
    <FlatList
      contentContainerStyle={{
        paddingVertical: 20,
        paddingBottom: 80,
      }}
      showsVerticalScrollIndicator={false}
      data={items}
      renderItem={(item) =>
        isBoth ?
          <RenderTransferDepositItemBoth {...{
            item: item.item, handleNavigation, cancelWithdraw,
          }} />
          :
          <RenderTransferItem {...{
            item: item.item, handleNavigation, cancelWithdraw,
          }} />}
      keyExtractor={item => item.tg}
    />
  );
};

export default WalletHistoryList;


