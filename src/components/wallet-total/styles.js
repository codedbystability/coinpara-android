import { StyleSheet } from "react-native";
import {
  BIG_TITLE_FONTSIZE,
  NORMAL_FONTSIZE,
  PADDING_H,
  SCREEN_WIDTH,
  SQUARE_IMAGE,
  TITLE_FONTSIZE,
} from "../../../utils/dimensions";

const styles = (props, fontSizes) => StyleSheet.create({
  wrapper: {
    marginTop: PADDING_H,
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingVertical: 10,
    paddingHorizontal: PADDING_H,
  },
  nameText: {
    fontFamily: "CircularStd-Bold",
    fontSize: fontSizes?.BIG_TITLE_FONTSIZE,
    color: props.appWhite,

  },
  infoTab: {
    width: "100%",
    height: 66,
    // paddingVertical: PADDING_V,
    paddingHorizontal: PADDING_H,
  },

  infoTabContainer: {
    width: "100%",
    overflow: "hidden",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: props.actionColor,
    backgroundColor: "#0B3EB2",
    // borderWidth: 1,
    // borderColor: props.borderGray,
    borderRadius: 8,
    paddingHorizontal: PADDING_H,
  },
  amount: {
    fontFamily: "CircularStd-Bold",
    fontSize: fontSizes?.BIG_TITLE_FONTSIZE + 2,
    color: "#fff",

  },
  smallText: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.TITLE_FONTSIZE,
    color: props.appWhite,
  },

  smallText2: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.NORMAL_FONTSIZE,
    color: props.appWhite,
  },
  smallTextUSDT: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.TITLE_FONTSIZE,
    color: "#0B3EB2",
  },

  // SHORTCUTS
  container: {
    alignItems: "center",
    // paddingHorizontal: PADDING_H,
    marginTop: 8,
  },
  shortcutWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  listImage: {
    height: 24,
    width: 24,
    marginRight: 10,
  },
  title: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.TITLE_FONTSIZE,
    color: props.appWhite,
  },
  list: {
    // marginTop: 10,
    // alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "red",
    // paddingTop: 10,
  },
  listContainer: {
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "red",
  },
  item: {
    backgroundColor: props.darkBackground,
    width: (SCREEN_WIDTH - (PADDING_H * 2 + 24)) / 5,
    height: (SCREEN_WIDTH - (PADDING_H * 2 + 36)) / 5,
    paddingVertical: 4,

    // height: 70,
    // paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "space-around",
    marginRight: 6,
    marginVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: props.borderGray,
    paddingHorizontal: 2,

  },
  image: {
    width: SQUARE_IMAGE,
    height: SQUARE_IMAGE,
    marginBottom: 10,
  },
  text: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.NORMAL_FONTSIZE - 2,
    textAlign: "center",
    color: props.appWhite,
    marginTop: 4,
  },

  shadow: {
    // shadowColor: props.borderGray,
    // shadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
    // shadowRadius: 2,
    // elevation: 2,
    // shadowOpacity: 1,
  },
  annWrapper: {
    paddingHorizontal: PADDING_H,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 8,
    maxHeight: 80,
    height: 80,

  },
  annIcon: { marginRight: 4, width: "10%" },
  txtA: {
    fontSize: fontSizes?.TITLE_FONTSIZE,
    color: props.appWhite,
    fontFamily: "CircularStd-Book",
    width: "99%",
    maxWidth: "99%",
  },
  icon: {
    position: "absolute",
    top: 0,
    right: 0,
    height: 20,
    width: 18,
    backgroundColor: props.activeListBg,
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottomLeftRadius: 50,
    paddingTop: 4,
    paddingLeft: 2,
  },
  wrapper2: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tl: {
    width: 80,
    borderRadius: 12,
    backgroundColor: "#0B3EB2",
    // marginRight: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: props.secondaryText,
  },
  tlText: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.TITLE_FONTSIZE - 2,
    textAlign: "center",
    color: "#fff",
  },
  usd: {
    width: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 2,
    marginTop: 8,
    backgroundColor: props.actionColor,

  },

  c1: {
    position: "absolute",
    left: -40,
    top: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: .3,
    borderColor: props.secondaryText,
  },
  c2: {
    position: "absolute",
    right: 60,
    top: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: props.secondaryText,
    zIndex: 0,
  },
  c3: {
    position: "absolute",
    right: -20,
    bottom: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: .8,
    borderColor: props.secondaryText,
  },
  arr: { flexDirection: "row", padding: 10 },
  bttns: {
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ind: {},
  eye: {
    width: 16,
    height: 16,
  },
  eye2: {
    width: 12,
    height: 12,
  },
  icn: {
    width: 22,
    height: 22,
  },
});

export default styles;
