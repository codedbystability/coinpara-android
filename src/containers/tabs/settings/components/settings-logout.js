import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { getLang } from "../../../../helpers/array-helper";
import ActionSheetComProvider from "../../../../providers/ActionSheetComProvider";
import DropdownAlert from "../../../../providers/DropdownAlert";
import LocalStorage from "../../../../providers/LocalStorage";
import { disableInvalidToken } from "../../../../actions/auth-actions";
import { useSelector } from "react-redux";
import store from "../../../../reducers/createReducers";
import TinyImage from "../../../../tiny-image";
import { DIMENSIONS } from "../../../../../utils/dimensions";

const SettingsLogout = () => {
  const { activeTheme, language } = useSelector(state => state.globalReducer);

  const showActionSheet = () => ActionSheetComProvider.show({
    title: getLang(language, "ARE_YOUR_SURE_LOGOUT"),
    options: [getLang(language, "LOGOUT"), getLang(language, "CANCEL")],
    onAction: (index) => handleLogout(index),
  });

  const handleLogout = (index) => {
    if (index !== 0) {
      return;
    }
    LocalStorage.removeItem("token");
    // LocalStorage.removeItem("refresh_token");
    store.dispatch(disableInvalidToken(null));
    DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "LOGGED_OUT_SUCCESSFULLY"));
  };

  return (
    <Pressable
      onPress={showActionSheet}
      style={styles(activeTheme).wrapper}>
      <TinyImage parent={"rest/"} name={"logout"} style={styles(activeTheme).icon} />
      <Text style={styles(activeTheme).text}>
        {getLang(language, "LOGOUT")}
      </Text>
    </Pressable>
  );
};

export default React.memo(SettingsLogout);

const styles = props => StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    fontFamily: "CircularStd-Bold",
    color: props.noRed,
    paddingVertical: DIMENSIONS.PADDING_H / 2,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: DIMENSIONS.PADDING_H,
  },
});
