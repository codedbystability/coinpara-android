import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";
import WebView from "react-native-webview";
import { SCREEN_WIDTH } from "../../../../../utils/dimensions";
import { rgbaToHex } from "../../../../helpers/color-helper";
import { useSelector } from "react-redux";

const BASE_CHART_URL = "https://fullchart.coinpara.com/";
// const BASE_CHART_URL = "http://localhost:3000/";
const MarketDetailChart = ({
                             type = "candle",
                             market = {},
                             interval = "15",//15 MIN DEFAULT
                             full = false,
                           }) => {

  const [url, setUrl] = useState("");
  const [loaded, setLoaded] = useState(false);
  const { activeTheme, activeUserColors, activeThemeKey } = useSelector(state => state.globalReducer);
  const lineColor = activeThemeKey === "dark" ? "ffffff11" : activeThemeKey === "light" ? "00000003" : "0114ff11";

  const [colors, setColors] = useState({
    green: "rgb(255,255,255)",
    red: "rgb(255,255,255)",
  });

  useEffect(() => {
    if (activeUserColors && Object.keys(activeUserColors).length >= 1) {
      setColors({
        green: activeUserColors.bidText,
        red: activeUserColors.askText,
      });
    } else {
      setColors({
        green: activeTheme.changeGreen,
        red: activeTheme.changeRed,
      });
    }
  }, [activeUserColors, activeTheme]);


  useEffect(() => {
    setUrl(BASE_CHART_URL
      + "?type=" + type
      + "&mg=" + market.gd
      + "&from=" + market.fs
      + "&to=" + market.to
      + "&interval=" + interval
      + "&bgColor=" + rgbaToHex(activeTheme.backgroundApp)
      + "&txtColor=" + rgbaToHex(activeTheme.appWhite)
      + "&upCandleColor=" + rgbaToHex(colors.green)
      + "&downCandleColor=" + rgbaToHex(colors.red)
      + "&volumeRed=" + rgbaToHex(colors.green)
      + "&volumeGreen=" + rgbaToHex(colors.red)
      + "&vLineColor=" + lineColor
      + "&hLineColor=" + lineColor
      + "&priceBorderColor=" + lineColor
      + "&timeBorderColor=" + lineColor
      + "&areaFillTopColor=2195fa"
      + "&areaFillBottomColor=" + lineColor
      // + "&areaLineColor=" + rgbaToHex(activeTheme.borderGray)
      // + "&priceBorderColor=" + rgbaToHex(activeTheme.appWhite)
      + "&priceColor=" + lineColor,
    );
  }, [type, market, interval, colors]);


  if (!url) {
    return null;
  }

  if (full) {
    return (
      <WebView
        style={styles(activeTheme).webviewF}
        source={{ uri: url }}
        originWhitelist={["*"]}
      />
    );
  }

  return (
    <View style={styles(activeTheme).chartContainer}>
      <WebView
        onLoadEnd={() => setLoaded(true)}
        style={styles(activeTheme).webview}
        source={{ uri: url }}
        originWhitelist={["*"]}
      />
      {
        !loaded && <View style={styles(activeTheme).loading}>
          <ActivityIndicator color={activeTheme.secondaryText} />
        </View>
      }
    </View>
  );
};

export default React.memo(MarketDetailChart, (props, nextProps) => {
  if (
    props.type === nextProps.type &&
    props.interval === nextProps.interval &&
    props.market.gd === nextProps.market.gd
    // props.market.from === nextProps.market.from &&
    // props.market.to === nextProps.market.to
  ) {
    return true;
  }

});

const styles = (props) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
  },
  chartContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  webview: {
    height: "100%", width: SCREEN_WIDTH, flex: 1, backgroundColor: "transparent",
  },

  webviewF: {
    flexL: 1,
  },

  contentContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  scrollViewContainer: {
    paddingBottom: 120,
  },


  headerRightWrapper: {
    position: "absolute",
    right: 10,
    bottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    paddingHorizontal: 6,
    flexDirection: "row",
    width: 70,
    // paddingVertical: 4,
  },

  loading: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
});
