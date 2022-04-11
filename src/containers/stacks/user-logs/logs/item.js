import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { NORMAL_FONTSIZE } from "../../../../../utils/dimensions";

const UserLogItem = ({ item, activeTheme }) => {

  return (
    <Pressable
      style={styles(activeTheme).itemContainer}>
      <View style={[styles(activeTheme).titleText, {}]}>
        <Text numberOfLines={2}
              style={[styles(activeTheme).itemText]}>{item.TimeStamp.substr(0, item.TimeStamp.length - 4)}</Text>


      </View>
      <View style={[styles(activeTheme).titleText, {}]}>
        <Text style={[styles(activeTheme).itemText, {
          color: activeTheme.appWhite,
          fontSize: NORMAL_FONTSIZE,
        }]}>{item.ActionTypeName}</Text>
      </View>

      <View style={[styles(activeTheme).titleText, { alignItems: "flex-end" }]}>
        <Text style={[styles(activeTheme).itemText, { fontSize: 12 }]}>
          {item.MachineInfo}
        </Text>
      </View>


      <View style={[styles(activeTheme).titleText, { alignItems: "flex-end" }]}>
        <Text style={[styles(activeTheme).itemText, { fontSize: 12, color: activeTheme.appWhite }]}>
          {item.Ip}
        </Text>
      </View>
    </Pressable>
  );
};


export default UserLogItem;


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
