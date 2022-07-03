import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { DIMENSIONS} from "../../../../utils/dimensions";
import { useSelector } from "react-redux";
import HapticProvider from "../../../providers/HapticProvider";
import TinyImage from "../../../tiny-image";


const BigInput = (props) => {

  const { activeTheme } = useSelector(state => state.globalReducer);
  const {
    inputValue,
    changeAble = false,
    handleAction,
    smallTitle,
    paste = false,
    onLongPress = null,
    isAlone = false,
    actionAble = true,
  } = props;


  const handleUserAction = (key) => {
    HapticProvider.trigger();
    handleAction(key);
  };


  return (
    <Pressable
      onLongPress={onLongPress}
      style={styles(activeTheme).bigFieldWrapper}>

      <View style={[styles(activeTheme).t1, {}]}>
        {
          smallTitle && inputValue ? <Text style={styles(activeTheme).smallTitle}>{smallTitle}</Text> : null
        }

        {
          inputValue === "LOADING" ? <ActivityIndicator size={"small"} color={activeTheme.secondaryText} /> :
            inputValue ? <Text style={styles(activeTheme).bigTextValue}>{inputValue}</Text> : null
        }


      </View>


      {
        actionAble && <View
          style={[styles(activeTheme).bigField, {
            justifyContent: inputValue && changeAble ? "flex-end" : "space-around",
          }]}>
          <>

            <Pressable onPress={() => handleUserAction("copy")}>
              <TinyImage parent={"rest/"} name={inputValue && changeAble ? "dismiss" : "copy"}
                         style={styles(activeTheme).icon} />
            </Pressable>

            {
              !changeAble && !isAlone && <Pressable onPress={() => handleUserAction("qr")}>
                <TinyImage parent={"rest/"} name={"qr"} style={styles(activeTheme).icon} />
              </Pressable>
            }

          </>
        </View>
      }
    </Pressable>
  );

};


export default BigInput;

const styles = (props) => StyleSheet.create({
  bigFieldWrapper: {
    // height: DIMENSIONS.INPUT_HEIGHT,
    marginVertical: 8,

    width: "100%",
    minHeight: DIMENSIONS.INPUT_HEIGHT,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: props.borderGray,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: DIMENSIONS.MARGIN_T,
    paddingHorizontal: DIMENSIONS.PADDING_H,
  },
  textValue: {
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.BIG_TITLE_FONTSIZE,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    color: props.appWhite,
    width: "80%",
    backgroundColor: "blue",

  },

  t1: { width: "75%", justifyContent: "flex-start", alignItems: "flex-start" },
  bigTextValue: {
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.NORMAL_FONTSIZE,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: props.appWhite,
    flexWrap: "wrap",
    flexShrink: 1,
  },

  smallTitle: {
    marginBottom: 6,
    fontFamily: "CircularStd-Book",
    color: props.secondaryText,
  },

  textPlaceholder: {
    fontFamily: "CircularStd-Book",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "right",
    color: "rgba(255,255,255,.3)",
  },
  img: {
    maxWidth: DIMENSIONS.NORMAL_IMAGE,
    maxHeight: DIMENSIONS.NORMAL_IMAGE,
    tintColor: props.appWhite,
  },
  bigField: {
    width: "25%",
    alignItems: "center",
    flexDirection: "row",
    height: "100%",
  },
  icon: {
    width: 22,
    height: 22,
  },
});
