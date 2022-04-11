/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";

const CancelAll = ({ handleCancelAll }) => {

  const { activeTheme, language } = useSelector(state => state.globalReducer);

  return (
    <View style={styles(activeTheme).wrapper}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleCancelAll}
        style={styles(activeTheme).buttonWrapper}>
        <Text style={styles(activeTheme).text}>{getLang(language, "CANCEL_ALL")}</Text>
      </TouchableOpacity>
    </View>

  );
};


export default CancelAll;

const styles = (props) => StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "flex-end",
    // paddingHorizontal: 15,
    marginVertical: 10,
  },
  buttonWrapper: {
    borderColor: props.secondaryText,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 3,
  },
  text: {
    fontFamily: "Helvetica",
    fontSize: 12,
    color: props.appWhite,
  },
});
