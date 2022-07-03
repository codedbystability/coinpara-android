/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import { View, Text, Pressable } from "react-native";
import DynamicImage from "../../../components/page-components/dynamic-image";

const TradeSelectItem = (props) => {
  const { item, handleItemSelect } = props;

  const handlePress = () => handleItemSelect(item);
  return (
    <Pressable onPress={handlePress} style={styles.itemWrapper} key={item.id}>
      <View style={styles.leftWrapper}>
        <DynamicImage market={item.to} style={styles.image} />

        <View style={styles.nameWrapper}>
          <Text style={styles.title}>{item.to}</Text>
          <Text style={styles.desc}>{item.fn}</Text>
        </View>
      </View>

      <View style={styles.rightWrapper}>
        <Text style={styles.price}>{item.pr.toFixed(4)}</Text>
        <Text style={item.negative ? styles.negative : styles.positive}>
          {item.cd.toFixed(2)} (% {item.cp.toFixed(2)})
        </Text>
      </View>
    </Pressable>

  );
};


export default TradeSelectItem;
const styles = {
  itemWrapper: {
    marginBottom: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgb(77,100,119)",
    paddingVertical: 10,
  },

  leftWrapper: {
    flexDirection: "row",
  },
  nameWrapper: {
    marginLeft: 10,
  },
  title: {
    fontFamily: "CircularStd-Bold",
    color: "rgb(255,255,255)",
    fontSize: 14,
    letterSpacing: 0,
  },
  desc: {
    fontFamily: "CircularStd-Book",
    color: "rgb(112,122,129)",
    fontSize: 13,
    letterSpacing: 0,
  },

  rightWrapper: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  price: {
    fontFamily: "CircularStd-Book",
    color: "rgb(112,122,129)",
    fontSize: 14,
    letterSpacing: 0,
  },

  negative: {
    color: "rgb(255,72,145)", //   for red
    fontSize: 13,
    fontFamily: "CircularStd-Book",

  },
  positive: {
    color: "rgb(136,254,213)",
    fontSize: 13,
    fontFamily: "CircularStd-Book",
  },

  image: {
    width: 26,
    height: 26,
  },

};
