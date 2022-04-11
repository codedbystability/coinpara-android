import { StyleSheet, Platform } from "react-native";

const zIndexWorkaround = Platform.select({
  ios: { zIndex: 9999 },
  android: { elevation: 9999 },
});

export default StyleSheet.create({
  loadingView: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: "100%",
    // borderRadius: 12,
    backgroundColor: "#00000070",
    alignItems: "center",
    justifyContent: "center",
    ...zIndexWorkaround,
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: 100,
    height: 100,
  },
});
