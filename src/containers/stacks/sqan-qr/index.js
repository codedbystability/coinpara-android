import React, { useCallback, useEffect, useState } from "react";
import { RNCamera } from "react-native-camera";
import { useSelector } from "react-redux";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  Linking,
} from "react-native";
import userServices from "../../../services/user-services";
import DropdownAlert from "../../../providers/DropdownAlert";
import { getLang } from "../../../helpers/array-helper";
import { navigationRef } from "../../../providers/RootNavigation";
import ActionSheetComProvider from "../../../providers/ActionSheetComProvider";
import { MARGIN_T, MIDDLE_IMAGE, PADDING_H, SCREEN_WIDTH } from "../../../../utils/dimensions";
import ScanQrSvg from "../../../components/page-components/svg-icons/ScanQrSvg";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import NImage from "../../../components/image/index.tsx";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import CustomButton from "../../../components/button";
import TinyImage from "../../../tiny-image";

const ScanScreen2 = (props) => {

  const { isComp, onQrRead, onHide } = props;
  const { isFetching, language, activeTheme } = useSelector(state => state.globalReducer);

  const [barcode, setBarcode] = useState("");
  const [svgH, setSvgH] = useState(260);

  const onBarCodeRead = (barcode) => !isFetching && setBarcode(barcode.data);

  useEffect(() => {
    if (barcode) {
      if (!isComp) {
        DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "QR_SCANNED"));

        ActionSheetComProvider.show({
          title: getLang(language, "DO_YOU_WANT_TO_APPROVE_LOGIN"),
          options: [getLang(language, "OK"), getLang(language, "CANCEL")],
          onAction: (index) => handleQrLogin(index),
        });
      } else {
        onQrRead(barcode);
      }
    }
  }, [barcode]);

  const handleQrLogin = (index) => {
    if (index !== 0)
      return null;


    userServices.checkForQr(barcode).then((response) => {
      if (response && response.IsSuccess) {
        DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "LOGGED_IN_SUCCESSFULLY"));
        navigationRef.current.goBack();
      } else {
        DropdownAlert.show("error", getLang(language, "ERROR"), getLang(language, "AN_UNKNOWN_ERROR_OCCURED"));
      }
    });
  };

  const [widthTouch, setWidthTouch] = useState(1);
  const [xTouch, setXTouch] = useState(1);
  const [yTouch, setYTouch] = useState(1);
  const [heightTouch, setHeightTouch] = useState(1);
  const [flash, setFlash] = useState(RNCamera.Constants.FlashMode.off);

  const handleFlash = () => setFlash(flash === RNCamera.Constants.FlashMode.torch ? RNCamera.Constants.FlashMode.off : RNCamera.Constants.FlashMode.torch);

  const onCameraReady = () => console.log("onCameraReady");
  const onMountError = () => console.log("onMountError");
  const goBack = () => isComp ? onHide() : navigationRef.current.canGoBack() && navigationRef.current.goBack();


  const handleNavigationSettings = useCallback(async () => await Linking.openSettings(), []);
  return (
    <View style={styles.container}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setHeightTouch(height);
            setWidthTouch(width);
          }}
          onTouchStart={(e) => {
            const { pageY, pageX } = e.nativeEvent;
            setXTouch(pageX);
            setYTouch(pageY);
          }}>

      <RNCamera
        style={styles.cameraView}
        captureAudio={false}
        // barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
        onCameraReady={onCameraReady}
        onMountError={onMountError}

        type={RNCamera.Constants.Type.back}
        flashMode={flash}
        onBarCodeRead={onBarCodeRead}
        autoFocusPointOfInterest={{ x: xTouch / widthTouch, y: yTouch / heightTouch }}
        notAuthorizedView={

          <>

            <TabNavigationHeader
              {...props}
              backAble={true}
              options={{ title: "" }}
            />

            <View style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: activeTheme.darkBackground,
              paddingHorizontal: PADDING_H,
            }}>

              <NImage
                useFastImage={true}
                source={{ uri: "https://images.coinpara.com/files/mobile-assets/warning.png" }}
                style={[styles.warn, {
                  tintColor: activeTheme.appWhite,
                }]}
                resizeMode={"contain"} />


              <Text style={{
                fontSize: 22,
                fontFamily: "CircularStd-Bold",
                color: activeTheme.appWhite,
              }}>{getLang(language, "CAMERA_IS_NOT_ALLOWED")}</Text>


              <Text style={[styles.notA, {
                color: activeTheme.appWhite,
              }]}>{getLang(language, "CAMERA_IS_NOT_ALLOWED_DESC")}</Text>


              <CustomButton text={getLang(language, "OPEN_SETTINGS")} filled={true} isRadius={true}
                            onPress={handleNavigationSettings}
                            style={{
                              marginTop: 20,
                              backgroundColor: activeTheme.actionColor,
                            }} />

            </View>
          </>

        }

      >

        <View style={styles.maskOutter}>
          <View style={[{ flex: maskColWidth }, styles.maskRow, styles.maskFrame, {}]} />
          <View style={[{ flex: maskColWidth }, styles.maskCenter]}>
            <View style={[{ width: maskColWidth }, styles.maskFrame, {}]} />

            <View
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                setSvgH(height);
              }}
              style={styles.maskInner}>
              <ScanQrSvg height={svgH} />
            </View>

            <View style={[{ width: maskColWidth }, styles.maskFrame, {}]} />
          </View>
          <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame, {}]} />
        </View>

        <View style={styles.titleW}>
          <Text style={styles.titleWw}>
            {getLang(language, "QR_LOGIN_TITLE")}
          </Text>
        </View>


        <Pressable
          onPress={handleFlash}
          style={[styles.flash, {
            backgroundColor: flash === RNCamera.Constants.FlashMode.torch ? "rgba(255,255,255,.6)" : "rgba(255,255,255,.3)",
          }]}>
          <TinyImage parent={"rest/"} name={"flash"} style={styles.icon} />
        </Pressable>


        <Pressable style={styles.dismissButton} onPress={goBack}>
          <TinyImage parent={"rest/"} name={"cancel"} style={styles.icon} />
        </Pressable>

      </RNCamera>
    </View>
  );
};

