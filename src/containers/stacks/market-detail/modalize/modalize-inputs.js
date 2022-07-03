import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import PercentageSelect from "../../../../components/page-components/percentage-select";
import { DIMENSIONS } from "../../../../../utils/dimensions";
import { formatMoney } from "../../../../helpers/math-helper";
import { getLang } from "../../../../helpers/array-helper";
import { useSelector } from "react-redux";
import { isIphoneX } from "../../../../../utils/devices";
import { percentages } from "./constants";
import AnimatedTab from "../../../../components/page-components/animated-tab";
import * as Animatable from "react-native-animatable";
import TinyImage from "../../../../tiny-image";


const ModalizeInputs = (props) => {

  const viewRef = useRef(null);
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

  useEffect(() => {
    viewRef.current?.animate({
      0: { opacity: 0 },
      1: { opacity: 1 },
    });
  }, [activeInputs]);

  return (
    <View
      style={{
        flex: .7,
        paddingHorizontal: DIMENSIONS.PADDING_H,
        paddingVertical: DIMENSIONS.PADDING_V,
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

        <Animatable.View
          ref={viewRef}
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
                <View
                  key={input.id} style={styles(activeTheme).inputWrapper}>
                  <View style={styles(activeTheme).inputContainer}>

                    <Pressable onPress={() => handlePriceSet(input.key)} style={[styles(activeTheme).inputLabel,
                      { justifyContent: "space-between", paddingLeft: 8 }]}>
                      <Text
                        style={[styles(activeTheme).descText, { fontFamily: "CircularStd-Bold" }]}>
                        {getLang(language, input.leftLabel)}</Text>

                      {
                        input.icon && <TinyImage parent={"rest/"} name={"refresh"} style={styles(activeTheme).icon} />
                      }

                    </Pressable>

                    <TextInput
                      //onPress={() => handleFakeFocus(input)}
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


                    <Pressable
                      onPress={() => handleFakeFocus(input)}
                      style={styles(activeTheme).inputSecondLabel}>
                      <Text
                        numberOfLines={1}
                        style={[styles(activeTheme).descText, { fontFamily: "CircularStd-Bold" }]}>{market[input.rightLabel]}</Text>
                    </Pressable>
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


                </View>
              );
            })

          }
        </Animatable.View>

        <View style={styles(activeTheme).percentageContainer}>
          <PercentageSelect percentages={percentages}
                            handlePress={(item) => setActivePercentage(item.value)}
                            activePercentage={activePercentage} />
        </View>
      </View>


    </View>

  );

};

export default React.memo(ModalizeInputs);


const styles = (props) => StyleSheet.create({
  container: {
    marginTop: 6,
    paddingHorizontal: DIMENSIONS.PADDING_H,
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
    height: DIMENSIONS.MODALIZE_INPUT,
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
    height: DIMENSIONS.MODALIZE_INPUT,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  textInput: {
    paddingHorizontal: 10,
    width: "70%",
    color: props.appWhite,
    overflow: "hidden",
    flexWrap: "wrap",
    flexShrink: 1,
    fontSize: DIMENSIONS.TITLE_FONTSIZE - 1,
  },
  inputSecondLabel: {
    width: "15%",
    height: DIMENSIONS.MODALIZE_INPUT,
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
    fontSize: DIMENSIONS.NORMAL_FONTSIZE - 1,
    lineHeight: 24,
    color: props.secondaryText,

  },
  itemContainer: {
    marginTop: 6,
    paddingHorizontal: DIMENSIONS.PADDING_H,
  },
  icon: {
    width: 18,
    height: 18,
  },
});
