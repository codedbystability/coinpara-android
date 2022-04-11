import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import moment from "moment";


const AccountActivityItem = ({ item, activeHistory, handleDetail }) => {


  return (
    <Pressable
      onPress={() => handleDetail(item)}
      style={styles.itemContainer}>
      <View style={[styles.titleText, {}]}>
        <Text style={styles.itemText}>{moment(new Date()).format("yyy-mm-dd")}</Text>
        <Text style={styles.itemText}>{moment(new Date()).format("k:mm")}</Text>
      </View>
      <View style={styles.titleText}>
        <Text style={[styles.itemText, { textAlign: "center" }]}>{item.price}</Text>
        <Text style={[styles.itemText, {
          textAlign: "center",
          color: activeHistory === "deposit" ? "rgb(136,254,213)" : "red",
        }]}>{item.amount}</Text>
      </View>
      <View style={styles.titleText}>
        <Text style={[styles.itemText, { textAlign: "right" }]}>{item.commission}</Text>
      </View>

    </Pressable>
  );
};

export default AccountActivityItem;


const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,.2)",
    height: 50,
  },
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
    width: "33%",
    textAlign: "left",
    fontFamily: "CircularStd-Book",
    fontSize: 13,
    color: "#707a81",
  },

  itemText: {
    textAlign: "left",
    fontFamily: "CircularStd-Book",
    fontSize: 12,
    color: "#707a81",
  },
});
