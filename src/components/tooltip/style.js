import { StyleSheet } from "react-native";

export const STEP_NUMBER_RADIUS = 14;
export const STEP_NUMBER_DIAMETER = STEP_NUMBER_RADIUS * 2;
export const ZINDEX = 100;
export const MARGIN = 13;
export const ARROW_SIZE = 6;

export default StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: ZINDEX,
  },
  arrow: {
    position: "absolute",
    borderColor: "transparent",
    borderWidth: ARROW_SIZE,
  },
  tooltip: {
    position: "absolute",
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 3,
    overflow: "hidden",
  },
  tooltipText: {
    color: "#fff",
  },
  tooltipContainer: {
    flex: 1,
  },
  stepNumberContainer: {
    position: "absolute",
    width: STEP_NUMBER_DIAMETER,
    height: STEP_NUMBER_DIAMETER,
    overflow: "hidden",
    zIndex: ZINDEX + 1,
  },
  stepNumber: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: STEP_NUMBER_RADIUS,
    borderColor: "#FFFFFF",
    backgroundColor: "red",
  },
  stepNumberText: {
    fontSize: 10,
    backgroundColor: "transparent",
    color: "#FFFFFF",
  },
  button: {
    padding: 10,
  },
  buttonText: {
    color: "rgba(255,255,255,.5)",
    fontFamily: "CircularStd-Book",
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  bottomBar: {
    marginTop: 10,
    flexDirection: "row",
    // justifyContent: "flex-end",
  },
  overlayRectangle: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,1)",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  overlayContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
});
