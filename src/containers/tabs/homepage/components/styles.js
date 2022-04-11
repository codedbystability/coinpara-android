import { Dimensions, StyleSheet } from "react-native";
import {
  BIG_TITLE_FONTSIZE, LIST_ITEM_HEIGHT, MARGIN_T,
  NORMAL_FONTSIZE,
  PADDING_H, PADDING_V, SCREEN_WIDTH,
  SQUARE_IMAGE,
  SQUARE_ITEM_HEIGHT,
  TITLE_FONTSIZE,
} from "../../../../../utils/dimensions";

const styles = (props, fontSizes) => StyleSheet.create({
  wrapper: {
    height: 120,
    marginBottom: MARGIN_T / 2,
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: PADDING_H,
  },
  nameText: {
    fontFamily: "CircularStd-Bold",
    fontSize: BIG_TITLE_FONTSIZE,
    color: props.appWhite,
  },
  infoTab: {
    width: "100%",
    height: 100,
    paddingVertical: PADDING_V,
    paddingHorizontal: PADDING_H,
  },

  infoTabContainer: {
    width: "100%",

    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: props.darkBackground,
    // backgroundColor: 'red',
    borderRadius: 8,
    // paddingHorizontal: 16,
    paddingHorizontal: PADDING_H,
    paddingVertical: PADDING_V,
    // paddingVertical: 8,
    borderWidth: 1,
    borderColor: props.borderGray,
  },
  amount: {
    fontFamily: "CircularStd-Bold",
    fontSize: 19,
    color: props.appWhite,
    marginRight: 16,
    lineHeight: 30,

  },
  smallText: {
    fontFamily: "CircularStd-Book",
    fontSize: 12,
    color: props.appWhite,
    lineHeight: 30,

  },


  // SHORTCUTS
  container: {
    alignItems: "center",
    // paddingHorizontal: PADDING_H,
    marginTop: MARGIN_T / 2,
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
    fontSize: TITLE_FONTSIZE,
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
    width: (SCREEN_WIDTH - (PADDING_H * 2 + (PADDING_H * 2))) / 5,
    height: (SCREEN_WIDTH - (PADDING_H * 2 + (PADDING_H * 6))) / 5,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "space-around",
    marginRight: 4,
    marginVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: props.borderGray,
    // width: (SCREEN_WIDTH - (PADDING_H * 2 + (PADDING_H * 4))) / 5,
    // height: (SCREEN_WIDTH - (PADDING_H * 2 + (PADDING_H * 6))) / 5,
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
    maxHeight: 50,
    height: 50,

  },
  annIcon: { marginRight: 4, width: "10%" },
  txtA: {
    fontSize: TITLE_FONTSIZE,
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
    backgroundColor: props.borderGray,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 4,
    paddingLeft: 2,

  },
  img: {
    width: 20,
    height: 20,
  },
  imgH: {
    width: 22,
    height: 22,
  },
  arr: {
    width: 12,
    height: 12,
  },
  iconA: {
    width: 24,
    height: 28,
  },
});

export default styles;
