import * as React from "react";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import constantServices from "../services/constant-services";
import {setLanguages} from "../actions/language-actions";
import {
    Keyboard, NativeModules,
    StatusBar,
    StyleSheet,
    View,
} from "react-native";
import {
    setActiveTheme,
    setClassicColors, setColorOption, setCompanyInfo, setFontSize,
    setIsConnectedWifi, setKeyboardShown,
    setLanguage, setLanguageKeys, setMarketDetailCoinList, updateLanguage,
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
import Intercom, {Visibility} from "@intercom/intercom-react-native";
import * as NetInfo from "@react-native-community/netinfo";
import {getLang} from "../helpers/array-helper";
import GeneralModal from "../components/shell-components/Modal/GeneralModal";
import marketServices from "../services/market-services";
import {setCoins} from "../actions/market-actions";
import RNBootSplash from "react-native-bootsplash";
import NoConnection from "../containers/stacks/no-connection";
import {navigationRef} from "../providers/RootNavigation";
import {NavigationContainer} from "@react-navigation/native";
import {isIphoneX} from "../../utils/devices";
import RegisterAdditional from "../containers/stacks/register/register-additional";


const StackNavigator = () => {

    const dispatch = useDispatch();
    const {language, activeTheme, activeThemeKey, isError, isConnectedWifi} = useSelector(state => state.globalReducer);
    const [isInit, setIsInit] = useState(false);
    const [walkThroughSeen, setWalkThroughSeen] = useState(null);

    const getUserLanguage = () => {
        let storedLanguage = LocalStorage.getItem("language");
        if (storedLanguage) {
            return storedLanguage;
        }

        // const deviceLanguage = NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0]; //iOS 13
        const deviceLanguage = NativeModules.I18nManager.localeIdentifier; // TODO ANDROID

        return deviceLanguage.includes("US") ? "en-US" : "tr-TR";
    };

    useEffect(() => {

        // LocalStorage.clearAll();
        const walkThrough = LocalStorage.getItem("walkThroughSeen");
        setWalkThroughSeen(walkThrough !== null);
    }, []);

    useEffect(() => {
        if (walkThroughSeen !== null) {
            setIsInit(true);
        }
    }, [walkThroughSeen]);

    useEffect(() => {
        if (isInit) {
            const unsubscribe = NetInfo.addEventListener(state => dispatch(setIsConnectedWifi(state.isConnected)));

            if (LocalStorage.getItem("userIdle")) {
                IdleTimerManager.setIdleTimerDisabled(true);
            }
            Intercom.setLauncherVisibility(Visibility.GONE).then(null);
            Orientation.lockToPortrait();


            const setCompanyInfoInit = () => {
                const companyInfo = LocalStorage.getObject("companyInfo");

                //COMPANY INFO LOGIC !
                if (companyInfo) {
                    // console.log("DONT FETCH COMPANY INFO");
                    dispatch(setCompanyInfo(companyInfo));
                } else {
                    generalServices.getCompanyInfo().then((response) => {
                        // console.log("FETCH COMPANY INFO");
                        if (response.IsSuccess) {
                            dispatch(setCompanyInfo(response.Data));
                        }
                    });
                }
            };

            const setLanguagesInit = (userLanguageSlug) => {
                const languages = LocalStorage.getObject("languages");

                if (languages && false) {
                    // console.log("DONT FETCH  languages");
                    dispatch(setLanguages(languages));
                } else {
                    // console.log("FETCH  languages");
                    constantServices.getLanguages(false).then((response) => {
                        if (response && response.IsSuccess) {
                            const activeLanguage = response.Data.find(item => item.ISO === userLanguageSlug);
                            const data = {
                                languages: response.Data,
                                activeLanguage: activeLanguage,
                                languageContent: [],
                            };
                            LocalStorage.setObject("languages", data);
                            dispatch(setLanguages(data));
                        }
                    });

                }
            };

            const setLanguageContentInit = (userLanguageSlug) => {

                const theLanguage = LocalStorage.getObject("theLanguage");
                // const selectedLanguageL = LocalStorage.getObject("selectedLanguageL");
                // const selectedLangL = LocalStorage.getObject("selectedLangL");
                if (theLanguage && false) {
                    console.log("DONT FETCN LANGUAGE CONTENT");
                    // dispatch(updateLanguage(theLanguage, selectedLanguageL));
                    dispatch(setLanguageKeys(theLanguage));

                } else {
                    console.log(" FETCN LANGUAGE CONTENT");
                    generalServices.getLanguageContent(userLanguageSlug, false).then((response) => {
                        if (response && response.IsSuccess) {
                            LocalStorage.setObject("theLanguage", response.Data);
                            dispatch(setLanguage(response.Data));
                        }
                    });
                }

            };

            const setColorsInit = () => {

                const classicColors = LocalStorage.getObject("classicColorsL");
                const classicColorsIcon = LocalStorage.getItem("classicColorsIcon");
                let activeThemeKey = LocalStorage.getItem("activeTheme");

                if (activeThemeKey) {
                    dispatch(setActiveTheme(activeThemeKey));
                } else {
                    activeThemeKey = "classic";
                }


                if (classicColors && classicColorsIcon) {
                    // console.log("DONT FETCH  classicColors");
                    dispatch(setClassicColors(classicColors, classicColorsIcon));
                } else {
                    console.log("FETCH  classicColors");
                    generalServices.getColors(activeThemeKey, false).then((response) => {
                        LocalStorage.setObject("classicColorsL", response.IsSuccess ? response.Data : []);
                        LocalStorage.setItem("classicColorsIcon", response.IsSuccess ? response.IconColor : "white");
                        dispatch(setClassicColors(response.IsSuccess ? response.Data : [], response.IsSuccess ? response.IconColor : "white"));
                    });
                }
            };


            const setSystemOption = () => {
                const fontSize = LocalStorage.getItem("FONT_SIZE", 13);
                dispatch(setFontSize(parseInt(fontSize)));

                const colorOption = LocalStorage.getItem("COLOR_OPTION", "SYSTEM");
                dispatch(setColorOption(colorOption));
            };

            const setMarketCoinsInit = () => {
                const listCoins = LocalStorage.getObject("LIST_COINS");

                if (listCoins) {
                    // console.log("DONT FETCH setMarketCoinsInit");
                    dispatch(setCoins(listCoins));
                } else {
                    // console.log(" FETCH setMarketCoinsInit");
                    marketServices.getListCoins(false).then((response) => {
                        if (response && response.IsSuccess) {
                            LocalStorage.setObject("LIST_COINS", response.Data);
                            dispatch(setCoins(response.Data));
                        }
                    });
                }
            };

            const setCoinsInit = () => {
                const listCoins = LocalStorage.getObject("LIST_COINS_MARKET");

                if (listCoins) {
                    // console.log("DONT FETCH setCoinsInit");
                    dispatch(setMarketDetailCoinList(listCoins));
                } else {
                    // console.log(" FETCH setCoinsInit");
                    marketServices.getCoins(false).then((response) => {
                        if (response && response.IsSuccess) {
                            LocalStorage.setObject("LIST_COINS_MARKET", response.Data);
                            dispatch(setMarketDetailCoinList(response.Data));
                        }
                    });
                }
            };

            const init = async () => {
                let userLanguageSlug = getUserLanguage();

                setCompanyInfoInit();
                setLanguagesInit(userLanguageSlug);
                setLanguageContentInit(userLanguageSlug);
                setColorsInit();
                setSystemOption();
                setMarketCoinsInit();
                setCoinsInit();

                // set a cookie
                const newCookie = {
                    name: "myCookie",
                    value: "myValue",
                    domain: ".coinpara.com",
                    path: "/",
                    version: "1",
                    expires: "2015-05-30T12:30:00.00-05:00",
                };


                // 'headers' is iterable
                const get_set_cookies = function (headers) {
                    const startKEY = "deepProvider=";
                    const val = headers["set-cookie"][0];

                    const deepProvider = val.substring(
                        val.indexOf(startKEY) + startKEY.length,
                        val.indexOf(";"),
                    );

                    const decodedURL = decodeURIComponent(deepProvider);
                    const url = new URL(decodedURL);

                    let regex = /[?&]([^=#]+)=([^&#]*)/g,
                        params = {},
                        match;
                    while (match = regex.exec(url)) {
                        params[match[1]] = match[2];
                    }

                    return {...params, deepProvider: decodedURL};
                };

                // axios.get("http://localhost:3000/", {
                //   withCredentials: true,
                // })
                //   .then(response => {
                //
                //     const set_cookies = get_set_cookies(response.headers);
                //     console.log("set_cookies - ", set_cookies);
                //   });


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
            init().then(() => setTimeout(() => RNBootSplash.hide({fade: true}), 200));
        }
    }, [isInit]);

    if (!isConnectedWifi) {
        return <NoConnection/>;
    }

    if (isError) {
        return <ErrorScreen text={getLang(language, "SERVER_IS_BUSY", "-")}/>;
    }

    if (walkThroughSeen === null) {
        return <Loading/>;
    }


    // return <StoreHelpRequestScreen />;
    // return <SupportRequest />;

    // return <Loading/>
    return (
        <NavigationContainer theme={MyTheme} ref={navigationRef}>

            <View style={styles(activeTheme).wrapper}>
                <StatusBar
                    hidden={!isIphoneX}
                    barStyle={activeThemeKey === "light" ? "dark-content" : "light-content"}
                    showHideTransition={"slide"}
                    translucent={true} backgroundColor="transparent"/>

                <MainNavigator walkThroughSeen={walkThroughSeen}/>

                <GeneralModal/>
            </View>

            <ActionSheetComp/>
            <Loading/>
            <DropdownAlert/>

        </NavigationContainer>
    );
};
export default StackNavigator;

const styles = (props) => StyleSheet.create({
    wrapper: {flex: 1, backgroundColor: props.darkBackground},
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
        height: 90,
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




