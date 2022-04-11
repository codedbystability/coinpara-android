import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import PercentageSelect from "../../../../components/percentage-select";
import {
  MODALIZE_INPUT,
  NORMAL_FONTSIZE,
  PADDING_H,
  PADDING_V, TITLE_FONTSIZE,
} from "../../../../../utils/dimensions";
import { formatMoney } from "../../../../helpers/math-helper";
import { getLang } from "../../../../helpers/array-helper";
import { useSelector } from "react-redux";
import { isIphoneX } from "../../../../../utils/devices";
import { percentages } from "./constants";
import AnimatedTab from "../../../../components/animated-tab";
import TinyImage from "../../../../tiny-image";


const ModalizeInputs = (props) => {

  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const [activeFocusedKey, setActiveKey] = useState("");
  const {
    activeInputs,
    fromWallet,
    toWallet,
    activePercentage,
    handleInputChange,
    getProperTextValue,
    getProperPrecision,
    setActivePercentage,
    activeActionTab,
    tradeTypes,
    activeType,
    handleChangeTradeType,
    handlePriceSet,
    handleUpDown,
    market,
  } = props;


  const handleFakeFocus = (input) => input.ref.current?.focus();
  const handleOnFocus = (input) => setActiveKey(input.key);
  const handleOnBlur = () => setActiveKey("");


  return (
    <View
      style={{
        flex: .7,
        paddingHorizontal: PADDING_H,
        paddingVertical: PADDING_V,
        justifyContent: "space-between",
      }}>


      <View style={{ flex: .9 }}>
        <View style={styles(activeTheme).infoWrapper}>
          <Text style={styles(activeTheme).descText}>
            {getLang(language, "AVAILABLE_SHORT")}: {" "}
            <Text>
              {/*{formattedNumber(toWallet.am - toWallet.ra, toWallet.cd)} {toWallet.cd}*/}
              {formatMoney(toWallet.wb, toWallet.dp)} {toWallet.cd}
            </Text>
          </Text>

          <Text style={styles(activeTheme).descText}>
            {getLang(language, "AVAILABLE_SHORT")}: {" "}
            <Text>
              {/*{formattedNumber(fromWallet.wb, fromWallet.cd)} {fromWallet.cd}*/}
              {formatMoney(fromWallet.wb, fromWallet.dp)} {fromWallet.cd}
            </Text>
          </Text>
        </View>
        {
          activeActionTab === "market" && <View style={{ paddingTop: 20, width: "60%" }}>
            <AnimatedTab {...{
              activeKey: activeType,
              headers: tradeTypes,
              width: `50%`,
              filled: false,
              onChange: handleChangeTradeType,
            }} />


          </View>
        }

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 16,
          }}>
          {
            activeInputs.map(input => {
              const inputValue = getProperTextValue(input);
              const inputPrecision = getProperPrecision(input);
              return (
                <Pressable
                  onPress={() => handleFakeFocus(input)}
                  key={input.id} style={styles(activeTheme).inputWrapper}>
                  <View style={styles(activeTheme).inputContainer}>

                    <View style={[styles(activeTheme).inputLabel,
                      { justifyContent: "space-between", paddingLeft: 8 }]}>
                      <Text
                        style={[styles(activeTheme).descText, { fontFamily: "CircularStd-Bold" }]}>
                        {getLang(language, input.leftLabel)}</Text>

                      {
                        input.icon && <Pressable onPress={() => handlePriceSet(input.key)}>
                          <TinyImage parent={"rest/"} name={"refresh"} style={styles(activeTheme).icon} />
                        </Pressable>
                      }

                    </View>

                    <TextInput
                      keyboardAppearance={"dark"}
                      onFocus={() => handleOnFocus(input)}
                      onBlur={handleOnBlur}
                      ref={input.ref}
                      textAlign={"right"}
                      // onChangeText={val =>  handleInputChange(input.key, val, inputPrecision)}
                      onChangeText={val => (val.match(/\./g) || []).length <= 1 && handleInputChange(input.key, val.replace(/,/g, "."), inputPrecision)}
                      value={
                        inputValue ?
                          activeFocusedKey === input.key ?
                            // inputValue
                            inputValue.match(new RegExp("^-?\\d+(?:\.\\d{0," + (inputPrecision) + "})?"))[0]
                            :
                            // formatMoney(inputValue.match(new RegExp("^-?\\d+(?:\.\\d{0," + (inputPrecision) + "})?"))[0], inputPrecision) : ""
                            formatMoney(inputValue, inputPrecision) : ""
                      }
                      keyboardType={"numeric"}
                      style={styles(activeTheme).textInput}
                      multiline={false}
                      editable={!input.disabled}
                      numberOfLines={1}
                      returnKeyType={"next"}
                    />


                    <View style={styles(activeTheme).inputSecondLabel}>
                      <Text
                        numberOfLines={1}
                        style={[styles(activeTheme).descText, { fontFamily: "CircularStd-Bold" }]}>{market[input.rightLabel]}</Text>
                    </View>
                  </View>


                  {
                    input.arrows && <View style={styles(activeTheme).buttonWrapper}>

                      <Pressable
                        onPress={() => handleUpDown(input.key, "-")}
                        style={styles(activeTheme).buttonContainer}>
                        <Text style={styles(activeTheme).minusText}> - </Text>
                        {/*<Entypo name={"minus"} size={ICON_SIZE} color={activeTheme.appWhite} />*/}
                      </Pressable>

                      <Pressable
                        onPress={() => handleUpDown(input.key, "+")}
                        style={[styles(activeTheme).buttonContainer]}>
                        <Text style={styles(activeTheme).minusText}> + </Text>

                        {/*<Entypo name={"plus"} size={ICON_SIZE} color={activeTheme.appWhite} />*/}
                      </Pressable>

                    </View>
                  }


                </Pressable>
              );
            })

          }
        </View>

        <View style={styles(activeTheme).percentageContainer}>
          <PercentageSelect percentages={percentages}
                            handlePress={(item) => setActivePercentage(item.value)}
                            activePercentage={activePercentage} />
        </View>
      </View>


    </View>

  );

};

