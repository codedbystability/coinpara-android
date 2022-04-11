import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

import { formatBytes } from "../../helpers/math-helper";
import NImage from "../image/index.tsx";
import { SCREEN_WIDTH } from "../../../utils/dimensions";
import TinyImage from "../../tiny-image";


const UploadedValidItem = ({ uploadedImage, imageKey, onClear, showCancel = true }) => {
  return (
    <View>
      <NImage
        useFastImage={true}
        source={{ uri: uploadedImage.uri }} style={styles.image} resizeMode={"contain"} />

      <Text style={styles.size}>{formatBytes(uploadedImage.size)}</Text>

      {
        showCancel && <TouchableOpacity
          onPress={() => onClear(imageKey)}
          activeOpacity={1}
          style={[styles.dismissButton, {
            left: SCREEN_WIDTH / 2 - 60 + (uploadedImage.width / 2),
          }]}>
          <TinyImage parent={"rest/"} name={"cancel"} style={styles.icon} />
        </TouchableOpacity>
      }

    </View>
  );
};


const styles = StyleSheet.create({
  image: {
    height: 160,
    width: "auto",
    marginTop: 20,
  },

  dismissButton: {
    fontFamily: "CircularStd-Bold",
    color: "#fff",
    position: "absolute",
    top: 5,
    height: 36,
    width: 36,
    borderRadius: 14,
    backgroundColor: "rgba(255,72,72,.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  size: {
    textAlign: "center",
    marginTop: 10,
    color: "#707a81",
    fontFamily: "CircularStd-Bold",
  },
  icon: {
    width: 14,
    height: 14,
  },
});

export default UploadedValidItem;
