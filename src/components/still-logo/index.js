import React from "react";
import { Pressable, View } from "react-native";
import TinyImage from "../../tiny-image";
import Linking from "../../providers/Linking";


const StillLogo = () => {

  const handleNav = () => {
    Linking.openURL("https://ornek.com/");
  };
  return (
    <Pressable
      onPress={handleNav}
      style={{ alignItems: "center", justifyContent: "center", marginBottom: 26, marginTop: 54 }}>

      <TinyImage parent={"rest/"} name={"ornek-logo"} style={{
        width: 34,
        height: 26,
      }} />
    </Pressable>
  );

};

export default React.memo(StillLogo);
