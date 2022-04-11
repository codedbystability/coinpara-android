/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TITLE_FONTSIZE } from "../../../../utils/dimensions";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import TinyImage from "../../../tiny-image";

const ListSort = ({
                    sortType,
                    setSortType,
                    sortDirection,
                    setSortDirection,
                  }) => {

  const { language, activeTheme } = useSelector(state => state.globalReducer);

  const handleSetSortType = (type) => {
    if (sortType === type) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortType(type);
    }

  };

  return (
    <View style={styles(activeTheme).container}>

      <View style={styles(activeTheme).leftWrapper}>
        <TouchableOpacity
          style={styles(activeTheme).touch}
          onPress={() => handleSetSortType("to")}
          activeOpacity={1}>
          <Text
            style={[styles(activeTheme).passiveText, sortType === "to" && styles(activeTheme).activeColor]}>{getLang(language, "MARKET")}</Text>
        </TouchableOpacity>
        <Text style={styles(activeTheme).passiveText}> / </Text>

        <TouchableOpacity
          style={styles(activeTheme).touch}
          onPress={() => handleSetSortType("vd")}
          activeOpacity={1}>
          <Text
            style={[styles(activeTheme).passiveText, sortType === "vd" && styles(activeTheme).activeColor]}>{getLang(language, "VOL")}</Text>
        </TouchableOpacity>

        {
          ["to", "vd"].includes(sortType) &&
          <TinyImage parent={"rest/"} name={sortDirection === "asc" ? "arrow-down" : "arrow-up"}
                     style={styles(activeTheme).icn} />
        }


      </View>

      <View style={styles(activeTheme).middleWrapper}>
        {/*<Text style={styles(activeTheme).passiveText}>{getLang(language, "GRAPH")}</Text>*/}
      </View>


      <View style={styles(activeTheme).rightWrapper}>
        <TouchableOpacity
          style={styles(activeTheme).touch}
          onPress={() => handleSetSortType("pr")}
          activeOpacity={1}>
          <Text
            style={[styles(activeTheme).passiveText, sortType === "pr" && styles(activeTheme).activeColor]}>{getLang(language, "PRICE")}</Text>
        </TouchableOpacity>
        <Text style={styles(activeTheme).passiveText}> / </Text>
        <TouchableOpacity
          style={styles(activeTheme).touch}
          onPress={() => handleSetSortType("cp")}
          activeOpacity={1}>
          <Text
            style={[styles(activeTheme).passiveText, sortType === "cp" && styles(activeTheme).activeColor]}>{getLang(language, "TWENTYFOUR_HOURS")}
          </Text>
        </TouchableOpacity>


        {
          ["pr", "cp"].includes(sortType) &&
          <TinyImage parent={"rest/"} name={sortDirection === "asc" ? "arrow-down" : "arrow-up"}
                     style={styles(activeTheme).icn} />
        }

      </View>

    </View>
  );
};


export default React.memo(ListSort);


const styles = (props) => StyleSheet.create({

  container: {
    width: "100%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    // justifyContent: "space-around",
  },
  leftWrapper: {
    // height: "100%",
    width: "35%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    // backgroundColor: "red",
  },

  middleWrapper: {
    // height: "100%",
    width: "35%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    // backgroundColor: "red",
  },

  rightWrapper: {
    // height: "100%",
    width: "30%",
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
    // backgroundColor: "red",
  },
  passiveText: {
    color: props.secondaryText,
    fontSize: TITLE_FONTSIZE,
    letterSpacing: 0,
    fontFamily: "CircularStd-Medium",
  },
  activeText: {
    color: "orange",
    fontSize: TITLE_FONTSIZE,
    letterSpacing: 0,
    fontFamily: "CircularStd-Medium",
  },

  activeColor: {
    color: props.appWhite,
  },

  icon: {
    marginLeft: 5,
  },
  touch: {
    padding: 5,
    paddingVertical: 10,
  },
  icn: {
    width: 12,
    height: 12,
  },
});
