import React from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import OrdersPure from "./index-pure";
import { View } from "react-native";
import { PADDING_BV } from "../../../../utils/dimensions";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";


const AllOrders = (props) => {

  const { language } = useSelector(state => state.globalReducer);
  return (

    <>
      <TabNavigationHeader
        {...props}
        backAble={true}
        options={{
          presentation: "modal",
          title: getLang(language, "ORDERS"),
        }}
      />
      <View style={{ flex: 1, paddingVertical: PADDING_BV }}>
        <OrdersPure />
      </View>
    </>
  );

};

const AllOrdersScreen = styledHigherOrderComponents(AllOrders);
export default AllOrdersScreen;
