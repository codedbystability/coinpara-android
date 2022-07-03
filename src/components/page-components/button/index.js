import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";
import { DIMENSIONS } from "../../../../utils/dimensions";
import HapticProvider from "../../../providers/HapticProvider";
import { isIphoneX } from "../../../../utils/devices";
import TinyImage from "../../../tiny-image";


const CustomButton = ({
                        text, onPress, filled = true,
                        isRadius = false, isBorder = false,
                        isSecondary = false,
                        style = {},
                        textStyles = null,
                        showR = false,
                        isNormal = false,
                        smallTitle = null,
                      }) => {
  const { activeTheme } = useSelector(state => state.globalReducer);

  const handleAction = () => {
    HapticProvider.trigger();
    onPress();
  };
  return (
    <Pressable
      style={[
        filled ? styles(activeTheme).container :
          isNormal ? styles(activeTheme).normal :
            isSecondary ? styles(activeTheme).secondaryContainer : styles(activeTheme).emptyContainer,
        isRadius && styles(activeTheme).radius,
        smallTitle && styles(activeTheme).veryBig,
        isBorder && styles(activeTheme).border, style, styles(activeTheme).shadow]}
      onPress={handleAction}>


      <Text
        style={[textStyles ? textStyles : styles(activeTheme).text, { paddingVertical: isIphoneX ? DIMENSIONS.PADDING_V : DIMENSIONS.PADDING_V / 2 }]}>
        {text}
      </Text>


      {

        smallTitle ? <Text style={[styles(activeTheme).sub]}>{smallTitle}</Text> : null
      }

      {
        showR ? <TinyImage parent={"settings/"} name={"about-us"} style={styles(activeTheme).icon} />
          : null
      }

    </Pressable>

  );

};

export default CustomButton;


const styles = (props) => StyleSheet.create({
  container: {
    backgroundColor: props.actionColor,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isIphoneX ? DIMENSIONS.PADDING_H / 1.6 : DIMENSIONS.PADDING_H / 2,
    width: "100%",
  },
  normal: {
    backgroundColor: props.actionColor,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
    width: "100%",
  },
  veryBig: {
    paddingBottom: 30,
  },
  shadow: {
    // shadowColor: props.borderGray,
    // shadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
    // shadowRadius: 2,
    // elevation: 2,
    // shadowOpacity: 1,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: DIMENSIONS.MARGIN_T,
    backgroundColor: props.secondaryText,
  },

  secondaryContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isIphoneX ? DIMENSIONS.PADDING_H / 1.6 : DIMENSIONS.PADDING_H / 2,
    backgroundColor: "rgba(255,255,255,.3)",
  },
  text: {
    fontFamily: "CircularStd-Book",
    fontSize: 18,
    color: props.buttonWhite,
    paddingHorizontal: "5%",
  },

  sub: {
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.NORMAL_FONTSIZE - 1,
    color: props.secondaryText,
    paddingHorizontal: "5%",

  },

  radius: {
    borderRadius: 12,
  },

  border: {
    borderWidth: 1,
    borderColor: props.borderGray,
  },

  icon: {
    width: 22,
    height: 22,
  },

});
