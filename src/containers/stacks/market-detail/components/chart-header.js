import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { DIMENSIONS } from "../../../../../utils/dimensions";
import { useSelector } from "react-redux";
import { formatMoney, nFormatter } from "../../../../helpers/math-helper";
import { getLang } from "../../../../helpers/array-helper";

const titles = [
  {
    id: 1,
    key: "bid",
    title: "HIGH",
    value: "latestBidHd",
    class: "green",
  },
  {
    id: 2,
    key: "ask",
    title: "LOW",
    value: "latestAskLd",
    class: "red",
  },
  {
    id: 3,
    key: "volume",
    title: "VOLUME",
    value: "vd",
    class: "white",
    isM: false,
  },
];

const ChartHeader2 = ({ precision, gd }) => {

  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const { marketsWithKey, marketCount, latestTicker } = useSelector(state => state.marketReducer);
  const [market, setMarket] = useState({});

  useEffect(() => {
    setMarket(marketsWithKey[gd]);
  }, [marketCount]);


  const getAvailable = (type = "latestBidHd") => {
    let val;
    if (type === "latestBidHd") {
      val = Math.max(market.hd, latestTicker["ov"]);
    } else if (type === "vd") {
      val = market["vd"];
      return nFormatter(val, precision);
    } else {
      val = Math.min(market.ld, latestTicker["ov"]);
    }

    return formatMoney(val, precision);
  };

  if (!market || Object.keys(market).length <= 0) {
    return null;
  }

  return (
    <View style={styles(activeTheme).wrapper}>

      <View style={styles(activeTheme).container}>
        {
          Object.keys(latestTicker).length >= 1 && <Text
            style={styles(activeTheme).pr}>{formatMoney(latestTicker.ov, precision)}</Text>

        }

        <View style={{ flexDirection: "row" }}>
          <Text
            style={[styles(activeTheme).cd, { color: parseFloat(market.cp) >= 0 ? activeTheme.bidText : activeTheme.askText }]}>{market.cp.toFixed(2)} %</Text>

          {/*<Text style={styles(activeTheme).cdb}>{formattedNumber(market.cd, market.fs, precision)}</Text>*/}
          <Text style={styles(activeTheme).cdb}> {
            market.cd.toFixed(2)
          }</Text>
        </View>

      </View>

      <View style={styles(activeTheme).inner2}>

        <View style={styles(activeTheme).inner} />
        {
          Object.keys(latestTicker).length <= 0 ?
            <ActivityIndicator color={activeTheme.appWhite} /> : titles.map(item => (
              <View
                key={item.id}
                style={styles(activeTheme).itm}>
                <Text style={styles(activeTheme).title}>{getLang(language, item.title)}</Text>
                <Text style={[styles(activeTheme).val, {
                  color: item.class === "green" ? activeTheme.bidText : item.class === "red" ? activeTheme.askText : activeTheme.appWhite,
                }]}>{getAvailable(item.value)}</Text>
              </View>
            ))
        }


      </View>

    </View>
  );
};

export default React.memo(ChartHeader2);
const styles = (props) => StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "20%",
    flexDirection: "row",
    backgroundColor: props.backgroundApp,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  container: {
    height: "100%",
    width: "50%",
    justifyContent: "space-around",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cd: {
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
    marginRight: 20,
  },
  pr: {
    fontSize: DIMENSIONS.BIG_TITLE_FONTSIZE + 4,
    color: props.appWhite,
    fontFamily: "CircularStd-Bold",
  },
  cdb: {
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    color: props.appWhite,
    fontFamily: "CircularStd-Bold",
  },
  inner: {
    position: "absolute",
    left: 0,
    height: "90%",
    width: 1,
    borderRadius: 8,
    top: "20%",
    backgroundColor: props.borderGray,
  },
  inner2: {
    height: "100%",
    width: "50%",
    justifyContent: "space-around",
    paddingVertical: 8,
    paddingHorizontal: 12,
    padding: 20,
  },
  title: {
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    color: props.secondaryText,
    fontFamily: "CircularStd-Book",
    textAlign: "left",
  },
  val: {
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
  },
  itm: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

});
