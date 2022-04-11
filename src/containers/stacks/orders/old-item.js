import React from "react";
import {  StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { SvgUri } from "react-native-svg"; //for remotes !

const OrderItem = ({ item, index,cancelAble }) => {

  return (
    <View
      key={index}
      style={styles.container}>

      <View style={styles.leftWrapper}>

        <Text style={styles.title}>{item.market}</Text>

        <Text style={styles.description}>Limit</Text>


      </View>

      <View style={styles.middleWrapper}>
        <Text style={styles.priceTitle}>0.00105990</Text>
        <Text style={styles.description}>0.00105990</Text>
      </View>

      <View style={[styles.rightWrapper, !cancelAble && { justifyContent: "center" }]}>

        <View style={{
          alignItems: "flex-end",
        }}>
          <Text style={styles.priceTitle}>
            {item.amount}
          </Text>

          <Text style={styles.description}>
            {item.desc}
          </Text>
        </View>

        {
          cancelAble && <TouchableOpacity style={{
            paddingHorizontal: 5,
            paddingVertical: 3,
            borderColor: "#fff",
            borderWidth: .5,
            borderRadius: 5,

          }}>
            <Text style={styles.cancelTitle}>İptal</Text>
          </TouchableOpacity>
        }


      </View>
    </View>


  );
};

export const MemoizedOrderItem = React.memo(OrderItem);


const styles = StyleSheet.create({

  container: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    bottomBorderStyle: "solid",
    borderBottomColor: "rgb(75,91,135)",
    marginBottom: 5,
    paddingBottom: 5,
    // marginHorizontal:20
  },
  leftWrapper: {
    height: "100%",
    justifyContent: "center",
    width: "25%",
    // paddingRight: 20,
  },

  title: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "CircularStd-Bold",

  },
  priceTitle: {
    color: "rgb(255,255,255)",
    fontSize: 12,
    fontFamily: "CircularStd-Book",
  },
  cancelTitle: {
    color: "rgb(255,255,255)",
    fontSize: 12,
    fontFamily: "CircularStd-Book",
  },
  description: {
    color: "rgb(112,122,129)",
    fontSize: 12,
    fontFamily: "CircularStd-Medium",
  },
  middleWrapper: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    width: "35%",
  },
  rightWrapper: {
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    // backgroundColor: "red",
    width: "40%",
  },


});
