import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";

const FeeTotal = ({ amount, fee }) => {

  const { language, activeTheme } = useSelector(state => state.globalReducer);
  return (
    <View style={styles(activeTheme).wrapper}>

      <View style={styles(activeTheme).left}>
        <Text style={styles(activeTheme).title}>
          {getLang(language, "FEES")}:
        </Text>
        <Text style={styles(activeTheme).title}>
          {fee === "FREE" ? getLang(language, "FREE") : fee}
        </Text>
      </View>

      <View style={styles(activeTheme).left}>
        <Text style={styles(activeTheme).title}>
          {getLang(language, "TOTAL")}:
        </Text>
        <Text style={styles(activeTheme).title}>
          {amount} TRY
        </Text>
      </View>

    </View>

  );


};

export default FeeTotal;

const styles = (props) => StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingVertical: 10,
  },
  left: { flexDirection: "row", justifyContent: "space-between" },
  title: {
    fontFamily: "CircularStd-Book",
    fontSize: 14,
    lineHeight: 32,
    color: props.secondaryText,
  },
});
