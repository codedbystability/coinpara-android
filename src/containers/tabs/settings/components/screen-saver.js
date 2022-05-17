import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StyleSheet, Switch, Text, View } from "react-native";
import {
  BIG_TITLE_FONTSIZE, LIST_MARGIN_T,
  NORMAL_FONTSIZE,
  PADDING_H, PADDING_V,
} from "../../../../../utils/dimensions";
import { getLang } from "../../../../helpers/array-helper";
import LocalStorage from "../../../../providers/LocalStorage";
import DropdownAlert from "../../../../providers/DropdownAlert";
import ActionSheetComProvider from "../../../../providers/ActionSheetComProvider";
import TinyImage from "../../../../tiny-image";


const ScreenSaver = () => {


  let userIdle = LocalStorage.getItem("userIdle");
  const [value, setValue] = useState(false);
  const [selectedVal, setSelectedVal] = useState(null);
  const { activeTheme, fontSizes, language } = useSelector(state => state.globalReducer);

  useEffect(() => {
    setValue(userIdle === "true");
  }, [userIdle]);

  const handleSetUserIdle = (val) => {
    // setSelectedVal(null)
    setSelectedVal(val);
  };

  useEffect(() => {
    if (selectedVal !== null) {
      ActionSheetComProvider.show({
        title: getLang(language, "CHANGE_SCREEN_SAVER_DESCRIPTION"),
        options: [getLang(language, "OK"), getLang(language, "CANCEL")],
        onAction: (index) => handleApprove(index),
      });
    }
  }, [selectedVal]);

  const handleApprove = (index) => {
    if (index !== 0) {
      setSelectedVal(null);
      setValue(!selectedVal);
      return;
    }
    DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "SCREEN_SAVER_UPDATED"));
    if (selectedVal) {
      setValue(true);
      LocalStorage.setItem("userIdle", "true");
    } else {
      setValue(false);
      LocalStorage.removeItem("userIdle");
    }
  };


  return (
    <>
      <View style={styles(activeTheme).wrapper}>
        <View style={styles(activeTheme).leftWrapper}>

          <View style={{
            marginRight: 10,
          }}>
            <TinyImage parent={"settings/"} name={"screen-saver"} style={styles(activeTheme).icon} />
          </View>

          <Text style={styles(activeTheme, fontSizes).title}>
            {getLang(language, "SCREEN_SAVER")}
          </Text>

        </View>

        <View
          style={styles(activeTheme).rightWrapper}>

          <Switch
            trackColor={{ false: activeTheme.darkBackground, true: activeTheme.actionColor }}
            thumbColor={value ? activeTheme.buttonWhite : activeTheme.secondaryText}
            ios_backgroundColor={activeTheme.darkBackground}
            onValueChange={handleSetUserIdle}
            value={value}
          />

        </View>

      </View>

      <Text style={styles(activeTheme, fontSizes).svT}>
        {getLang(language, "SCREEN_SAVER_DESCRIPTION")}
      </Text>

    </>
  );
};

export default ScreenSaver;

const styles = (props, fontSizes) => StyleSheet.create({
  wrapper: {
    width: "100%",
    marginTop: LIST_MARGIN_T ,
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
    fontSize: fontSizes?.TITLE_FONTSIZE,
    color: props.appWhite,
  },

  rightWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  svT: {
    color: props.secondaryText,
    marginTop: 2,
    // marginBottom: 16,
    fontSize: fontSizes?.NORMAL_FONTSIZE - 2,
    paddingHorizontal: PADDING_H,
  },

  icon: {
    width: 22,
    height: 22,
  },

});
