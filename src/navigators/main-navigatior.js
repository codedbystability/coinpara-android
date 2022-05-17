import React, { useEffect, useRef, useState } from "react";
import {
  AppState,
  Platform,
  DeviceEventEmitter,
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
} from "react-native";
import { HubConnectionBuilder, JsonHubProtocol, LogLevel } from "@microsoft/signalr";
import { useDispatch, useSelector } from "react-redux";
import BackgroundTimer from "react-native-background-timer";
import ReactNativeBiometrics from "react-native-biometrics";
import moment from "moment";

import LocalStorage from "../providers/LocalStorage";
import { getLang } from "../helpers/array-helper";
import ModalProvider from "../providers/ModalProvider";
import LockScreen from "../containers/stacks/lock-screen";
import userServices from "../services/user-services";
import { setNonUser, setUser } from "../actions/auth-actions";
import store from "../reducers/createReducers";
import { setConnection } from "../actions/global-actions";
import { setMarkets, updateMarkets } from "../actions/market-actions";
import { setWallets, updateWallet } from "../actions/wallet-actions";
import DropdownAlert from "../providers/DropdownAlert";
import AppStateLayout from "./layout";
import fcmServices from "../services/fcm-services";
import { navigationRef } from "../providers/RootNavigation";
import QuickActions from "react-native-quick-actions";
import TinyImage from "../tiny-image";
import { BIG_TITLE_FONTSIZE, PADDING_H, SCREEN_HEIGHT, TITLE_FONTSIZE } from "../../utils/dimensions";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "./drawer-content";
import { drawerItems } from "./stack-items";
import StackTabNav from "./tab-navigator";
import RegisterAdditional from "../containers/stacks/register/register-additional";
import DeviceProvider from "../providers/DeviceProvider";

const Drawer = createDrawerNavigator();

let subscription = null,
  timeoutId = null,
  notifies = [],
  storedMarkets = [],
  connectionG = null,
  myInterval = null,
  userGuid = null,
  intervalId = null,
  MARKET_COUNT = 0,
  SECONDS_TO_WAIT = 60,
  shouldReConnect = false,
  QUICK_ACTIONS_AUTH = [
    {
      type: "AccountInformation", // Required
      title: "Profilim", // Optional, if empty, `type` will be used instead
      subtitle: "Profilinizi görüntüleyin.",
      icon: "iuser", // Icons instructions below
      userInfo: {
        url: "app://profile", // Provide any custom data like deep linking URL
      },
    },
    {
      type: "Transfer",
      title: "Türk Lirası Yatır",
      subtitle: "Kolay ve Güvenilir TL Yatır.",
      icon: "tl",
      userInfo: {
        url: "app://deposit_tl",
      },
    },
    {
      type: "Wallet",
      title: "Varlıklarım",
      subtitle: "Varlıklarınızı görüntüleyin.",
      icon: "wallet",
      userInfo: {
        url: "app://wallet",
      },
    },


    {
      type: "ScanScreen",
      title: "QR Kod Tara",
      subtitle: "QR Kodu taratınız.",
      icon: "iqr",
      userInfo: {
        url: "app://qr",
      },
    },

  ];

