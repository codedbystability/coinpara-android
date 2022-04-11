import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import Loading from "../components/loading";


const styledHigherOrderComponents = WrappedComponent => props => {
  const { activeTheme } = useSelector(state => state.globalReducer);
  if (!activeTheme || !activeTheme.backgroundApp) {
    return <Loading />;
  }
  return (
    <View style={{ flex: 1, paddingTop: 0, backgroundColor: activeTheme.backgroundApp }}>
      <WrappedComponent {...props} />
    </View>
  );
};

export default styledHigherOrderComponents;
