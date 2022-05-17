import React from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import OrdersPure from "./index";
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
        isBack={true}
        options={{
          presentation: "modal",
          title: getLang(language, "MY_ORDERS"),
        }}
      />
      <View style={{ flex: 1, paddingVertical: 0 }}>
        <OrdersPure />
      </View>
    </>
  );

};

const AllOrdersScreen = styledHigherOrderComponents(AllOrders);
export default AllOrdersScreen;
