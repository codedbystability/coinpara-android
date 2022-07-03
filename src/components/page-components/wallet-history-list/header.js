import React from "react";
import {  StyleSheet, Text, View } from "react-native";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import { DIMENSIONS } from "../../../../utils/dimensions";

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
            width: `33%`,
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
    paddingHorizontal: DIMENSIONS.PADDING_H,

  },
  titleText: {
    textAlign: "left",
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
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