export default ModalizeInputs;


const styles = (props) => StyleSheet.create({
  container: {
    // flex: 1,
    marginTop: 6,
    paddingHorizontal: PADDING_H,
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
    marginTop: isIphoneX ? 8 : 4,
    height: MODALIZE_INPUT,
    marginBottom: 0,


  },
  inputContainer: {
    width: "80%",
    justifyContent: "center",
    flexDirection: "row",
    borderColor: props.borderGray,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 5,
  },

  inputLabel: {
    width: "30%",
    height: MODALIZE_INPUT,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  textInput: {
    paddingHorizontal: 10,
    // height: 40,
    width: "70%",
    // textAlign: "auto",
    color: props.appWhite,
    overflow: "hidden",
    flexWrap: "wrap",
    // flex: 1,
    // flexDirection: "row",
    // backgroundColor: "orange",
    flexShrink: 1,
    fontSize: TITLE_FONTSIZE - 1,
  },
  inputSecondLabel: {
    width: "15%",
    height: MODALIZE_INPUT,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonWrapper: {
    width: "20%",
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    width: "50%",
    // height: "100%",
    // paddingVertical: PADDING_V,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 4,
    // marginLeft: 4,
  },
  minusText: {
    fontSize: 32,
    color: props.appWhite,
    fontFamily: "CircularStd-Bold",
  },
  percentageContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
  },
  descText: {
    fontFamily: "CircularStd-Book",
    fontSize: NORMAL_FONTSIZE - 1,
    lineHeight: 24,
    color: props.secondaryText,

  },
  itemContainer: {
    // flex: 1,
    marginTop: 6,
    paddingHorizontal: PADDING_H,
  },
  icon: {
    width: 18,
    height: 18,
  },
});
