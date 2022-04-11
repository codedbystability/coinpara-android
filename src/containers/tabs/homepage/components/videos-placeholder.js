import React from "react";
import { ActivityIndicator, View } from "react-native";

const VideosPlaceholder = () => {
  return (
    <View style={{
      height: 120,
      width: "100%",
      justifyContent: "center",
    }}>
      <ActivityIndicator />
    </View>
  );
};


export default React.memo(VideosPlaceholder);
