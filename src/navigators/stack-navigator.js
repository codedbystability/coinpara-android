import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import constantServices from "../services/constant-services";
import { setLanguages } from "../actions/language-actions";
import {
  Keyboard,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import {
  setActiveTheme,
  setClassicColors, setColorOption, setCompanyInfo, setFontSize,
  setIsConnectedWifi, setKeyboardShown,
  setLanguage, setMarketDetailCoinList,
} from "../actions/global-actions";
import generalServices from "../services/general-services";
import ErrorScreen from "../containers/stacks/error";
import DropdownAlert from "../components/shell-components/DropdownAlert/DropdownAlert";
import ActionSheetComp from "../components/shell-components/ActionSheet/ActionSheetComp";
import Loading from "../components/shell-components/Loading/Loading";
import LocalStorage from "../providers/LocalStorage";
import MainNavigator from "./main-navigatior";
import Orientation from "react-native-orientation";
import IdleTimerManager from "react-native-idle-timer";
import Intercom, { Visibility } from "@intercom/intercom-react-native";
import * as NetInfo from "@react-native-community/netinfo";
import { getLang } from "../helpers/array-helper";
import GeneralModal from "../components/shell-components/Modal/GeneralModal";
import marketServices from "../services/market-services";
import { setCoins } from "../actions/market-actions";
import RNBootSplash from "react-native-bootsplash";
import NoConnection from "../containers/stacks/no-connection";
import { navigationRef } from "../providers/RootNavigation";
import { NavigationContainer } from "@react-navigation/native";


const StackNavigator = () => {

  const dispatch = useDispatch();
  const { language, activeTheme, isError, isConnectedWifi } = useSelector(state => state.globalReducer);
  const [isInit, setIsInit] = useState(false);
  const [walkThroughSeen, setWalkThroughSeen] = useState(null);

  const getUserLanguage = () => {
    let storedLanguage = LocalStorage.getItem("language");
    if (storedLanguage) {
      return storedLanguage;
    }

    return "tr-TR"; // default
  };

  useEffect(() => {
    const walkThrough = LocalStorage.getItem("walkThroughSeen");
    setWalkThroughSeen(walkThrough !== null);
    setIsInit(true);
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => dispatch(setIsConnectedWifi(state.isConnected)));

    if (LocalStorage.getItem("userIdle")) {
      IdleTimerManager.setIdleTimerDisabled(true);
    }
    Intercom.setLauncherVisibility(Visibility.GONE).then(null);
    Orientation.lockToPortrait();
    const init = async () => {

      let activeThemeKey = LocalStorage.getItem("activeTheme");
      const fontSize = LocalStorage.getItem("FONT_SIZE", 13);

      dispatch(setFontSize(parseInt(fontSize)));

      let userLanguageSlug = getUserLanguage();

      if (activeThemeKey) {
        dispatch(setActiveTheme(activeThemeKey));
      } else {
        activeThemeKey = "classic";
      }

      generalServices.getCompanyInfo().then((response) => {
        if (response.IsSuccess) {
          dispatch(setCompanyInfo(response.Data));
        }
      });

      generalServices.getColors(activeThemeKey, false).then((response) => {
        dispatch(setClassicColors(response.IsSuccess ? response.Data : [], response.IsSuccess ? response.IconColor : "white"));
      });

      constantServices.getLanguages(false).then((response) => {
        if (response && response.IsSuccess) {
          const activeLanguage = response.Data.find(item => item.ISO === userLanguageSlug);
          const data = {
            languages: response.Data,
            activeLanguage: activeLanguage,
            languageContent: [],
          };
          dispatch(setLanguages(data));
        }
      });

      generalServices.getLanguageContent(userLanguageSlug, false).then((response) => {
        if (response && response.IsSuccess) {
          dispatch(setLanguage(response.Data));
        }
      });


      marketServices.getCoins(false).then((response) => {
        if (response && response.IsSuccess) {
          dispatch(setMarketDetailCoinList(response.Data));
        }
      });

      marketServices.getListCoins(false).then((response) => {
        if (response && response.IsSuccess) {
          dispatch(setCoins(response.Data));
        }
      });

      const colorOption = LocalStorage.getItem("COLOR_OPTION", "SYSTEM");
      dispatch(setColorOption(colorOption));

      const keyboardShownListener = Keyboard.addListener("keyboardWillShow", () => dispatch(setKeyboardShown(true)));
      const keyboardHiddenListener = Keyboard.addListener("keyboardWillHide", () => dispatch(setKeyboardShown(false)));

      return () => {
        let userIdle = LocalStorage.getItem("userIdle");
        if (userIdle) {
          IdleTimerManager.setIdleTimerDisabled(false);
        }
        unsubscribe();
        keyboardHiddenListener.remove();
        keyboardShownListener.remove();
      };
    };

    init().then(() => setTimeout(() => RNBootSplash.hide({ fade: true }), 2000));
  }, [isInit]);

  if (!isConnectedWifi) {
    return <NoConnection />;
  }

  if (isError) {
    return <ErrorScreen text={getLang(language, "SERVER_IS_BUSY", "-")} />;
  }

  if (walkThroughSeen === null) {
    return <Loading />;
  }

  // return <Loading/>
  return (
    <NavigationContainer theme={MyTheme} ref={navigationRef}>

      <View style={styles(activeTheme).wrapper}>
        <StatusBar hidden={false} translucent={true} backgroundColor="transparent" />

        <MainNavigator walkThroughSeen={walkThroughSeen} />

        <GeneralModal />
      </View>

      <ActionSheetComp />
      <Loading />
      <DropdownAlert />

    </NavigationContainer>
  );
};
export default StackNavigator;

const styles = (props) => StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: props.darkBackground },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: props.backgroundApp,
  },
  text: {
    fontSize: 24,
    fontWeight: "700",
    margin: 20,
    lineHeight: 30,
    color: "#333",
    textAlign: "center",
  },
  bootsplash: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: props.darkBackground,
  },
  logo: {
    height: 89,
    width: 100,
    tintColor: props.appWhite,
  },
});
const MyTheme = {
  dark: false,
  colors: {
    background: "rgb(31,31,31)",
  },
};




