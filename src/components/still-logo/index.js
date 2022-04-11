import React from "react";
import { View } from "react-native";
import TinyImage from "../../tiny-image";


const StillLogo = () => {
  return (
    <View
      style={{ alignItems: "center", justifyContent: "center", marginBottom: 26, marginTop: 54 }}>

      <TinyImage parent={"rest/"} name={"ornek-logo"} style={{
        width: 34,
        height: 26,
      }} />
    </View>
  );

};

export default React.memo(StillLogo);
