import { GLOBAL_CONSTANTS } from "../constants/global-constants";

const initialNormal = 11;
const languageDEFAULT = [];
const themeDEFAULT = [];
const fontSizes = {
  HEADER_TITLE_FONTSIZE: initialNormal + 4,
  BIG_TITLE_FONTSIZE: initialNormal + 3,
  TITLE_FONTSIZE: initialNormal + 2,
  SUBTITLE_FONTSIZE: initialNormal + 1,
  NORMAL_FONTSIZE: initialNormal,
};
const GlobalStates = {
  isConnectedWifi: true,
  keyboardShown: false,
  isFetching: false,
  isModal: false,
  isError: false,
  errorCount: 0,
  error: false,
  isErrorMessage: "",
  colors: [],
  classicColors: [],
  darkColors: [],
  lightColors: [],
  activeTheme: themeDEFAULT,
  language: languageDEFAULT,
  fontSizes: fontSizes,
  fontSizeActive: 13,
  iconColor: "white",
  activeThemeKey: "classic",
  connection: null,
  companyInfo: {},
  marketDetailList: [],

  activeColorOption: "SYSTEM",
  activeUserColors: {},
  colorOptions: [
    // {
    //   id: 1, key: "total", title: "SYSTEM", colors: {
    //     green: activeTheme.changeGreen,
    //     red: activeTheme.changeRed,
    //   },
    // },
    {
      id: 2, key: "PASTEL", title: "PASTEL", colors: {
        green: "rgba(96,186,137,1)",
        red: "rgba(226,84,96,1)",
      },
    },
    {
      id: 3, key: "TRADITIONAL", title: "TRADITIONAL", colors: {
        green: "rgba(128,165,50,1)",
        red: "rgba(209,50,111,1)",
      },
    },
    {
      id: 4, key: "COLOR_BLIND", title: "COLOR_BLIND", colors: {
        green: "rgba(76,163,242,1)",
        red: "rgba(208,126,62,1)",
      },
    },
  ],

};

const globalReducer = (state = GlobalStates, action) => {
  switch (action.type) {
    case GLOBAL_CONSTANTS.SET_KEYBOARD_SHOWN:
      return {
        ...state,
        keyboardShown: action.data,
      };

    case GLOBAL_CONSTANTS.SET_COLOR_OPTION:
      const data = action.data;
      const active = state.colorOptions.find(item => item.key === data);
      return {
        ...state,
        activeColorOption: data,
        activeUserColors: active,
      };


    case GLOBAL_CONSTANTS.SET_FONT_SIZE:
      const newSize = action.data || state.fontSizeActive;
      return {
        ...state,
        fontSizeActive: newSize,
        fontSizes: {
          HEADER_TITLE_FONTSIZE: newSize + 4,
          BIG_TITLE_FONTSIZE: newSize + 3,
          TITLE_FONTSIZE: newSize + 2,
          SUBTITLE_FONTSIZE: newSize + 1,
          NORMAL_FONTSIZE: newSize,
        },
      };

    case GLOBAL_CONSTANTS.SET_IS_FETCHING:
      return {
        ...state,
        isFetching: action.data,
      };


    case GLOBAL_CONSTANTS.SET_IS_ERROR:
      return {
        ...state,
        isError: state.errorCount >= 5,
        errorCount: state.errorCount + 1,
        isErrorMessage: action.message,
      };


    case GLOBAL_CONSTANTS.SET_COLORS:
      return {
        ...state,
        colors: action.data,
      };

    case GLOBAL_CONSTANTS.SET_CLASSIC_COLORS:

      let classic = [];
      if (action.data && action.data.length >= 1) {
        action.data.map(item => classic[item.key] = item.rgb);
      } else {
        DEFAULT_THEME.map(item => classic[item.key] = item.rgb);
      }
      return {
        ...state,
        classicColors: classic,
        activeTheme: classic,
        iconColor: action.iconColor,
      };

    case GLOBAL_CONSTANTS.SET_DARK_COLORS:
      const classic2 = [];
      action.data.map(item => classic2[item.key] = item.rgb);
      return {
        ...state,
        darkColors: classic2,
      };

    case GLOBAL_CONSTANTS.SET_LIGHT_COLORS:
      const classic3 = [];
      action.data.map(item => classic3[item.key] = item.rgb);
      return {
        ...state,
        lightColors: classic3,
      };

    case GLOBAL_CONSTANTS.SET_LANGUAGE:
      const languageC = [];
      if (action.data && action.data.length >= 1) {
        action.data.map(item => languageC[item.key] = item.value);
      } else {
        DEFAULT_LANG.map(item => languageC[item.key] = item.value);
      }
      return {
        ...state,
        language: languageC,
      };


    case GLOBAL_CONSTANTS.SET_ACTIVE_THEME:
      return {
        ...state,
        activeTheme: state.classicColors,
        iconColor: action.iconColor,
        activeThemeKey: action.data,
      };

    case GLOBAL_CONSTANTS.UPDATE_LANGUAGE:
      const languageU = [];
      action.data.map(item => languageU[item.key] = item.value);
      return {
        ...state,
        language: languageU,
      };

    case GLOBAL_CONSTANTS.SET_ERROR:
      return {
        ...state,
        error: action.data,
      };


    case GLOBAL_CONSTANTS.SET_IS_CONNECTED_WIFI:
      return {
        ...state,
        isConnectedWifi: action.data,
      };


    case GLOBAL_CONSTANTS.SET_IS_MODAL:
      return {
        ...state,
        isModal: action.data,
      };


    case GLOBAL_CONSTANTS.SET_CONNECTION:
      return {
        ...state,
        connection: action.data,
      };


    case GLOBAL_CONSTANTS.SET_COMPANY_INFO:
      return {
        ...state,
        companyInfo: action.data,
      };


    case GLOBAL_CONSTANTS.SET_MARKET_DETAIL_COINS:
      return {
        ...state,
        marketDetailList: action.data,
      };

    default:
      return state;
  }
};

export default globalReducer;
