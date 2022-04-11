import { APP_CONSTANTS } from "../constants/app-constants";

const AppStates = {
  loading: false,
  premiumModalShow: false,
};

const appReducer = (state = AppStates, action) => {
  switch (action.type) {
    case APP_CONSTANTS.SET_LOADING:
      return {
        ...state,
        loading: action.data,
      };

    case APP_CONSTANTS.SET_PREMIUM_MODAL:
      return {
        ...state,
        premiumModalShow: !state.premiumModalShow,
      };

    default:
      return state;
  }
};

export default appReducer;
