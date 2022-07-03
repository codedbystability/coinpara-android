import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { MIDDLE_IMAGE, NORMAL_FONTSIZE, PADDING_H, TITLE_FONTSIZE } from "../../../../utils/dimensions";
import NImage from "../../../components/page-components/image/index.tsx";
import NoWifi from "../../../../assets/no-wifi.png";

const NoConnection = props => {

  const { activeTheme } = useSelector(state => state.globalReducer);

  const handleCheckConnection = () => null;

  return (
    <View style={[styles(activeTheme).modal]}>


      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <NImage
          useFastImage={true}
          source={NoWifi}
          style={{ width: MIDDLE_IMAGE, height: MIDDLE_IMAGE, tintColor: activeTheme.appWhite, marginBottom: 40 }}
          resizeMode={"contain"} />


        <Text style={styles(activeTheme).modalText}>
          Bağlatı Hatası
        </Text>

        <Text style={styles(activeTheme).modalTextD}>
          Lütfen internetinizi kontrol ederek yeniden deneyiniz.
        </Text>
      </View>


      <TouchableOpacity
        activeOpacity={.8}
        style={styles(activeTheme).button}
        onPress={handleCheckConnection}>

        <Text style={[styles(activeTheme).text]}>Yenile</Text>

      </TouchableOpacity>

    </View>
  );

};

export default React.memo(NoConnection);


const styles = props => StyleSheet.create({
  modal: {
    backgroundColor: props.darkBackground,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    flex: 1,
    paddingHorizontal: PADDING_H,
  },
  modalText: {
    fontSize: TITLE_FONTSIZE,
    color: props.appWhite,
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "CircularStd-Book",
    padding: PADDING_H,
  },
  modalTextD: {
    fontSize: NORMAL_FONTSIZE,
    color: "#bdbdbd",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "CircularStd-Book",
    padding: PADDING_H,
  },
  button: {
    position: "absolute",
    bottom: 20,
    paddingVertical: 12,
    marginVertical: 4,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: props.actionColor,
  },
  text: {
    fontFamily: "CircularStd-Book",
    fontSize: TITLE_FONTSIZE,
    color: props.appWhite,
  },
  cancel: {
    fontFamily: "CircularStd-Book",
    fontSize: TITLE_FONTSIZE,
    color: props.noRed,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
  },

});
