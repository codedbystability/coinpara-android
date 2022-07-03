import React from "react";
import { Pressable, Text } from "react-native";
import TinyImage from "../../../tiny-image";
import Linking from "../../../providers/Linking";
import { version, build } from "../../../../package.json";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { useSelector } from "react-redux";

const StillLogo = () => {

  const { activeTheme } = useSelector(state => state.globalReducer);
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

      <Text style={{
        fontSize: 12,
        marginTop: DIMENSIONS.PADDING_H,
        color: activeTheme.secondaryText,
      }}>
        {version}  ({build})
      </Text>
    </Pressable>
  );

};

export default React.memo(StillLogo);
