import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BIG_TITLE_FONTSIZE, TITLE_FONTSIZE } from "../../../../../utils/dimensions";
import { getLang } from "../../../../helpers/array-helper";


const ModalizeHeader = (props) => {

  const { handleSetActiveButtonType, activeButtonType, activeTheme, activeIndex, language } = props;

  return (

    <View style={[styles(activeTheme).arrowContainer]}>

      <Pressable
        onPress={() => handleSetActiveButtonType("buy")}
        style={[styles(activeTheme).buttonWrapper, {
          backgroundColor: activeIndex === "initial" || activeButtonType === "buy" ?
            activeTheme.bidText
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
            activeTheme.askText
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
    // zIndex: 99999,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    // backgroundColor:'red'
  },

  buttonWrapper: {
    width: "48%",
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowRadius: 4,
    // shadowOpacity: 1,
  },

  buttonText: {
    fontFamily: "CircularStd-Bold",
    fontSize: BIG_TITLE_FONTSIZE + 2,
    textAlign: "center",
    // color: props.appWhite,
    color: "#fff",
  },

  descText: {
    fontFamily: "CircularStd-Book",
    fontSize: TITLE_FONTSIZE,
    lineHeight: 24,
    color: "#fff",
    // color: props.appWhite,
  },

});
