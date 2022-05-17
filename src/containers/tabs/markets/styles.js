import { StyleSheet } from "react-native";
import {
  BIG_TITLE_FONTSIZE,
  LIST_ITEM_HEIGHT,
  NORMAL_FONTSIZE,
  NORMAL_IMAGE,
  PADDING_H,
  TITLE_FONTSIZE,
} from "../../../../utils/dimensions";

const styles = (props, fontSizes) => StyleSheet.create({
  rightActionEvenWrapper: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99999999,
  },

  evenContainer: {
    width: "100%",
    backgroundColor: props.darkBackground,
    borderBottomWidth: 1,
    borderBottomColor: props.borderGray,
    flexDirection: "row",
    paddingHorizontal: PADDING_H / 2,
    height: LIST_ITEM_HEIGHT,
  },
  oddContainer: {
    width: "100%",
    backgroundColor: "transparent",
    flexDirection: "row",
    paddingHorizontal: PADDING_H,
    height: LIST_ITEM_HEIGHT,
  },
  leftWrapper: {
    height: "100%",
    width: "35%",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 20,
  },
  leftWrapperContainer: {
    marginRight: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  image: {
    width: NORMAL_IMAGE,
    height: NORMAL_IMAGE,
  },
  title: {
    color: props.appWhite,
    fontSize: fontSizes?.TITLE_FONTSIZE ,
    fontFamily: "CircularStd-Bold",

  },
  description: {
    color: props.secondaryText,
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.SUBTITLE_FONTSIZE,

  },
  middleWrapper: {
    top: "5%",
    height: "90%",
    width: "35%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    zIndex: 0.5,

  },

  middleWrapperFake: {
    position: "absolute",
    left: 0,
    backgroundColor: "transparent",
    height: "100%",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    zIndex: 999999999,
  },
  rightWrapper: {
    height: "100%",
    width: "30%",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 0,
  },
  negative: {
    color: props.changeRed, //   for red
    fontSize: fontSizes?.SUBTITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
    textAlign: "right",
    marginTop: 4,
  },
  positive: {
    color: props.changeGreen,
    fontSize: fontSizes?.SUBTITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
    textAlign: "right",
    marginTop: 4,
  },
  newWrapper: {
    marginRight: 2,
    borderWidth: 1,
    borderColor: props.borderGray,
    backgroundColor: props.changeGreen,
    height: 8,
    width: 8,
    borderRadius: 4,
    position: "absolute",
    top: -10,
    left: 0,
  },
  newText: {
    fontFamily: "CircularStd-Bold",
    fontSize: 10,
    color: props.changeGreen,
  },
  icon: {
    width: 22,
    height: 22,
  },
});

export default styles;
