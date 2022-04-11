import React from "react";
import NImage from "../image/index.tsx";
import { useSelector } from "react-redux";

const DynamicImage = ({ market, style, forcedColor = null }) => {

  const { iconColor } = useSelector(state => state.globalReducer);

  const color = forcedColor || iconColor;
  if (!market) {
    return null;
  }
  const uri = "https://images.coinpara.com/files/coins/64/" + color + "/" + market.toLowerCase() + ".png";
  return (

    <NImage
      style={style}
      source={{
        uri: uri,
      }}
      useFastImage={true}
    />

  );

};

export default React.memo(DynamicImage);
