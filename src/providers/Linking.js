import { Linking } from "react-native";

const openURL = (url) => {
  return Linking.canOpenURL(url).then(supported => {
    supported && Linking.openURL(url);
  }, (err) => console.log(err));
};

export default {
  openURL,
};
