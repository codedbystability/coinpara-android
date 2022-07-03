import { GLOBAL_CONSTANTS } from "../constants/global-constants";
import LocalStorage from "../providers/LocalStorage";

const initialNormal = 11;

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
  activeTheme: [],
  language: [],
  fontSizes: {
    HEADER_TITLE_FONTSIZE: initialNormal + 4,
    BIG_TITLE_FONTSIZE: initialNormal + 3,
    TITLE_FONTSIZE: initialNormal + 2,
    SUBTITLE_FONTSIZE: initialNormal + 1,
    NORMAL_FONTSIZE: initialNormal,
  },
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
        bidText: "rgba(96,186,137,1)",
        askText: "rgba(226,84,96,1)",

        bidBg: "rgba(96,186,137,.2)",
        askBg: "rgba(226,84,96,.2)",

        changeRed: "rgba(96,186,137,.5)",
        noRed: "rgba(96,186,137,1)",

        changeGreen: "rgba(96,186,137,.5)",
        yesGreen: "rgba(96,186,137,1)",

        // appWhite: "#fff",
        // borderGray: "#bdbdbd",
      },
    },
    {
      id: 3, key: "TRADITIONAL", title: "TRADITIONAL", colors: {
        bidText: "rgba(128,165,50,1)",
        askText: "rgba(209,50,111,1)",


        bidBg: "rgba(128,165,50,.2)",
        askBg: "rgba(209,50,111,.2)",

        changeRed: "rgba(128,165,50,.5)",
        noRed: "rgba(209,50,111,1)",

        changeGreen: "rgba(128,165,50,.5)",
        yesGreen: "rgba(209,50,111,1)",

        // appWhite: "#fff",
        // borderGray: "#bdbdbd",
      },
    },
    {
      id: 4, key: "COLOR_BLIND", title: "COLOR_BLIND", colors: {
        bidText: "rgba(76,163,242,1)",
        askText: "rgba(208,126,62,1)",


        bidBg: "rgba(76,163,242,.2)",
        askBg: "rgba(208,126,62,.2)",

        changeRed: "rgba(208,126,62,.5)",
        noRed: "rgba(208,126,62,1)",

        changeGreen: "rgba(76,163,242,.5)",
        yesGreen: "rgba(209,50,111,1)",

        // appWhite: "#fff",
        // borderGray: "#bdbdbd",
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
        activeUserColors: active ? active.colors : {
          askText: state.classicColors.askText,
          bidText: state.classicColors.bidText,
          bidBg: state.classicColors.bidBg,
          askBg: state.classicColors.askBg,
          changeRed: state.classicColors.changeRed,
          noRed: state.classicColors.noRed,
          changeGreen: state.classicColors.changeGreen,
          yesGreen: state.classicColors.yesGreen,
          appWhite: state.classicColors.appWhite,
          borderGray: state.classicColors.borderGray,
        },

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
      }

      return {
        ...state,
        classicColors: classic,
        activeTheme: classic,
        activeUserColors: state.activeColorOption === "COLOR_BLIND" ? state.activeUserColors
          : state.activeColorOption !== "SYSTEM" ? state.activeUserColors
            : {
              askText: classic.askText,
              bidText: classic.bidText,
              bidBg: classic.bidBg,
              askBg: classic.askBg,
              changeRed: classic.changeRed,
              noRed: classic.noRed,
              changeGreen: classic.changeGreen,
              yesGreen: classic.yesGreen,
              appWhite: classic.appWhite,
              borderGray: classic.borderGray,
            },
        iconColor: action.iconColor,
      };

    case GLOBAL_CONSTANTS.SET_LANGUAGE:
      const languageC = [];
      if (action.data && action.data.length >= 1) {
        action.data.map(item => languageC[item.key] = item.value);
      }
      return {
        ...state,
        language: languageC,
      };

    case GLOBAL_CONSTANTS.SET_LANGUAGE_KEYS:
      const languageC2 = [];
      if (action.data && action.data.length >= 1) {
        action.data.map(item => languageC2[item.key] = item.value);
      }
      return {
        ...state,
        language: languageC2,
      };


    case GLOBAL_CONSTANTS.SET_ICON_COLOR:
      return {
        ...state,
        iconColor: action.data,
      };

    case GLOBAL_CONSTANTS.SET_ACTIVE_THEME:
      return {
        ...state,
        activeTheme: state.classicColors,
        iconColor: action.iconColor,
        activeThemeKey: action.data,
        activeUserColors: state.activeColorOption === "COLOR_BLIND" ? state.activeUserColors : {
          askText: state.classicColors.askText,
          bidText: state.classicColors.bidText,
          bidBg: state.classicColors.bidBg,
          askBg: state.classicColors.askBg,
          changeRed: state.classicColors.changeRed,
          noRed: state.classicColors.noRed,
          changeGreen: state.classicColors.changeGreen,
          yesGreen: state.classicColors.yesGreen,
          appWhite: state.classicColors.appWhite,
          borderGray: state.classicColors.borderGray,
        },
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
      LocalStorage.setObject("companyInfo", action.data);
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
