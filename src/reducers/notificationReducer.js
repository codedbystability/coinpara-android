import { NOTIFICATION_CONSTANTS } from "../constants/notification-constants";

const AppStates = {
  notifications: [],
};

const notificationReducer = (state = AppStates, action) => {
  switch (action.type) {
    case NOTIFICATION_CONSTANTS.SET_NOTIFICATION:
      return {
        ...state,
        notifications: action.data,
      };

    case NOTIFICATION_CONSTANTS.DELETE_NOTIFICATION:
      return {
        notification: {},
      };


    default:
      return state;
  }
};

export default notificationReducer;
