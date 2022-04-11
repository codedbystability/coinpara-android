import React from "react";
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#e2e3e4",
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  icon: {
    marginRight: 16,
  },
});


const Row = ({ label, icon, first }) => {
  const borderBottomWidth = first ? 0 : StyleSheet.hairlineWidth;
  return (
    <View style={[styles.container, { borderBottomWidth }]}>
      <Text style={styles.body}>{label}</Text>
    </View>
  );
};

export default Row;
