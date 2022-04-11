/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";

const orderTypes = [
  { id: 1, key: "open", name: "OPEN_ORDERS", extra: "oLength", value: 0 },
  { id: 2, key: "closed", name: "CLOSED_ORDERS", extra: "cLength", value: 1 },
];
const OrderTypes = (props) => {
  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const { activeType, oLength, cLength, handleChangeOrderType } = props;

  return (

    <View style={styles(activeTheme).wrapper}>
      {
        orderTypes.map(orderType => (
          <TouchableOpacity
            key={orderType.id}
            onPress={() => handleChangeOrderType(orderType)}
            activeOpacity={1}
            style={[styles(activeTheme).typeWrapper, activeType === orderType.value && styles(activeTheme).activeTypeWrapper]}>
            <Text
              style={[styles(activeTheme).text, activeType === orderType.value && styles(activeTheme).activeText]}>
              {getLang(language, orderType.name)}

              {
                orderType.key === "open" ? "(" + oLength + ")" : "(" + cLength + ")"
              }
            </Text>
          </TouchableOpacity>
        ))
      }


    </View>
  );
};

export default OrderTypes;

const styles = (props) => StyleSheet.create({
  wrapper: {
    // height: 60,
    // backgroundColor:'red',
    // paddingVertical:20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  typeWrapper: {
    width: "49%",
    height: 40,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    // paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: props.borderGray,
  },
  activeTypeWrapper: {
    borderBottomWidth: 2,
    borderBottomColor: props.secondaryText,
  },

  text: {
    color: props.secondaryText,
    fontFamily: "CircularStd-Book",
    marginBottom: 10,

  },
  activeText: {
    color: props.appWhite,
  },
});
