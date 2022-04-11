import React from "react";
import { useSelector } from "react-redux";
import { StyleSheet, Text, View } from "react-native";
import Checkbox from "../../../../components/checkbox";
import { LIST_MARGIN_T, PADDING_H, PADDING_V } from "../../../../../utils/dimensions";
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
    marginTop: LIST_MARGIN_T,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: PADDING_V,
    paddingHorizontal: PADDING_H,
    borderRadius: 8,
    backgroundColor: props.darkBackground,
    borderWidth: 1,
    borderColor: props.borderGray,
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
    fontSize: fontSizes?.BIG_TITLE_FONTSIZE,
    color: props.appWhite,
  },

  rightWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    width: 22,
    height: 22,
  },

});
