import React, { useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import { HubConnectionBuilder, JsonHubProtocol, LogLevel } from "@microsoft/signalr";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import BackgroundTimer from "react-native-background-timer";
import ReactNativeBiometrics from "react-native-biometrics";
import moment from "moment";

import TabNavigationHeader from "../components/tab-navigation-header";
import { nonLoginStackItems, stackItems } from "./stack-items";
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

const Stack = createStackNavigator();

let subscription = null,
  timeoutId = null,
  quitStateNotifyOpened = false,
  notifies = [],
  storedMarkets = [],
  connectionG = null,
  myInterval = null,
  userGuid = null,
  intervalId = null,
  MARKET_COUNT = 0,
  SECONDS_TO_WAIT = 30,
  shouldReConnect = true;

const MainNavigator = ({ walkThroughSeen }) => {
  const dispatch = useDispatch();
  const { user, userToken } = useSelector(state => state.authenticationReducer);
  const { language, activeTheme, connection } = useSelector(state => state.globalReducer);
  const [aState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    // LocalStorage.clearAll();
    // FastImage.clearDiskCache().then(r => null);
    // FastImage.clearMemoryCache().then(r => null);
    subscription = AppState.addEventListener("change", nextAppState => {
      setAppState(nextAppState);
      if (nextAppState === "active") {
        if (timeoutId) {
          BackgroundTimer.clearTimeout(timeoutId);
          BackgroundTimer.stop();
          timeoutId = null;
        }
        if (!user.UserGuid && !userToken && !connection) {
          setupSignalRConnection(null, null).then(r => console.log("setupSignalRConnection"));
        } else if (user.UserGuid && user && !connection) {
          setupSignalRConnection(user.UserGuid, userToken).then(r => console.log("setupSignalRConnection"));
        }
      } else {
        if (!timeoutId) {
          timeoutId = BackgroundTimer.setTimeout(() => {
            connection && connection.stop();
            dispatch(setConnection(null));
          }, SECONDS_TO_WAIT * 1000);
        }
      }
    });
    return () => subscription && subscription.remove();
  }, [connection]);

  useEffect(() => {
    if (userToken !== "null") {
      if (!user || (!user.UserGuid && (!userToken || userToken === "null"))) {
        fcmServices.register(onRegister, onNotification, onOpenNotification);
        setupSignalRConnection(null, null).then(r => null);
      } else if (user.UserGuid && user) {

        fcmServices.register(onRegister, onNotification, onOpenNotification);
        setupSignalRConnection(user.UserGuid, userToken).then(r => null);
      }
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

  const setupSignalRConnection = async (gd, tkn) => {
    MARKET_COUNT = 0;
    try {
      shouldReConnect = true;
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

      connection.serverTimeoutInMilliseconds = 3000000;
      connection.keepAliveIntervalInMilliseconds = 3000000;

      connection.onclose(error => {
        if (shouldReConnect && AppState.currentState === "active") {
          setTimeout(() => setupSignalRConnection(userGuid ?? gd, userToken ?? tkn), 500);
        }
      });
      // connection.onreconnecting(error =>  dispatch(setConnection(null)));
      connection.onreconnected(connectionId => console.log("Connection reestablished. Connected with connectionId", connectionId));

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
      console.log("notifyWalletDashboardUpdate - ", wallets.length);
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

  const onRegister = (fcm) => {
    if (fcm) {
      const fcmInstance = {
        fcmToken: fcm,//long-text
        userId: Object.keys(user).length >= 1 ? user.Id : "",//integer-nullable -- our-system-user-id -> ex.= 60
        platform: Platform.OS,//string android-ios
      };
      userServices.setDeviceToken(fcmInstance).then(r => null);
    }
  };

  const onOpenNotification = (data) => {
    quitStateNotifyOpened = true;
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
    if (result.success) {
      userServices.token({
        grant_type: "refresh_token",
        refresh_token: LocalStorage.getItem("refresh_token"),
      }).then(response => {
        if (response && response.Id) {
          dispatch(setUser(response));
        }
      }).catch(err => console.log("err -> ", err));
    } else if (result.error === "User cancellation" && localPasswordEnabled && localPasswordEnabled === "true") {
      ModalProvider.show(<LockScreen onSuccess={onSuccessPasscode}
                                     isAuth={true}
                                     isCreate={false}
                                     onFail={onFailPasscode} />, false);
    } else {
      dispatch(setNonUser());
    }
  };


  return (
    <>
      <Stack.Navigator
        initialRouteName={walkThroughSeen ? "Tab" : "WalkThrough"}
        // initialRouteName={"RegisterAdditional"}
        screenOptions={{
          cardStyle: { backgroundColor: activeTheme.backgroundApp },
          header: (props) => <TabNavigationHeader backAble={true} {...props} />,
        }}>
        {
          stackItems.map(stackItem => <Stack.Screen
            key={stackItem.id} name={stackItem.name}
            component={stackItem.component}
            options={stackItem.options}
          />)
        }

        {
          nonLoginStackItems.map(stackItem => <Stack.Screen
            key={stackItem.id}
            name={stackItem.name}
            component={stackItem.component}
            options={stackItem.options}
          />)
        }
      </Stack.Navigator>

      <AppStateLayout show={aState !== "active"} />

    </>
  );
};

export default MainNavigator;
