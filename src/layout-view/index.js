import React from "react";
import { Image, ImageBackground, Text } from "react-native";
import { MIDDLE_IMAGE } from "../../utils/dimensions";


const LayoutView = () => {

  return (
    <ImageBackground
      source={{
        uri: "https://images.coinpara.com/files/mobile-slider/classic-bg1.jpg",
      }}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Image
        source={{
          uri: "https://images.coinpara.com/files/mobile-assets/logo.png",
        }}
        style={{
          width: MIDDLE_IMAGE * 2,
          height: MIDDLE_IMAGE * 2,
          tintColor: "#fff",
          marginBottom: 40,
        }}
        resizeMode={"contain"} />

      <Text style={{
        fontFamily: "CircularStd-Bold",
        fontSize: 24,
        color: "#fff",
      }}>
        CoinPara
      </Text>

    </ImageBackground>
  );

};

export default LayoutView;
