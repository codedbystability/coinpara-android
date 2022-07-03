import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";
import PulseAnimation from "../pulse";


const Loading = () => {

  // const { activeTheme } = useSelector(state => state.globalReducer);
  return (
    <View style={
      {
        flex: 1,
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
      }
    }>
      {/*<ActivityIndicator color={activeTheme.secondaryText} />*/}
      <PulseAnimation />

    </View>
  );
};


export default React.memo(Loading);
