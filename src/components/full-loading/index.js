import React from "react";
import styledHigherOrderComponents from "../../hocs/styledHigherOrderComponents";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";


const FullLoading = (props) => {

  const { activeTheme } = useSelector(state => state.globalReducer);

  return <View style={{
    flex: 1,
    backgroundColor: activeTheme.darkBackground,
    alignItems: "center",
    justifyContent: "center",
  }}>
    <ActivityIndicator />
  </View>;

};

export default FullLoading;
