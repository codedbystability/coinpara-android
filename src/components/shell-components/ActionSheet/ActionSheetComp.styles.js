import { StyleSheet } from "react-native";
import { isIphoneX } from "../../../../utils/devices";
import { BIG_TITLE_FONTSIZE, PADDING_H, TITLE_FONTSIZE } from "../../../../utils/dimensions";

const styles = (props) => StyleSheet.create({
  modal: {
    backgroundColor: props.backgroundApp,
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    paddingBottom: isIphoneX ? 40 : 20,
    paddingHorizontal: PADDING_H * 2,
    zIndex: 9999,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,

  },
  modalTitle: {
    fontSize: 22,
    fontFamily: "CircularStd-Bold",
  },
  modalText: {
    fontSize: BIG_TITLE_FONTSIZE + 2,
    color: props.appWhite,
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "CircularStd-Bold",
    paddingVertical: 30,

  },
  button: {
    paddingVertical: 16,
    marginVertical: 4,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    borderColor: "#bdbdbd",
    backgroundColor: props.darkBackground,


  },
  text: {
    fontFamily: "CircularStd-Bold",
    fontSize: TITLE_FONTSIZE,
    color: props.appWhite,
  },
  cancel: {
    fontFamily: "CircularStd-Bold",
    fontSize: TITLE_FONTSIZE,
    color: props.noRed,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
  },
  wrap: {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
    zIndex: 99999999,
  },
});
export default styles;
