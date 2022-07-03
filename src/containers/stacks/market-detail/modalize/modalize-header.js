import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { DIMENSIONS } from "../../../../../utils/dimensions";
import { getLang } from "../../../../helpers/array-helper";


const ModalizeHeader = (props) => {

  const { handleSetActiveButtonType, activeButtonType, activeTheme, activeUserColors, activeIndex, language } = props;

  return (

    <View style={[styles(activeTheme).arrowContainer]}>

      <Pressable
        onPress={() => handleSetActiveButtonType("buy")}
        style={[styles(activeTheme).buttonWrapper, {
          backgroundColor: activeIndex === "initial" || activeButtonType === "buy" ?
            activeUserColors.bidText
            : activeTheme.borderGray,
        }]}>
        <Text style={[styles(activeTheme).buttonText]}>
          {getLang(language, "BUY")}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => handleSetActiveButtonType("sell")}
        style={[styles(activeTheme).buttonWrapper, {
          backgroundColor: activeIndex === "initial" ||
          activeButtonType === "sell" ?
            activeUserColors.askText
            : activeTheme.borderGray,
        }]}>

        <Text style={[styles(activeTheme).buttonText]}>
          {getLang(language, "SELL")}
        </Text>
      </Pressable>

    </View>


  );
};

export default ModalizeHeader;


const styles = (props) => StyleSheet.create({
  arrowContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },

  buttonWrapper: {
    width: "48%",
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontFamily: "CircularStd-Bold",
    fontSize: DIMENSIONS.BIG_TITLE_FONTSIZE + 2,
    textAlign: "center",
    color: "#fff",
  },

  descText: {
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    lineHeight: 24,
    color: "#fff",
  },

});
