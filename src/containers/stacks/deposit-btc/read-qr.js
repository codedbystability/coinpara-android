import React from "react";
import {
  StyleSheet, Text, View,
} from "react-native";
import { useSelector } from "react-redux";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { getLang } from "../../../helpers/array-helper";
import QrResult from "../../../components/page-components/qr-result";

const QrCreateModalize = (props) => {

  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const { qrValue } = props;

  if (!qrValue) {
    return null;
  }
  return (
    <View style={styles(activeTheme).content}>
      <Text style={styles(activeTheme).title}>{getLang(language, "WALLET_QR_TITLE")}</Text>
      <QrResult value={qrValue} size={(DIMENSIONS.SCREEN_WIDTH / 1.2) - (DIMENSIONS.PADDING_H * 2)} />
    </View>

  );
};
export default QrCreateModalize;

const styles = (props) => StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: DIMENSIONS.PADDING_H,
    // paddingVertical: 60,
    backgroundColor: props.darkBackground,
  },
  title: {
    position: "absolute",
    top: DIMENSIONS.MARGIN_T * 2,
    fontFamily: "CircularStd-Bold",
    fontSize: DIMENSIONS.BIG_TITLE_FONTSIZE + 2,
    lineHeight: 30,
    color: props.appWhite,
    marginVertical: DIMENSIONS.MARGIN_T,
    paddingHorizontal: DIMENSIONS.PADDING_H,
    textAlign: "center",
  },
});
