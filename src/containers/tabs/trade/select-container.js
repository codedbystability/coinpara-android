/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from "react";
import { View, ScrollView } from "react-native";
import TradeSelectItem from "./select-item";
import { useState } from "react";
import SearchInput from "../../../components/search-input";
import { useDispatch } from "react-redux";
import { filterMarketsByText } from "../../../actions/market-actions";
import { SCREEN_HEIGHT } from "../../../../utils/dimensions";

const TradeSelectContainer = (props) => {

  const { markets, handleItemSelect } = props;
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");

  const handleFilterMarkets = (text) => {
    setSearchText(text);
    dispatch(filterMarketsByText({ text }));
  };

  return (
    <View>
      <View style={styles.wrapper}>
        <View style={[styles.triangle, styles.arrowUp]} />

        <View style={styles.selectContainer}>


          <SearchInput text={searchText}
                       style={styles.searchInput}
                       onChange={handleFilterMarkets} />


          <ScrollView contentContainerStyle={styles.scrollContainer}>

            {
              markets.map((item, key) => <TradeSelectItem key={key} item={item} handleItemSelect={handleItemSelect} />)
            }

          </ScrollView>

        </View>

      </View>
    </View>

  );
};


export default TradeSelectContainer;
const styles = {
  wrapper: {
    width: "100%",
    paddingHorizontal: 20,
    height: SCREEN_HEIGHT / 1.8,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",

  },
  arrowUp: {
    borderTopWidth: 0,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "rgba(255,255,255,0.05)",
    borderLeftColor: "transparent",
    marginBottom: -1,
    marginTop: 10,
    zIndex: 9999,
  },
  selectContainer: {
    backgroundColor: "rgb(21,52,76)",
    width: "100%",
    height: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.1)",
    justifyContent: "flex-start",


    // shadowColor: "rgba(0, 0, 0, 1)",
    // shadowOffset: {
    //   width: 0,
    //   height: 20,
    // },
    // shadowRadius: 40,
    // shadowOpacity: 1,
    paddingVertical: 20,

  },
  scrollContainer: {
    // flexDirection: "row",
    justifyContent: "space-between",

  },

  searchInput: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    height: 40,
    borderBottomColor: "rgba(255,255,255,.5)",
    borderBottomWidth: 1,
    marginBottom: 25,
  },


};
