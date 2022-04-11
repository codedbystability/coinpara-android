import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Defs, Rect, LinearGradient, Stop } from "react-native-svg";
import { useSelector } from "react-redux";


const LinearBackground = ({ children }) => {
  const { activeTheme } = useSelector(state => state.globalReducer);
  return (
    <View style={{ flex: 1 }}>
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <LinearGradient id="grad" x1="100%" y1="80%" x2="50%" y2="50%">
            <Stop offset="0" stopColor={activeTheme.darkBackground} />
            <Stop offset="1" stopColor={activeTheme.backgroundApp} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grad)" />
      </Svg>
      {children}
    </View>
  );
};

export default React.memo(LinearBackground);
