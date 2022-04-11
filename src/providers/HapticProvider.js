import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};

const trigger = () => ReactNativeHapticFeedback.trigger("impactLight", options);

export default {
  trigger,
};
