import { LANGUAGE_CONSTANTS } from "../constants/language-constants";
import { GLOBAL_CONSTANTS } from "../constants/global-constants";
import LocalStorage from "../providers/LocalStorage";

const AuthenticationStates = {
  language: "en",
  languages: [],
  activeLanguage: {},
  activeLanguageContent: {},

};

const languageReducer = (state = AuthenticationStates, action) => {
  switch (action.type) {

    case LANGUAGE_CONSTANTS.SET_LANGUAGES:
      return {
        ...state,
        languages: state.languages.length >= 1 ? state.languages : action.data.languages,
        activeLanguage: action.data.activeLanguage,
        activeLanguageContent: action.data.languageContent,
        // activeLanguage: action.data.activeLanguage,
        // activeLanguageContent: action.data.content,
      };

    case LANGUAGE_CONSTANTS.SET_ACTIVE_LANGUAGE:
      return {
        ...state,
        activeLanguage: action.data,
        // activeLanguageContent: action.data.content,
      };

    case LANGUAGE_CONSTANTS.CHANGE_LANGUAGE:
      return {
        ...state,
        language: action.data,
      };

    case GLOBAL_CONSTANTS.UPDATE_LANGUAGE:
      LocalStorage.setItem("language", action.activeLanguage.ISO)

      return {
        ...state,
        activeLanguage: action.activeLanguage,
      };


    default:
      return state;

  }
};

export default languageReducer;
