import React, { useEffect, useState } from "react";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../../utils/dimensions";
import { WebView } from "react-native-webview";
import { View } from "react-native";
import { rgbaToHex } from "../../../helpers/color-helper";
import { useSelector } from "react-redux";

const BASE_CHART_URL = "https://fullchart.coinpara.com/";

const TradeChart = ({ to, fs, gd, cp }) => {

  const { activeTheme } = useSelector(state => state.globalReducer);
  const [chartURL, setChartURL] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (gd) {
      const LineColor = parseFloat(cp) >= 0 ? rgbaToHex(activeTheme.changeGreen) : rgbaToHex(activeTheme.changeRed);
      setIsLoaded(false);
      setChartURL(BASE_CHART_URL + "?type=area"
        + "&mg=" + gd
        + "&from=" + fs
        + "&to=" + to
        + "&interval=60"
        + "&bgColor=" + rgbaToHex(activeTheme.backgroundApp)
        + "&txtColor=" + rgbaToHex(activeTheme.appWhite)
        + "&vLineColor=" + rgbaToHex(activeTheme.backgroundApp)
        + "&hLineColor=" + rgbaToHex(activeTheme.backgroundApp)
        + "&areaLineColor=" + LineColor
        + "&areaLineWidth=1"
        + "&priceBorderColor=transparent"
        + "&timeBorderColor=transparent"
        // + "&areaFillTopColor=1184e8"
        + "&areaFillTopColor=" + LineColor
        + "&areaFillBottomColor=" + rgbaToHex(activeTheme.backgroundApp)
        // + "&areaFillBottomColor=" + rgbaToHex(activeTheme.backgroundApp)
        // + "&areaFillBottomColor=transparent"
        + "&timeVisible=false"
        + "&priceVisible=false"
        + "&priceLineVisible=false"
        + "&showVolumes=false"
        + "&isFixed=true",
      );
    }
  }, [gd, activeTheme]);

  return (
    <View style={{
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT / 4,
      overflow: "hidden",
    }}>
      <WebView
        style={{
          opacity: isLoaded ? 1 : 0,
        }}
        androidLayerType={"software"}
        onError={() => setIsLoaded(false)}
        onLoadEnd={() =>
          setTimeout(() => {
            setIsLoaded(true);
          }, 500)
        }
        source={{
          uri: chartURL,
        }}
        scrollEnabled={false}


        originWhitelist={["*"]}
        allowFileAccess={true}
        domStorageEnabled={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}

      />
    </View>
  );


};


const areEqual = (prevMovie, nextMovie) => prevMovie.gd === nextMovie.gd;

export default React.memo(TradeChart, areEqual);
