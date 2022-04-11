import { NOTIFICATION_CONSTANTS } from "../constants/notification-constants";

export function setNotification(data) {
  return {
    type: NOTIFICATION_CONSTANTS.SET_NOTIFICATION,
    data: data,
  };
}

export function deleteNotification(data) {
  return {
    type: NOTIFICATION_CONSTANTS.DELETE_NOTIFICATION,
    data: data,
  };
}
