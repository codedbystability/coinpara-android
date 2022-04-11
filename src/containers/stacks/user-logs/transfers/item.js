import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import moment from "moment";
import { getLang } from "../../../../helpers/array-helper";
import { useSelector } from "react-redux";

const TransferItem = ({ language,item, activeTheme, handleNavigation = null, cancelWithdraw = null }) => {

  const direction = item.Direction === 1 ? "buy" : "sell";
  const color = item.Direction === 1 ? activeTheme.yesGreen : activeTheme.noRed;

  return (
    <Pressable
      onPress={() => handleNavigation(item)}
      style={styles.itemContainer}>
      <View style={[styles.titleText, {}]}>
        <Text style={[styles.itemText]}>{
          // format(parseISO(item.Timestamp), "yyyy-MM-dd")
          moment(item.Timestamp).utc().local().format("YYYY-MM-DD")

        }</Text>

        <Text style={[styles.itemText]}>{
          moment(item.Timestamp).utc().local().format("HH:mm")
        }</Text>

      </View>
      <View style={[styles.titleText, { width: "20%" }]}>
        <Text
          style={[styles.itemText, { color: activeTheme.appWhite }]}>{getLang(language, direction.toUpperCase() + "_NOUN")}</Text>
      </View>


      <View style={[styles.titleText, { alignItems: "flex-start", width: "30%" }]}>
        <Text style={[styles.itemText, { color: activeTheme.appWhite, marginBottom: 4, textAlign: "left" }]}>
          {item.Amount} {item.FromCoinCode}
        </Text>

        <Text style={[styles.itemText, { color: color, fontSize: 12 }]}>
          {item.NewAmount} {item.ToCoinCode}
        </Text>
      </View>


      <View style={[styles.titleText, { alignItems: "flex-end" }]}>
        <Text style={[styles.itemText, { color: activeTheme.appWhite, fontSize: 12 }]}>
          {item.CommissionFee} {item.FromCoinCode}
        </Text>
      </View>

    </Pressable>
  );
};


export default TransferItem;


const styles = StyleSheet.create({
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,.2)",
    paddingBottom: 20,
  },
  titleText: {
    width: "25%",
    textAlign: "left",
    fontFamily: "CircularStd-Book",
    fontSize: 13,
    color: "#707a81",
    height: "100%",
    // alignItems: "center",
    justifyContent: "center",
  },

  itemText: {
    textAlign: "left",
    fontFamily: "CircularStd-Book",
    fontSize: 12,
    color: "#707a81",
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
    borderBottomColor: "rgba(255,255,255,.2)",
    height: 50,
  },

});