const ScanScreen = styledHigherOrderComponents(ScanScreen2);
export default ScanScreen;


const maskRowHeight = 180;
const maskColWidth = 180;
const ww = SCREEN_WIDTH * 0.1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraView: {
    flex: 1,
    justifyContent: "flex-start",
  },
  maskOutter: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  maskInner: {
    width: 260,
    backgroundColor: "transparent",
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  maskFrame: {
    backgroundColor: "rgba(1,1,1,0.5)",
    height: "100%",
    width: "100%",
  },
  maskRow: {
    width: "100%",
  },
  maskCenter: { flexDirection: "row", borderRadius: 40 },


  titleW: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: maskRowHeight / 2,
    paddingHorizontal: PADDING_H,
  },
  titleWw: {
    color: "#fff",
    fontFamily: "CircularStd-Bold",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 12,
  },
  titleWww: {
    color: "rgba(255,255,255,.5)",
    fontFamily: "CircularStd-Book",
    textAlign: "center",
    fontSize: 16,
  },
  titleW2: {
    color: "#fff",
    fontFamily: "CircularStd-Bold",
    fontSize: 24,
  },
  flash: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: maskRowHeight - 60,
    left: SCREEN_WIDTH / 2 - 30,
    width: 60,
    height: 60,
    borderRadius: 30,

  },
  x: { fontSize: 18, fontFamily: "CircularStd-Bold", color: "#fff" },
  dismissButton: {
    fontFamily: "CircularStd-Bold",
    color: "#fff",
    position: "absolute",
    bottom: 50,
    width: ww,
    height: ww,
    borderRadius: ww / 2,
    left: "45%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999999,
    // backgroundColor:'red'
  },
  icon: {
    width: 20,
    height: 28,
  },
  warn: {
    width: MIDDLE_IMAGE,
    height: MIDDLE_IMAGE,
    marginBottom: MARGIN_T,
  },
  notA: {
    fontSize: 14,
    fontFamily: "CircularStd-Book",
    marginVertical: PADDING_H,
    textAlign: "center",
  },
});
