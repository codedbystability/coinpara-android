/**
 * @format
 */
import "react-native-gesture-handler";
import {AppRegistry, LogBox, Text} from "react-native";
import App from "./App";
import {name as appName} from "./app.json";


LogBox.ignoreAllLogs();
AppRegistry.registerComponent(appName, () => App);

console.log = () => {
}

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
