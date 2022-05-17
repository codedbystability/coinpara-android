import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { LIST_ITEM_HEIGHT, TITLE_FONTSIZE } from "../../../utils/dimensions";
import moment from "moment";
import { navigationRef } from "../../providers/RootNavigation";
import { formatMoney } from "../../helpers/math-helper";
import TinyImage from "../../tiny-image";

const RenderTransferDepositItem = (props) => {

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
      <View style={[styles(activeTheme).titleText, { color: color }]}>
        <Text style={[styles(activeTheme).itemText, { color: color, fontSize: 14 }]}>
          {formatMoney(item.Amount, item.CoinCode === "TRY" ? 2 : 8)}
        </Text>
        <Text style={[styles(activeTheme).itemText, { color: color }]}>
          {item.CoinCode}
        </Text>
      </View>
      <View style={[styles(activeTheme).titleText, {}]}>
        <Text
          style={[styles(activeTheme).itemText, { color: color }]}>{
          moment.utc(item.Timestamp).format("YYYY-MM-DD")

        }</Text>
        <Text style={[styles(activeTheme).itemText, { color: color }]}>{
          moment.utc(item.Timestamp).format("HH:mm")
        }</Text>
      </View>

      <View style={[styles(activeTheme).titleText, { alignItems: "center" }]}>
        <TinyImage parent={"rest/"} name={item.QuickBuyDeposit ? "checkmark" : "cancel"} style={styles(activeTheme).icon} />
      </View>


      <View
        style={[styles(activeTheme).titleText, { alignItems: "flex-end" }]}>

        <TinyImage parent={"rest/"} name={isWaiting ? "waiting" : isApproved ? "checkmark" : "checkmark"}
                   style={styles(activeTheme).icon} />

      </View>
    </Pressable>

  );
};


export default RenderTransferDepositItem;


const styles = (props) => StyleSheet.create({
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: props.secondaryText,
    paddingBottom: 20,
  },
  titleText: {
    width: "25%",
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
    fontSize: TITLE_FONTSIZE,
    // color: props.appWhite,
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

  txt: {
    fontFamily: "CircularStd-Bold",
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
  },
  del: {
    backgroundColor: props.noRed,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  icon: {
    width: 18,
    height: 18,
  },
});
