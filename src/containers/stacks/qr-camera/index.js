import React from "react";
import { View } from "react-native";
import { RNCamera } from "react-native-camera";
import { DIMENSIONS } from "../../../../utils/dimensions";

const CAM_VIEW_HEIGHT = DIMENSIONS.SCREEN_WIDTH * 1.5;
const CAM_VIEW_WIDTH = DIMENSIONS.SCREEN_WIDTH;

const leftMargin = 100;
const topMargin = 50;
const frameWidth = 200;
const frameHeight = 250;

const scanAreaX = leftMargin / CAM_VIEW_HEIGHT;
const scanAreaY = topMargin / CAM_VIEW_WIDTH;
const scanAreaWidth = frameWidth / CAM_VIEW_HEIGHT;
const scanAreaHeight = frameHeight / CAM_VIEW_WIDTH;


const QrCamera = (props) => {
  return (
    <RNCamera
      autoFocus={true}
      captureAudio={false}
      barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
      type={RNCamera.Constants.Type.back}
      flashMode={RNCamera.Constants.FlashMode.off}
      rectOfInterest={{
        x: scanAreaX,
        y: scanAreaY,
        width: scanAreaWidth,
        height: scanAreaHeight,
      }}
      // cameraViewDimensions={{
      //   width: CAM_VIEW_WIDTH,
      //   height: CAM_VIEW_HEIGHT,
      // }}
    >
      <View
        style={{
          position: "absolute",
          left: scanAreaX,
          top: scanAreaY,
          width: scanAreaWidth,
          height: scanAreaHeight,
          borderWidth: 2,
          borderColor: "yellow",
          opacity: 0.5,
        }}
      />
    </RNCamera>
  );
};

export default QrCamera;
