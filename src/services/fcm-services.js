import messaging from "@react-native-firebase/messaging";
import LocalStorage from "../providers/LocalStorage";

class FcmServices {

  register = (onRegister, onNotification, onOpenNotification) => this.checkPermission(onRegister, onNotification, onOpenNotification);

  registerAppWithFCM = (onRegister, onNotification, onOpenNotification) => this.getToken(onRegister, onNotification, onOpenNotification).then(r => null); // TODO FOR ANDROID

  checkPermission = (onRegister, onNotification, onOpenNotification) => {
    messaging().hasPermission()
      .then(enabled => {
        enabled ? this.registerAppWithFCM(onRegister, onNotification, onOpenNotification) :
          this.requestPermission(onRegister, onNotification, onOpenNotification);
      }).catch(error => this.requestPermission(onRegister, onNotification, onOpenNotification));
  };

  getToken = async (onRegister, onNotification, onOpenNotification) => {
    let fcmToken = LocalStorage.getItem("FCM_TOKEN");
    if (!fcmToken) {
      messaging().getToken()
        .then(fcmToken => {
          if (fcmToken) {
            this.setToken(fcmToken);
            this.createNotificationListeners(onNotification, onOpenNotification);
            onRegister(fcmToken);
          } else {
            console.log("[FCMService] User does not have a device token");
          }
        }).catch(error => console.log("[FCMService] getToken rejected ", `FCm token get error${error}`));
    } else {
      this.createNotificationListeners(onNotification, onOpenNotification);
      onRegister(fcmToken);
    }
  };

  setToken = (token) => LocalStorage.setItem("FCM_TOKEN", token);

  requestPermission = (onNotification, onOpenNotification) => {
    // console.log("requestPermission");
    messaging().requestPermission().then((response) => {
      // console.log("req per - ", response);
      this.registerAppWithFCM(onNotification, onOpenNotification);
    }).catch(error => {
      console.log("[FCMService] Requested persmission rejected ", error);
    });
  };

  deletedToken = async () => {
    await messaging().deleteToken()
      .catch(error => {
        // console.log("Delected token error ", error)
      });
  };

  createNotificationListeners = (onNotification, onOpenNotification) => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      // console.log("remoteMessage -", remoteMessage);
      // remoteMessage - {
      // "contentAvailable": true,
      // "data": {"body": "123", "content_available": "true", "priority": "high", "title": "titletitle2"},
      // "from": "948242208985", "messageId": "1647862644307751",
      // "notification": {"body": "123", "title": "titletitle2"}}
      // console.log("[FCMService] onNotificationOpenedApp Notification caused app to open from background state:", remoteMessage);
      if (remoteMessage) {
        onOpenNotification(remoteMessage.data);
      }
    });

    // when the application is opened form a quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
          // console.log('[FCMService] getInitialNotification Notification caused app to open from quit state:', remoteMessage);
          if (remoteMessage) {
            onOpenNotification(remoteMessage.data);
          }
        },
      );

    // Foreground state messages
    this.messageListener = messaging().onMessage(async remoteMessage => {
      // console.log("[FCMService] A new FCM message arrived", remoteMessage);
      if (remoteMessage) {
        onNotification(remoteMessage);
      }
    });

    // Triggered when have new token
    messaging().onTokenRefresh(fcmToken => this.setToken(fcmToken));
  };

  unRegister = () => this.messageListener();

}

const fcmServices = new FcmServices();
export default fcmServices;
