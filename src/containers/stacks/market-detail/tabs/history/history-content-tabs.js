import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TITLE_FONTSIZE } from "../../../../../../utils/dimensions";
import { getLang } from "../../../../../helpers/array-helper";

const titles = [
  { id: 2, key: "bid", title: "PRICE", width: "25%" },
  { id: 1, key: "qty", title: "AMOUNT", width: "25%" },
  { id: 3, key: "ask", title: "TOTAL", width: "25%" },
  { id: 4, key: "QQY", title: "DATE", width: "25%" },
];

const HistoryContentTabs = ({ language, activeTheme }) => {

  return (
    <View style={styles(activeTheme).titleContainer}>
      {
        titles.map((title, key) => <Text key={title.id}
                                         style={[styles(activeTheme).title, {
                                           width: title.width,
                                           textAlign: key === 0 ? "left" : "right",
                                         }]}>{
          getLang(language, title.title)
        }</Text>)
      }
    </View>

  );

};


export default HistoryContentTabs;

const styles = (props) => StyleSheet.create({
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    borderBottomColor: props.borderGray,
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
  contentWrapper: {
    width: "100%",
  },
  title: {
    width: "25%", textAlign: "left",
    fontFamily: "CircularStd-Book",
    fontSize: TITLE_FONTSIZE - 1,
    color: props.appWhite,
  },

  priceText: {
    fontFamily: "CircularStd-Bold",
    fontSize: TITLE_FONTSIZE,
    color: "#ffffff",
    width: "25%",
  },


});