const MainNavigator = ({ walkThroughSeen }) => {
  const dispatch = useDispatch();
  const { user, userToken } = useSelector(state => state.authenticationReducer);
  const { language, activeTheme, connection } = useSelector(state => state.globalReducer);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [faceIdModal, setFaceIdModal] = useState(false);
  const [navigationType, setNavigationType] = useState("");

  useEffect(() => {
    subscription = AppState.addEventListener("change", nextAppState => {

      if (nextAppState === "active") {
        const currentRoute = LocalStorage.getObject("currentRoute");

        if (appState.current.match(/inactive|background/)) {

          if (timeoutId) {
            BackgroundTimer.clearTimeout(timeoutId);
            BackgroundTimer.stop();
            timeoutId = null;
          }

          if (shouldReConnect) {
            shouldReConnect = false;
            if (!user.UserGuid && !userToken && !connection) {
              setupSignalRConnection(null, null).then(r => console.log("setupSignalRConnection"));
            } else if (user && user.UserGuid && !connection) {
              setupSignalRConnection(user.UserGuid, userToken).then(r => console.log("setupSignalRConnection"));
            }

            if (currentRoute && currentRoute.name && currentRoute.name !== navigationRef.current.getCurrentRoute().name) {
              LocalStorage.removeItem("currentRoute");

              setTimeout(() => {
                navigationRef.current.navigate(currentRoute.name, currentRoute.params);
              }, 2000);
            }

          }


          appState.current = nextAppState;
          setAppStateVisible(appState.current);


        }


      } else if (appState.current.match(/active|inactive/) && nextAppState === "background") {


        const route = navigationRef.current.getCurrentRoute();
        const item = {
          name: route.name,
          params: route.params,
        };
        LocalStorage.setObject("currentRoute", item);

        if (!timeoutId) {
          timeoutId = BackgroundTimer.setTimeout(() => {
            shouldReConnect = true;
            console.log("DISPATCH NULL");
            connection && connection.stop();
            dispatch(setConnection(null));
          }, SECONDS_TO_WAIT * 1000);
        }
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);

      return () => {
        subscription.remove();
      };

    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {


    if (userToken !== "null") {
      if (!user || (!user.UserGuid && (!userToken || userToken === "null"))) {
        fcmServices.register(onRegister, onNotification, onOpenNotification);
        setupSignalRConnection(null, null).then(r => null);
      } else if (user.UserGuid && user) {
        fcmServices.register(onRegister, onNotification, onOpenNotification);
        setupSignalRConnection(user.UserGuid, userToken).then(r => null);
      }

      QuickActions.popInitialAction()
        .then((data) => doSomethingWithTheAction(data, userToken))
        .catch(console.error);
      QuickActions.setShortcutItems(QUICK_ACTIONS_AUTH);


      const emitter = DeviceEventEmitter.addListener("quickActionShortcut", data => {
        // ON APP IN BACKGROUND STATE
        if (data && data.type) {
          handleQuickActionCase(data.type, "live", userToken);
        }
      });

      return () => {
        emitter?.remove();
      };
    }
  }, [user, userToken]);

  useEffect(() => {
    // LocalStorage.clearAll();

    const expireDate = LocalStorage.getItem("expireDate");
    const refreshToken = LocalStorage.getItem("refresh_token");
    if (intervalId) {
      BackgroundTimer.clearInterval(intervalId);
    }
    const storedLoginInstance = LocalStorage.getObject("storedLoginInstance");
    const localPasswordEnabled = LocalStorage.getItem("localPasswordEnabled");

    const nowUnix = moment().unix();
    if (storedLoginInstance && refreshToken && expireDate >= nowUnix && localPasswordEnabled === "true" && localPasswordEnabled) {
      setTimeout(() => checkForBiometrics(), 1500);
    } else if ((storedLoginInstance && refreshToken && expireDate >= nowUnix) && localPasswordEnabled === null) {
      onSuccessPasscode();
    } else {
      dispatch(setNonUser());
    }


  }, []);

  const handleQuickActionCase = (type, appState = "dead", userToken = null) => {

    if (appState === "live") {
      setTimeout(() => {
        if (!userToken) {
          const refreshToken = LocalStorage.getItem("refresh_token");
          if (intervalId) {
            BackgroundTimer.clearInterval(intervalId);
          }
          const storedLoginInstance = LocalStorage.getObject("storedLoginInstance");
          const localPasswordEnabled = LocalStorage.getItem("localPasswordEnabled");

          if (storedLoginInstance && refreshToken && localPasswordEnabled === "true" && localPasswordEnabled) {
            setNavigationType(type);
            setFaceIdModal(true);
          }


          // return navigationRef.current.navigate("LoginRegister");
        } else {
          // APP COMES FRONT FROM BACKGROUND STATE
          return navigationRef.current.navigate(type, type === "Transfer" ? {
            wallet: "TRY",
            transactionType: "deposit",
            coinType: "price",
          } : {});
        }

      }, 1000);
    } else {
      if (userToken) {
        return navigationRef.current.navigate(type, type === "Transfer" ? {
          wallet: "TRY",
          transactionType: "deposit",
          coinType: "price",
        } : {});
      } else {
        const refreshToken = LocalStorage.getItem("refresh_token");
        if (intervalId) {
          BackgroundTimer.clearInterval(intervalId);
        }
        const storedLoginInstance = LocalStorage.getObject("storedLoginInstance");
        const localPasswordEnabled = LocalStorage.getItem("localPasswordEnabled");

        // const nowUnix = moment().unix();
        if (storedLoginInstance && refreshToken && localPasswordEnabled === "true" && localPasswordEnabled) {
          setNavigationType(type);
          setFaceIdModal(true);
        }
      }
    }
  };

  const doSomethingWithTheAction = (data, userToken) => {
    if (data && data.type) {
      handleQuickActionCase(data.type, "dead", userToken);
    }
  };

  const setupSignalRConnection = async (gd, tkn) => {
    MARKET_COUNT = 0;
    try {
      connectionG = null;
      const connection =
        new HubConnectionBuilder()
          .withUrl("https://apiv2.coinpara.com/CoreHub", {
            accessTokenFactory: () => tkn,
          })
          .withAutomaticReconnect()
          .withHubProtocol(new JsonHubProtocol())
          .configureLogging(LogLevel.Critical)
          .build();

      connection.serverTimeoutInMilliseconds = 300000;
      connection.keepAliveIntervalInMilliseconds = 300000;

      connection.onclose(error => {
        if (AppState.currentState === "active") {
          setTimeout(() => setupSignalRConnection(userGuid ?? gd, userToken ?? tkn), 500);
        }
      });
      // connection.onreconnecting(error =>  dispatch(setConnection(null)));
      connection.onreconnected((connectionId) => console.log("Connection reestablished. Connected with connectionId", connectionId));

      await connection.start().then((result) => {
        dispatch(setConnection(connection));
        MARKET_COUNT = 0;
        connection.invoke("JoinMarketHubLiteGroupAsync", "marketSummary")
          .then(() => console.log("≠COREHUB- MARKETSUMMARY !"))
          .catch(err => console.log("COULD NOT JOIN MARKETSUMMARY - ", err));
      }); // TODO SET GLOBAL CONNECTION INSTANCE

      userGuid = gd;
      connectionG = connection;

      if (gd) {
        setForAuthUser(gd);
      }
      setListeners();
      return connection;
    } catch (err) {
      setTimeout(() => setupSignalRConnection(gd, tkn), 5000);
    }
  };

  const setListeners = () => {
    storedMarkets = [];

    if (myInterval) {
      BackgroundTimer.clearInterval(myInterval);
    }
    myInterval = BackgroundTimer.setInterval(() => {
      if (storedMarkets.length <= 0) {
        return;
      }
      store.dispatch(updateMarkets(storedMarkets));
      storedMarkets = [];
    }, 2500);

    connectionG.off("marketSummary");
    connectionG.on("marketSummary", (markets) => {
      if (MARKET_COUNT === 0 && markets.length >= 10) {
        MARKET_COUNT++;
        return dispatch(setMarkets(markets));
      }

      markets.map((newItem, _) => {

        const ifExist = storedMarkets.findIndex(mm => mm.gd === newItem.gd);
        if (ifExist !== -1) {
          storedMarkets[ifExist] = newItem;
        } else {
          storedMarkets.push(newItem);
        }
      });

    });

    connectionG.off("notifyWalletDashboard");
    connectionG.on("notifyWalletDashboard", (wallets) => dispatch(setWallets(wallets)));

    connectionG.off("notifyWalletDashboardUpdate");
    connectionG.on("notifyWalletDashboardUpdate", (wallets) => {
      // console.log("notifyWalletDashboardUpdate - ", wallets.length);
      wallets.map(wallet => dispatch(updateWallet(wallet)));
    });

    connectionG.off("sendNotSeenUserNotifications");
    connectionG.on("sendNotSeenUserNotifications", (items) => {
      items.map(itm => {
        if (!notifies.includes(itm.gd)) {
          notifies.push(itm.gd);
          DropdownAlert.show("info", getLang(language, "INFO"), itm.et);
        }
      });
    });

  };

  const setForAuthUser = (userGuid) => {
    if (userGuid) {
      // WALLET HUB
      connectionG.invoke("JoinUserWalletHubLiteGroupAsync", userGuid)
        .then(() => console.log("≠COREHUB- WALLET !"))
        .catch(err => console.log("COULD NOT JOIN WALLET HUB GROUP"));

      // NOTIFY HUB
      connectionG.invoke("JoinUserNotificationHubGroupAsync", userGuid)
        .then(() => console.log("≠COREHUB- JoinUserNotificationHubLiteGroupAsync !"))
        .catch(err => console.log("≠COREHUB- JoinUserNotificationHubLiteGroupAsync ! - ", err));
    }
  };

  const onNotification = () => console.log("onNotification");

  const onRegister = async (fcm) => {
    const deviceInfo = await DeviceProvider.getDeviceInfo();

    if (fcm) {
      const isUser = Object.keys(user).length >= 1;
      const fcmInstance = {
        fcmToken: fcm,//long-text
        userId: isUser ? user.Id : "",//integer-nullable -- our-system-user-id -> ex.= 60
        platform: Platform.OS,//string android-ios
        user: isUser ? user : null,
        deviceInfo: deviceInfo,
      };
      userServices.setDeviceToken(fcmInstance).then(r => null);
    }
  };

  const onOpenNotification = (data) => {
    setTimeout(() => {
      if (data && data.page) {
        if (data.authRequired && userToken) {
          if (data.page === "Announcements") {
            return navigationRef.current.navigate("Notifications", {
              type: "announcements",
            });
          }
          return navigationRef.current.navigate(data.page, {
            parity: data.parity,
            wallet: data.wallet,
            transactionType: data.transactionType,
          });
        } else {
          if (data.page === "Announcements") {
            return navigationRef.current.navigate("Notifications", {
              type: "announcements",
            });
          } else {
            return navigationRef.current.navigate(data.page, {
              parity: data.parity,
              wallet: data.wallet,
              transactionType: data.transactionType,
            });
          }
        }
      }
    }, 500);

  };

  const checkForBiometrics = () => {
    ReactNativeBiometrics.isSensorAvailable().then(({ available, biometryType }) => {
      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        promptBiometric(getLang(language, "TOUCH_ID_REQUIRED"));
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        promptBiometric(getLang(language, "FACE_ID_REQUIRED"));
      } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
        promptBiometric(getLang(language, "PASSCODE_REQUIRED"));
      } else {
        ModalProvider.show(<LockScreen onSuccess={onSuccessPasscode}
                                       isAuth={true}
                                       isCreate={false}
                                       isNew={false} onFail={onFailPasscode} />, false);
      }
    });
  };

  const promptBiometric = (title) => {
    ReactNativeBiometrics.simplePrompt({ promptMessage: title })
      .then((resultObject) => handleBiometricResult(resultObject))
      .catch(() => console.log("biometrics failed"));
  };

  const onFailPasscode = () => {
    dispatch(setNonUser());
    ModalProvider.hide();
  };

  const onSuccessPasscode = () => handleBiometricResult({ success: true });

  const handleBiometricResult = (result) => {
    //TODO CHANGE LOGIC !!!
    const localPasswordEnabled = LocalStorage.getItem("localPasswordEnabled");

    if (result.success) {
      userServices.token({
        grant_type: "refresh_token",
        refresh_token: LocalStorage.getItem("refresh_token"),
      }).then(response => {
        if (response && response.Id) {
          dispatch(setUser(response));
        }
      }).catch(err => console.log("err -> ", err));

      setTimeout(() => {
        if (navigationType) {
          return navigationRef.current.navigate(navigationType, navigationType === "Transfer" && {
            wallet: "TRY",
            transactionType: "deposit",
            coinType: "price",
          });
        }
      }, 2000);
    } else if (result.error === "User cancellation" && localPasswordEnabled && localPasswordEnabled === "true") {
      ModalProvider.show(<LockScreen onSuccess={onSuccessPasscode}
                                     isAuth={true}
                                     isCreate={false}
                                     onFail={onFailPasscode} />, false);
    } else {
      dispatch(setNonUser());
    }
  };

  const tryFaceId = () => checkForBiometrics();

  const loginWithPasscode = () => {
    setFaceIdModal(false);

    const localPasswordEnabled = LocalStorage.getItem("localPasswordEnabled");

    if (localPasswordEnabled && localPasswordEnabled === "true") {
      ModalProvider.show(<LockScreen onSuccess={onSuccessPasscode}
                                     isAuth={true}
                                     isCreate={false}
                                     onFail={onFailPasscode} />, false);
    }
  };

  return (
    <>
      <Drawer.Navigator
        useLegacyImplementation
        initialRouteName={walkThroughSeen ? "StackTab" : "WalkThrough"}
        drawerContent={props => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: "slide",
        }}
      >
        <Drawer.Screen name="StackTab" component={StackTabNav} />

        {
          drawerItems.map(item => <Drawer.Screen key={item.id} name={item.name} component={item.component} />)
        }

      </Drawer.Navigator>

      <AppStateLayout show={appStateVisible !== "active"} />


      <Modal
        animationType="slide"
        transparent={true}
        visible={faceIdModal}
        onRequestClose={() => setFaceIdModal(faceIdModal)}>

        <View
          style={styles(activeTheme).up}>
          <TinyImage parent={"rest/"} name={"face-id-bg"} style={styles(activeTheme).img} />
          <View style={styles(activeTheme).footer}>

            <Pressable style={styles(activeTheme).dismissButton} onPress={() => setFaceIdModal(false)}>
              <TinyImage parent={"rest/"} name={"cancel"} style={styles(activeTheme).icon} />
            </Pressable>

            <View style={styles(activeTheme).v1}>
              <Pressable
                onPress={tryFaceId}
                style={styles(activeTheme).v2}>

                <Text style={styles(activeTheme).touch}>{getLang(language, "PRESS_TO_FACE_ID_ACTIVATION")}</Text>
              </Pressable>

              <Text style={styles(activeTheme).headerText}>{getLang(language, "WELCOME_BACK")}</Text>
              <Text
                style={styles(activeTheme).email}>{user.Email || LocalStorage.getObject("storedLoginInstance")?.Email}</Text>

              <Pressable
                onPress={loginWithPasscode}
                style={styles(activeTheme).passV}>
                <Text style={styles(activeTheme).passT}>{getLang(language, "LOGIN_WITH_PASSCODE")}</Text>
              </Pressable>

            </View>


          </View>


        </View>
      </Modal>
    </>
  );
};

