import React from "react";
import QRCode from "react-native-qrcode-svg";
import { useSelector } from "react-redux";


const QrResult = props => {
  const { activeTheme, activeThemeKey } = useSelector(state => state.globalReducer);

  const { value, size } = props;

  return (
    <QRCode
      value={value}
      logo={{
        uri: "https://images.coinpara.com/files/mobile-assets/logo.png",
      }}
      color={activeThemeKey === "light" ? "#000" : activeTheme.darkBackground}
      logoBackgroundColor={activeThemeKey === "light" ? "#000" : activeTheme.activeListBg}
      logoBorderRadius={2}
      size={size}
      logoMargin={0}
    />
  );

};


export default React.memo(QrResult);
