import { AUTHENTICATION_CONSTANTS } from "../constants/authentication-constants";

const AuthenticationStates = {
  authenticated: false,
  user: {},
  token: null,
  userToken: "null",
  verifyType: 1, //  1 === sms //// 2 === google-authenticator
};

const authenticationReducer = (state = AuthenticationStates, action) => {
  switch (action.type) {

    case AUTHENTICATION_CONSTANTS.SET_USER_TOKEN:
      // console.log("action.data-", action.data);
      return {
        ...state,
        token: "Bearer " + action.data,
        userToken: action.data,
      };

    case AUTHENTICATION_CONSTANTS.SET_NON_USER:
      return {
        ...state,
        userToken: null,
      };

    case AUTHENTICATION_CONSTANTS.DISABLE_INVALID_TOKEN:
      return {
        ...state,
        token: null,
        user: {},
        authenticated: false,
        userToken: null,
      };
    case AUTHENTICATION_CONSTANTS.SET_USER:
      return {
        ...state,
        user: action.data,
        authenticated: true,
      };

    case AUTHENTICATION_CONSTANTS.SET_VALID_USER:
      return {
        ...state,
        user: action.data,
        authenticated: true,
      };

    case AUTHENTICATION_CONSTANTS.SET_USER_FROM_LOCAL_STORAGE:
      return {
        ...state,
        token: "Bearer " + action.data.token,
        user: action.data.user,
        userToken: action.data.token,
        authenticated: true,
      };

    case AUTHENTICATION_CONSTANTS.USER_LOG_OUT: {
      // clearAppData().then(r => null);
      return {
        ...state,
        authenticated: false,
        user: {},
        token: null,
        userToken: null,
      };
    }

    case AUTHENTICATION_CONSTANTS.UPDATE_USER_FIELD: {
      return {
        ...state,
        user: {
          ...state.user,
          Name: action.data.Name,
          Surname: action.data.Surname,
        },
      };
    }


    case AUTHENTICATION_CONSTANTS.UPDATE_USER_VERIFY_TYPE: {
      return {
        ...state,
        verifyType: action.data,
      };
    }


    default:
      return state;

  }
};

export default authenticationReducer;
