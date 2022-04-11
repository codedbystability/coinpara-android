import React from "react";
import { ActivityIndicator, View } from "react-native";


const PlLoading = ({ height }) => {
  return(
    <View style={{
      height: height,
      width: "100%",
      justifyContent: "center",
    }}>
      <ActivityIndicator />
    </View>
  )
}

export default React.memo(PlLoading)
