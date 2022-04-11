import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { getLang } from "../../helpers/array-helper";
import { useSelector } from "react-redux";

const WalletHistoryListHeader = (props) => {

  const { headers } = props;
  const { language, activeTheme } = useSelector(state => state.globalReducer);
  return (
    <View style={styles(activeTheme).titleContainer}>
      {
        headers.map(header => <Text
          numberOfLines={1}
          key={header.id} style={[
          styles(activeTheme).titleText, header.options, {
            width: `${parseInt(100 / headers.length)}%`,
          }]}>{getLang(language, header.title)}</Text>)
      }


    </View>


  );
};

export default WalletHistoryListHeader;


const styles = (props) => StyleSheet.create({
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: "rgba(255,255,255,.2)",
    paddingBottom: 20,
  },
  titleText: {
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
    color: "#707a81",
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
