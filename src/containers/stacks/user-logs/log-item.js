import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { DIMENSIONS } from "../../../../utils/dimensions";

const UserLogItem = ({ item, activeTheme }) => {

  return (
    <Pressable
      style={styles(activeTheme).itemContainer}>
      <View style={[styles(activeTheme).titleText, {}]}>
        <Text numberOfLines={2}
              style={[styles(activeTheme).itemText]}>{item.TimeStamp.substr(0, item.TimeStamp.length - 4)}</Text>


      </View>
      <View style={[styles(activeTheme).titleText, {
        width: "35%",
      }]}>
        <Text style={[styles(activeTheme).itemText, {
          color: activeTheme.appWhite,
          fontSize: DIMENSIONS.NORMAL_FONTSIZE,
        }]}>{item.ActionTypeName}</Text>
      </View>

      <View style={[styles(activeTheme).titleText, { alignItems: "flex-end", width: "15%" }]}>
        <Text style={[styles(activeTheme).itemText, { fontSize: DIMENSIONS.NORMAL_FONTSIZE }]}>
          {item.MachineInfo}
        </Text>
      </View>


      <View style={[styles(activeTheme).titleText, { alignItems: "flex-end" }]}>
        <Text style={[styles(activeTheme).itemText, { fontSize: DIMENSIONS.NORMAL_FONTSIZE, color: activeTheme.appWhite }]}>
          {item.Ip}
        </Text>
      </View>
    </Pressable>
  );
};


export default React.memo(UserLogItem);


const styles = (props) => StyleSheet.create({
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: props.borderGray,
    paddingBottom: 20,
  },
  titleText: {
    width: "25%",
    textAlign: "left",
    fontFamily: "CircularStd-Book",
    fontSize: 13,
    color: props.appWhite,
    height: "100%",
    // alignItems: "center",
    justifyContent: "center",
  },

  itemText: {
    textAlign: "left",
    fontFamily: "CircularStd-Book",
    fontSize: 12,
    color: props.secondaryText,
  },
  buttonWrapper: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: props.borderGray,
    height: 50,
  },

});
