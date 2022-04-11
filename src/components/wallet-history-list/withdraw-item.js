import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { LIST_ITEM_HEIGHT } from "../../../utils/dimensions";
import { navigationRef } from "../../providers/RootNavigation";
import { formatMoney } from "../../helpers/math-helper";
import TinyImage from "../../tiny-image";

const RenderTransferWithdrawItem = (props) => {

  const { item } = props;
  const isWaiting = item.st === 1;
  const isApproved = item.st === 2;
  const { activeTheme } = useSelector(state => state.globalReducer);

  const color = isWaiting || isApproved ? activeTheme.appWhite : activeTheme.secondaryText;

  const handleNavigation = (transfer) => navigationRef.current.navigate("TransactionDetail", { transfer });

  return (
    <Pressable
      onPress={() => handleNavigation(item)}
      style={styles(activeTheme).itemContainer}>
      <View style={[styles(activeTheme).titleText, {}]}>
        <Text style={[styles(activeTheme).itemText, { color: color, fontSize: 14 }]}>
          {formatMoney(item.am, item.cd === "TRY" ? 2 : 8)}
        </Text>
        <Text style={[styles(activeTheme).itemText, { color: color }]}>
          {item.cd}
        </Text>
      </View>

      <View style={[styles(activeTheme).titleText, {
        alignItems: "flex-end",
        color: color,
      }]}>
        <Text style={[styles(activeTheme).itemText, { color: color }]}>{
          moment.utc(item.ts).format("YYYY-MM-DD")
        }</Text>
        <Text style={[styles(activeTheme).itemText, { color: color }]}>{
          moment.utc(item.ts).format("HH:mm")
        }</Text>
      </View>


      <View
        style={[styles(activeTheme).titleText, { alignItems: "flex-end", color: color }]}>
        <TinyImage parent={"rest/"} name={isWaiting ? "waiting" : isApproved ? "success" : "cancel"}
                   style={styles(activeTheme).icon} />
      </View>
    </Pressable>
  );
};


export default RenderTransferWithdrawItem;


const styles = (props) => StyleSheet.create({
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: props.borderGray,
    paddingBottom: 20,
  },
  titleText: {
    width: "33%",
    textAlign: "left",
    fontFamily: "CircularStd-Book",
    fontSize: 13,
    color: props.appWhite,
    height: "100%",
    // alignItems: "center",
    justifyContent: "center",
  },

  itemText: {
    textAlign: "left",
    fontFamily: "CircularStd-Book",
    fontSize: 12,
    color: props.appWhite,
  },
  buttonWrapper: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: .5,
    borderBottomColor: props.borderGray,
    height: LIST_ITEM_HEIGHT,
  },

  icon: {
    width: 18,
    height: 18,
  },

});
