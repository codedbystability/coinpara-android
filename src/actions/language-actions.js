import { LANGUAGE_CONSTANTS } from "../constants/language-constants";

export function setLanguages(data) {
  return {
    type: LANGUAGE_CONSTANTS.SET_LANGUAGES,
    data: data,
  };
}


export function setActiveLanguage(data) {
  return {
    type: LANGUAGE_CONSTANTS.SET_ACTIVE_LANGUAGE,
    data: data,
  };
}
