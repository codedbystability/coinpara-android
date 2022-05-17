import React, { useCallback } from "react";
import NavigationListItem from "../../../../../components/navigation-list-item";
import Passcode from "../passcode";
import CustomList from "../../../../../components/custom-list";
import { LIST_ITEM_HEIGHT, PADDING_H } from "../../../../../../utils/dimensions";
import FloatingAction from "../../../../../components/floating-action";

const items = [

  {
    id: 15,
    key: "CHANGE_PASSWORD",
    type: "navigation",
    page: "ChangePassword",
    image: "change-password",
  },
  {
    id: 12,
    key: "TWO_FACTOR_AUTHENTICATION",
    type: "navigation",
    page: "TwoFactorAuthentication",
    image: "two-factor",

  },
  {
    id: 13,
    key: "TIME_EXPIRATION",
    type: "navigation",
    page: "TimeExpiration",
    image: "time-expiration",
  },

];


const SecuritySection = () => {
  const keyExtractor = useCallback((item) => `security-item-${item.id}`, []);

  return (
    <>

      <CustomList
        borderGray={'transparent'}
        data={items}
        showFooter={true}
        keyExtractor={keyExtractor}
        itemHeight={LIST_ITEM_HEIGHT}
        renderItem={({ item }) => <NavigationListItem key={item.id} item={item} />}
        onEndReached={null}
        ListFooterComponent={<Passcode />}
      />

      <FloatingAction />

    </>

  );
};


export default React.memo(SecuritySection);
