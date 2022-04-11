import React from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  // TouchableOpacity,
  View,
} from "react-native";
import { BIG_TITLE_FONTSIZE, INPUT_HEIGHT, PADDING_H } from "../../../../../utils/dimensions";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getLang } from "../../../../helpers/array-helper";

const actionTabs = [
  { id: 1, key: "market", title: "MARKET" },
  { id: 2, key: "limit", title: "LIMIT" },
  { id: 3, key: "stop-limit", title: "STOP_LIMIT" },
];


const ModalizeContentTabs = (props) => {

  const { setActiveActionTab, activeActionTab, language, activeTheme } = props;
  return (
    <View
      style={styles(activeTheme).tabsWrapper}>
      {
        actionTabs.map(item => (
          <Pressable
            key={item.key}
            onPress={() => setActiveActionTab(item.key)}
            style={[
              styles(activeTheme).tabItem, item.key === activeActionTab
              && { borderBottomWidth: 2, borderBottomColor: activeTheme.appWhite },
              { borderBottomColor: activeTheme.appWhite }]}>
            <Text style={[styles(activeTheme).tabText,
              item.key === activeActionTab && { color: activeTheme.appWhite },
            ]}>
              {getLang(language, item.title)}
            </Text>
          </Pressable>
        ))
      }
    </View>

  );
};

export default ModalizeContentTabs;


const styles = (props) => StyleSheet.create({

  tabsWrapper: {
    width: "100%",
    // height: "100%",
    height: INPUT_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: .1,
    paddingHorizontal: PADDING_H,
    // paddingHorizontal: 20,
  },
  tabItem: {
    width: "33%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: .4,
    borderBottomColor: props.borderGray,
  },
  tabText: {
    fontFamily: "CircularStd-Book",
    fontSize: BIG_TITLE_FONTSIZE,
    color: props.secondaryText,
    // height:'100%',
    // width:'80%'
  },
});
