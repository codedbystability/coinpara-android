import React from "react";
import { useSelector } from "react-redux";
import { StyleSheet, Text, View } from "react-native";
import Checkbox from "../../../../components/page-components/checkbox";
import { DIMENSIONS } from "../../../../../utils/dimensions";
import { getLang } from "../../../../helpers/array-helper";
import TinyImage from "../../../../tiny-image";


const LanguageItem = (props) => {
  const { item } = props;
  const { activeTheme, fontSizes, language } = useSelector(state => state.globalReducer);


  return (
    <>
      <View style={styles(activeTheme).wrapper}>

        <View style={styles(activeTheme).leftWrapper}>
          <View style={{ marginRight: 10 }}>
            <TinyImage parent={"settings/"} name={item.image} style={styles(activeTheme).icon} />
          </View>

          <Text style={styles(activeTheme, fontSizes).title}>
            {getLang(language, item.key)}
          </Text>
        </View>

        <View style={styles(activeTheme).rightWrapper}>
          <Checkbox />
        </View>
      </View>

    </>
  );
};

export default LanguageItem;


const styles = (props, fontSizes) => StyleSheet.create({
  wrapper: {
    width: "100%",
    marginTop: DIMENSIONS.LIST_MARGIN_T,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: DIMENSIONS.PADDING_V / 1.4,
    paddingHorizontal: DIMENSIONS.PADDING_H,
    borderRadius: 8,
    // backgroundColor: props.darkBackground,
    // borderWidth: 1,
    // borderColor: props.borderGray,
  },
  leftWrapper: {
    alignItems: "center",
    flexDirection: "row",
  },

  image: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: props.appWhite,
  },

  title: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.TITLE_FONTSIZE,
    color: props.appWhite,
  },

  rightWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    width: 18,
    height: 18,
  },

});
