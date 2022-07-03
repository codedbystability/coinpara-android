import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { DIMENSIONS } from "../../../../../utils/dimensions";
import { getLang } from "../../../../helpers/array-helper";
import { formatMoney } from "../../../../helpers/math-helper";
import TinyImage from "../../../../tiny-image";
import { isIphoneX } from "../../../../../utils/devices";

const ModalizeBottom = (props) => {

  const {
    activeButtonType,
    activeUserColors,
    activeActionTab,
    activeType,
    activeTheme,
    language,
    handleOrder,
    handleSetActiveButtonType,
    amount,
    total,
    fromWallet,
    toWallet,
  } = props;


  return (
    <View style={[styles(activeTheme).bottomContainer, {}]}>

      <View style={styles(activeTheme).bottomDescContainer}>

        <Text style={styles(activeTheme).descText}>
          {getLang(language, "EST")}:
        </Text>
        <Text style={styles(activeTheme).descText}>
          {
            activeButtonType === "buy" && activeActionTab === "market" && activeType === "total" ||
            activeButtonType === "sell" && activeActionTab === "market" && activeType === "total" ? formatMoney(amount, toWallet.dp) :
              formatMoney(total, fromWallet.dp)
          }
        </Text>

      </View>


      <View style={[styles(activeTheme).bottomDescContainer, { marginBottom: 8 }]}>

        {/*<Text style={styles(activeTheme).descText}>*/}
        {/*  Komisyon:*/}
        {/*</Text>*/}
        {/*<Text style={styles(activeTheme).descText}>*/}
        {/*  19.00 TRY*/}
        {/*</Text>*/}

      </View>


      <View style={styles(activeTheme).buttonContainer}>

        <Pressable
          onPress={() => handleSetActiveButtonType(null)}
          style={styles(activeTheme).icon}>
          <TinyImage parent={"rest/"} name={"down-full"} style={styles(activeTheme).icon2} />
        </Pressable>

        <Pressable
          onPress={handleOrder}
          style={[styles(activeTheme).buttonWrapper, {
            width: "80%",
            backgroundColor: activeButtonType === "buy" ? activeUserColors.bidText : activeUserColors.askText,
          }]}>
          <Text style={[styles(activeTheme).buttonText]}>
            {activeButtonType === "sell" ? getLang(language, "SELL") : getLang(language, "BUY")}
          </Text>
        </Pressable>

      </View>

    </View>

  );
};

export default ModalizeBottom;


const styles = (props) => StyleSheet.create({
  bottomContainer: {
    flex: isIphoneX ? .35 : .1,
    paddingHorizontal: DIMENSIONS.PADDING_H,
  },

  bottomDescContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: DIMENSIONS.PADDING_V,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  icon2: {
    width: 18,
    height: 18,
  },
  icon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: props.backgroundApp,
    borderColor: props.borderGray,
    borderWidth: .5,
    borderRadius: 21,
  },

  itemContainer: {
    flex: 1,
    marginTop: 6,
    paddingHorizontal: 12,
  },
  infoWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  inputContainer: {
    width: "80%",
    justifyContent: "center",
    flexDirection: "row",
    borderColor: "rgba(255,255,255,.2)",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 5,
  },

  inputLabel: {
    width: "20%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  textInput: {
    paddingHorizontal: 10,
    // height: 40,
    width: "65%",
    textAlign: "auto",
    color: "#fff",
    overflow: "hidden",
    flexWrap: "wrap",
    flexShrink: 1,
  },
  inputSecondLabel: {
    width: "15%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonWrapper: {
    width: "48%",
    height: 42,
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
    fontSize: DIMENSIONS.TITLE_FONTSIZE + 1,
    color: props.secondaryText,
  },
});
