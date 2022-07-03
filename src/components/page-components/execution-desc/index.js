import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import { DIMENSIONS } from "../../../../utils/dimensions";


const ExecutionDesc = () => {
  const { language, activeTheme } = useSelector(state => state.globalReducer);
  return (
    <View style={styles(activeTheme).wrapper}>
      <Text style={styles(activeTheme).txt}>
        {getLang(language, "TRADE_BOTTOM_INFO")}
      </Text>
    </View>
  );
};

export default ExecutionDesc;

const styles = (props) => StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: props.borderGray,
    marginTop: DIMENSIONS.MARGIN_T,
    padding: 10,
  },
  txt: {
    fontFamily: "CircularStd-Book",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    textAlign: "center",
    color: props.appWhite,
  },
});