export default MainNavigator;


const styles = props => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#98B3B7",
    justifyContent: "center",
  },
  headerText: {
    color: props.secondaryText,
    fontSize: BIG_TITLE_FONTSIZE * 1.2,
    padding: 12,
    fontFamily: "CircularStd-Bold",

  },
  email: {
    color: props.secondaryText,
    fontSize: TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
  },
  touch: {
    marginTop: SCREEN_HEIGHT / 6,
    marginBottom: SCREEN_HEIGHT / 6,
    color: props.appWhite,
    fontFamily: "CircularStd-Book",

  },
  passV: {
    position: "absolute",
    bottom: 40,
    zIndex: 999999999,

  },
  passT: {
    color: props.actionColor,
    fontSize: TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
  },
  footer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  v1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0,
    width: "100%",
  },
  v2: {
    width: "100%",
    paddingVertical: PADDING_H,
    alignItems: "center",
  },
  up: {
    width: "100%",
    height: "100%",
    backgroundColor: props.darkBackground,
    flex: 1,
  },
  img: {
    height: SCREEN_HEIGHT,
    zIndex: 1,
  },

  dismissButton: {
    position: "absolute",
    zIndex: 999999999,
    right: 30,
    top: 50,
  },

  icon: {
    width: 20,
    height: 20,
  },

});
