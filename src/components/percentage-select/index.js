import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BIG_TITLE_FONTSIZE, MODALIZE_INPUT } from "../../../utils/dimensions";
import { useSelector } from "react-redux";
import HapticProvider from "../../providers/HapticProvider";

const PercentageSelect = ({ percentages, activePercentage, handlePress }) => {

  const { activeTheme, fontSizes } = useSelector(state => state.globalReducer);
  const handlePercentageSelect = (item) => {
    HapticProvider.trigger();
    handlePress(item);
  };

  return (
    <View
      style={styles(activeTheme).buttonsContainer}>
      {
        percentages.map(item => (
          <Pressable
            onPress={() => handlePercentageSelect(item)}
            key={item.id}
            style={[styles(activeTheme).buttonItem,
              parseInt(activePercentage) >= parseInt(item.value) && {
                backgroundColor: activeTheme.activeListBg,
              }]}>
            <Text
              style={[styles(activeTheme, fontSizes).buttonText, parseInt(activePercentage) >= parseInt(item.value) && { color: activeTheme.appWhite }]}>%{item.value}</Text>
          </Pressable>
        ))
      }
    </View>
  );
};
export default React.memo(PercentageSelect);

const styles = (props, fontSizes) => StyleSheet.create({

  buttonsWrapper: {
    paddingVertical: 20,
  },

  buttonItem: {
    width: "20%",
    height: MODALIZE_INPUT,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: props.borderGray,
  },
  buttonText: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.BIG_TITLE_FONTSIZE + 1,
    lineHeight: 24,
    color: props.secondaryText,
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
});
