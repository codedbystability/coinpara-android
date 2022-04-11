/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from "react";
import { View, Text, StyleSheet } from "react-native";

const ListSort = () => {

  const sortTypes = [
    { id: 1, name: "Markets", key: "market" },
    { id: 2, name: "Price", key: "price" },
    { id: 3, name: "Size", key: "capacity" },
  ];


  return (
    <View style={styles.container}>

      {
        sortTypes.map(sortType => (
          <View style={
            sortType.id === 1 ? styles.wrapper25 : sortType.id === 2 ? styles.wrapper35 : styles.wrapper40
            // styles.wrapper
          } key={sortType.id}>
            <Text style={styles.passiveText}>{sortType.name}</Text>
          </View>
        ))
      }


    </View>
  );
};


export default ListSort;


const styles = StyleSheet.create({

  container: {
    width: "100%",
    height: 40,
    flexDirection: "row",
    // paddingHorizontal: 20,
    // justifyContent: "space-between",
  },
  wrapper25: {
    // height: "100%",
    width: "25%",
    alignItems: "center",
    justifyContent: "center",

  },
  wrapper35: {
    // height: "100%",
    width: "35%",
    alignItems: "center",
    justifyContent: "center",
  },

  wrapper40: {
    // height: "100%",
    width: "40%",
    alignItems: "center",
    justifyContent: "center",

  },

  passiveText: {
    color: "rgb(112,122,129)",
    fontSize: 13,
    letterSpacing: 0,
    fontFamily: "CircularStd-Medium",
  },
  activeText: {
    color: "rgb(9,160,255)",
    fontSize: 13,
    letterSpacing: 0,
    fontFamily: "CircularStd-Medium",
  },

});
