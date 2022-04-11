import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import { TITLE_FONTSIZE } from "../../../../utils/dimensions";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import { navigationRef } from "../../../providers/RootNavigation";

const WalletHeader = ({ props, authenticated, language }) => {
  const { activeTheme } = useSelector(state => state.globalReducer);

  return (
    <TabNavigationHeader{...props} backAble={false}
                        options={{ title: getLang(language, "WALLET") }}
                        headerRight={
                          authenticated &&
                          <TouchableOpacity
                            onPress={() => navigationRef.current.navigate("WalletHistory")}
                            activeOpacity={1}
                            style={[styles.headerRightWrapper, { borderColor: activeTheme.borderGray }]}>

                            <Text style={[styles.historyText, { color: activeTheme.appWhite }]}>
                              {getLang(language, "HISTORY")}
                            </Text>
                          </TouchableOpacity>
                        }
    />
  );
};

export default WalletHeader;


const styles = StyleSheet.create({
  rightContainer: {
    width: "30%",
    alignItems: "flex-end",
  },

  headerRightWrapper: {
    position: "absolute",
    right: 10,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    width:80
  },


  historyText: {
    fontFamily: "CircularStd-Book",
    fontSize: TITLE_FONTSIZE,
    color: "#ffffff",
  },
});


