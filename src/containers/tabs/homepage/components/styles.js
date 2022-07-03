import { StyleSheet } from "react-native";
import { DIMENSIONS } from "../../../../../utils/dimensions";

const styles = (props, fontSizes) => StyleSheet.create({
  wrapper: {
    height: 120,
    // marginBottom: DIMENSIONS.MARGIN_T / 2,
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 0,
    paddingHorizontal: DIMENSIONS.PADDING_H,
  },
  nameText: {
    fontFamily: "CircularStd-Bold",
    fontSize: DIMENSIONS.BIG_TITLE_FONTSIZE,
    color: props.appWhite,
    paddingRight: DIMENSIONS.PADDING_H,
    textAlign: "right",
  },
  infoTab: {
    width: "100%",
    height: 100,
    paddingVertical: DIMENSIONS.PADDING_V,
    paddingHorizontal: DIMENSIONS.PADDING_H,
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
    paddingHorizontal: DIMENSIONS.PADDING_H,
    paddingVertical: DIMENSIONS.PADDING_V,
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
    // paddingHorizontal: DIMENSIONS.PADDING_H,
    marginTop: DIMENSIONS.MARGIN_T / 2,
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
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
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
    width: (DIMENSIONS.SCREEN_WIDTH - (DIMENSIONS.PADDING_H * 2 + (DIMENSIONS.PADDING_H * 2))) / 5,
    height: (DIMENSIONS.SCREEN_WIDTH - (DIMENSIONS.PADDING_H * 2 + (DIMENSIONS.PADDING_H * 6))) / 5,
    // paddingVertical: 4,
    alignItems: "center",
    justifyContent: "space-around",
    marginRight: 4,
    marginVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 2,
  },
  image: {
    width: DIMENSIONS.SQUARE_IMAGE,
    height: DIMENSIONS.SQUARE_IMAGE,
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
    paddingHorizontal: DIMENSIONS.PADDING_H,
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
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
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
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 4,
    paddingLeft: 2,

  },
  img: {
    width: 24,
    height: 24,
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
