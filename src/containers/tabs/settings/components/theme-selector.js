import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { setActiveTheme, setClassicColors, setIconColor } from "../../../../actions/global-actions";
import { useDispatch, useSelector } from "react-redux";
import generalServices from "../../../../services/general-services";
import { getLang } from "../../../../helpers/array-helper";
import DropdownAlert from "../../../../providers/DropdownAlert";
import { DIMENSIONS } from "../../../../../utils/dimensions";
import ActionSheetComProvider from "../../../../providers/ActionSheetComProvider";
import HapticProvider from "../../../../providers/HapticProvider";
import LocalStorage from "../../../../providers/LocalStorage";
import TinyImage from "../../../../tiny-image";

const themes = [
  {
    key: "classic",
    title: "CLASSIC",
  },
  {
    key: "dark",
    title: "DARK",
  },
  {
    key: "light",
    title: "LIGHT",
  },
];
let showAction = false;
let selectedThemeKey = "";

const ThemeSelector = () => {
  const { activeTheme, fontSizes, activeThemeKey, language } = useSelector(state => state.globalReducer); /// colors and classic !
  const dispatch = useDispatch();

  const handleThemeChange = (theme) => {
    HapticProvider.trigger();
    if (theme.key === activeThemeKey) {
      return;
    }
    showAction = true;
    selectedThemeKey = theme.key;
    ActionSheetComProvider.show({
      title: getLang(language, "ARE_YOU_SURE_CHANGE_THEME"),
      options: [getLang(language, "CHANGE_THEME"), getLang(language, "CANCEL")],
      onAction: (index) => handleThemeApprove(index),
    });

  };


  const handleColorChange = (theme) => {
    generalServices.getColors(theme).then((response) => {
      if (response && response.IsSuccess) {
        console.log("response.IconColor - ", response.IconColor);
        dispatch(setIconColor(response.IconColor));
        LocalStorage.setObject("classicColorsL", response.Data);
        LocalStorage.setItem("classicColorsIcon", response.IconColor);
        dispatch(setClassicColors(response.Data));
        LocalStorage.setItem("activeTheme", theme);
        dispatch(setActiveTheme(theme, response.IconColor));
        DropdownAlert.show("info", getLang(language, "INFO"), getLang(language, "THEME_CHANGED_SUCCESSFULLY"));
      }
    });
  };
  const handleThemeApprove = (index) => {
    if (selectedThemeKey) {
      showAction = false;
      if (index === 0) {
        handleColorChange(selectedThemeKey);
      } else {
        selectedThemeKey = activeThemeKey;
      }
    }

  };

  return (
    <View style={styles(activeTheme).wrapper}>
      <Text style={styles(activeTheme, fontSizes).title}>{getLang(language, "CHOOSE_YOUR_THEME")}</Text>

      <View style={styles(activeTheme).container}>
        {
          themes.map((theme, index) => {
            return (
              <Pressable
                onPress={() => handleThemeChange(theme)}
                key={theme.key}
                style={activeThemeKey === theme.key ? styles(activeTheme).active : styles(activeTheme).item}>
                <View style={{ marginRight: 4 }}>
                  <TinyImage parent={"themes/"}
                             name={theme.key}
                             style={styles(activeTheme).image} />
                </View>
                <Text
                  style={[styles(activeTheme, fontSizes).text, activeThemeKey === theme.key && { color: activeTheme.appWhite }]}>{getLang(language, theme.title)}</Text>

              </Pressable>

            );
          })
        }

      </View>

    </View>
  );

};

export default React.memo(ThemeSelector);
const styles = (props, fontSizes) => StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingTop: DIMENSIONS.LIST_MARGIN_T,
    // paddingHorizontal: PADDING_H,
  },
  item: {
    width: "30%",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
    borderColor: "transparent",
    flexDirection: "row",
    height: 40,
  },
  active: {
    width: "33%",
    // backgroundColor: props.darkBackground,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: props.actionColor,
    flexDirection: "row",
    height: 40,
  },
  title: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.SUBTITLE_FONTSIZE,
    // lineHeight: 16,
    color: props.secondaryText,
    marginTop: 12,
  },
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  img: {
    height: 16,
    width: 16,
    tintColor: props.secondaryText,
    marginRight: 10,
  },
  image: {
    width: 18,
    height: 18,
  },
  actImg: {
    height: 16,
    width: 16,
    tintColor: props.actionColor,
    marginRight: 10,
  },
  text: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.NORMAL_FONTSIZE,
    textAlign: "center",
    color: props.secondaryText,
  },
});
