import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import TinyImage from "../../../tiny-image";

const RenderTransferDepositItemBoth = ({ item, handleNavigation = null, cancelWithdraw = null }) => {

  const isWaiting = item.st === 1;
  const isApproved = item.st === 2;
  const isDeposit = item.st === 1;


  const { activeTheme } = useSelector(state => state.globalReducer);
  const color = isWaiting || isApproved ? activeTheme.appWhite : activeTheme.secondaryText;
  return (
    <Pressable
      onPress={() => handleNavigation(item)}
      style={styles(activeTheme).itemContainer}>
      <View style={[styles(activeTheme).titleText, {}]}>
        <Text style={[styles(activeTheme).itemText, { color: color }]}>{
          moment(item.ts).utc().local().format("YYYY-MM-DD")
        }</Text>

        <Text style={styles(activeTheme).itemText}>{
          moment(item.ts).utc().local().format("HH:mm")
        }</Text>

      </View>
      <View style={[styles(activeTheme).titleText, {}]}>
        <Text style={[styles(activeTheme).itemText, { color: color }]}>{isDeposit ? "Deposit" : "Withdraw"}</Text>
      </View>

      <View style={[styles(activeTheme).titleText, { alignItems: "center" }]}>
        <Text style={[styles(activeTheme).itemText, { color: color, fontSize: 12 }]}>
          {item.am.toFixed(2)} {item.cd}
        </Text>
      </View>


      <Pressable
        onPress={() => cancelWithdraw(item)}
        style={[styles(activeTheme).titleText, { alignItems: "flex-end" }]}>
        <TinyImage parent={"rest/"} name={isWaiting ? "waiting" : isApproved ? "success" : "cancel"}
                   style={styles(activeTheme).icon} />

      </Pressable>
    </Pressable>
  );
};


export default RenderTransferDepositItemBoth;


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
    borderBottomWidth: 1,
    borderBottomColor: props.borderGray,
    height: 50,
  },

});
