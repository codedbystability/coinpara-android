import React from "react";
import { Text, View } from "react-native";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { useSelector } from "react-redux";
import TinyImage from "../../../tiny-image";

const EmptyContainer = ({ text = "", style = null, icon = "empty-coins" }) => {

  const { activeTheme } = useSelector(state => state.globalReducer);
  return (
    <View style={[{
      flex: 1,
      minHeight: DIMENSIONS.SCREEN_HEIGHT / 3,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 100,
    }, style ? style : { paddingTop: 0 }]}>

      <TinyImage parent={"rest/"}
                 name={icon}
                 style={{
                   width: 38,
                   height: 32,
                 }} />

      <Text style={{
        fontFamily: "CircularStd-Book",
        fontSize: DIMENSIONS.TITLE_FONTSIZE + 2,
        textAlign: "center",
        color: activeTheme.secondaryText,
        marginTop: 24,
        paddingHorizontal: DIMENSIONS.PADDING_BH,
      }}>
        {text}
      </Text>
    </View>
  );

};

export default EmptyContainer;
