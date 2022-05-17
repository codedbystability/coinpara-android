import { StyleSheet } from "react-native";
import {
  BIG_TITLE_FONTSIZE, LIST_ITEM_HEIGHT, NORMAL_FONTSIZE,
  PADDING_H,
  PADDING_V,
  SCREEN_HEIGHT, SCREEN_WIDTH,
  SUBTITLE_FONTSIZE,
} from "../../../../utils/dimensions";

const styles = (props, fontSizes) => StyleSheet.create({
  container: {
    paddingTop: 12,
  },
  modalStyle: {
    backgroundColor: "rgb(21,52,76)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0)",
  },
  absoluteHeader: {
    position: "static",
    marginVertical: 12,
  },

  rightContainer: {
    width: "30%",
    alignItems: "flex-end",
  },

  headerRightWrapper: {
    position: "absolute",
    right: 10,
    bottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "rgba(255,255,255,.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  contentContainer: {
    backgroundColor: "#071a27",
  },
  itemContainer: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#4e5c66",
  },
  itemLeftContainer: {
    width: "30%",
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    marginLeft: -5,
    width: 30,
    height: 30,
    marginRight: 10,
  },
  marketTitle: {
    textAlign: "left",
    fontFamily: "CircularStd-Bold",
    fontSize: fontSizes?.SUBTITLE_FONTSIZE,
  },
  marketDesc: {
    textAlign: "left",
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.SUBTITLE_FONTSIZE,
  },
  centerContainer: {
    width: "30%",
    alignItems: "center",
  },
  price: {
    textAlign: "right",
    fontFamily: "CircularStd-Bold",
    fontSize: fontSizes?.SUBTITLE_FONTSIZE,
    color: "#ffffff",
  },


  sheetBG: {
    borderRadius: 30,
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: props.darkBackground,
    paddingHorizontal: PADDING_H,
    overflow: "hidden",
    zIndex: 9999999999,
  },
  sheetHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  sheetTitle: {
    fontFamily: "CircularStd-Bold",
    fontSize: fontSizes?.BIG_TITLE_FONTSIZE,
    letterSpacing: 0,
    color: props.appWhite,
  },
  sheetSmallPrice: {
    borderWidth: 1,
    borderRadius: 16,
    width: "40%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 2,
  },
  activeSmallPrice: {
    borderColor: props.borderGray,
    backgroundColor: props.actionColor,
    borderWidth: 1,
    borderRadius: 16,
    width: "40%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 2,
  },
  smallPriceText: {
    fontFamily: "CircularStd-Bold",
    fontSize: fontSizes?.SUBTITLE_FONTSIZE,
    letterSpacing: 0,
    color: props.secondaryText,
    marginRight: 6,

  },
  sheetSortWrapper: {
    width: "100%",
    alignItems: "center",
    backgroundColor: props.backgroundApp,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 8,
    marginBottom: 8,
    paddingVertical: PADDING_V,
    paddingHorizontal: PADDING_H,
  },

  sheetSortItem: {
    width: "30%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },

  sheetSortTitle: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.SUBTITLE_FONTSIZE - 1,
    letterSpacing: 0,
    color: props.secondaryText,
  },

  searchContainer: {
    height: 40,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: props.backgroundApp,
    marginBottom: 10,
  },
  input: {
    height: "100%",
    backgroundColor: props.backgroundApp,
    borderRadius: 8,
    paddingHorizontal: 0,
    paddingVertical: 8,
    flex: 1,
    color: "#8a96a6",
    alignSelf: "stretch",
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
  },

  searchIcon: { paddingHorizontal: 10 },

  shadow: {},
  overlayStyle: {
    backgroundColor: "rgba(0,0,0,.4)",
  },

  head: {
    backgroundColor: props.actionColor,
    paddingVertical: PADDING_V * 2,
    paddingHorizontal: PADDING_H * 2,
    justifyContent: "space-between",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: "row",
    borderTopWidth: 10,
    borderBottomWidth: 1,
    borderBottomColor: props.actionColor,
    borderTopColor: props.actionColor,
  },
  headTitle: {
    color: props.buttonWhite,
    fontFamily: "CircularStd-Bold",
    fontSize: fontSizes?.BIG_TITLE_FONTSIZE,
  },
  wrap: {

    backgroundColor: props.darkBackground,
    minHeight: SCREEN_HEIGHT / 1.6,
    height: SCREEN_HEIGHT / 1.6,
  },
  wrap1: {
    width: SCREEN_WIDTH,
    paddingVertical: PADDING_H * 2,
  },
  cont: {
    backgroundColor: props.rowBlue,
    paddingHorizontal: PADDING_H,
    height: SCREEN_HEIGHT / 1.5,
  },
  left:{
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 20,
  },
  icon: {
    width: 16,
    height: 16,
  },
  mainI: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  icon2: {
    height: 12,
    width: 12,
  },
  load: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: SCREEN_WIDTH,
    zIndex: 9999,
  },
  loadL: {
    position: "absolute",
    bottom: SCREEN_HEIGHT / 4,
    left: 0,
    width: SCREEN_WIDTH,
    zIndex: 9999,
    backgroundColor: "red",
  },
  wrap3: { flex: 1, backgroundColor: props.backgroundApp, paddingTop: PADDING_H },

  actionText: {
    fontFamily: "CircularStd-Book",
    color: props.buttonWhite,
    fontSize: NORMAL_FONTSIZE,
    marginTop: 6,
    textAlign: "center",
    width: 80,
  },
  actionCon: {
    // alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    height: LIST_ITEM_HEIGHT,
    // paddingLeft: 30,
  },
});

export default styles;
