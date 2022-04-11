import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import { getLang } from "../../../helpers/array-helper";
import { navigationRef } from "../../../providers/RootNavigation";
import TinyImage from "../../../tiny-image";

const SettingsHeader = ({ props, authenticated, language, backAble = false, title = null }) => {

  return (
    <TabNavigationHeader
      {...props}
      backAble={backAble}
      options={{
        presentation: "modal",
        title: getLang(language, title || "SETTINGS"),
      }}
      headerRight={
        authenticated && <TouchableOpacity
          onPress={() => navigationRef.current.navigate("Notifications")}
          activeOpacity={1} style={styles.headerRightWrapper}>
          <TinyImage style={styles.imgH} parent={"rest/"} name={"notifications"} />

        </TouchableOpacity>
      }
    />
  );
};

export default SettingsHeader;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  rightContainer: {
    width: "30%",
    alignItems: "flex-end",
  },

  headerRightWrapper: {
    position: "absolute",
    right: 10,
    bottom: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
  },

  historyText: {
    fontFamily: "CircularStd-Book",
    fontSize: 13,
    color: "#ffffff",
  },
  imgH: {
    width: 22,
    height: 22,
  },
});


