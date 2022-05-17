import { GLOBAL_CONSTANTS } from "../constants/global-constants";





export function setColorOption(data) {
  return {
    type: GLOBAL_CONSTANTS.SET_COLOR_OPTION,
    data: data,
  };
}

export function setFontSize(data) {
  return {
    type: GLOBAL_CONSTANTS.SET_FONT_SIZE,
    data: data,
  };
}
export function setKeyboardShown(data) {
  return {
    type: GLOBAL_CONSTANTS.SET_KEYBOARD_SHOWN,
    data: data,
  };
}


export function setIsError(data, message) {
  return {
    type: GLOBAL_CONSTANTS.SET_IS_ERROR,
    data: data,
    message: message,
  };
}


export function setColors(data) {
  return {
    type: GLOBAL_CONSTANTS.SET_COLORS,
    data: data,
  };
}


export function setClassicColors(data, color) {
  return {
    type: GLOBAL_CONSTANTS.SET_CLASSIC_COLORS,
    data: data,
    iconColor: color,
  };
}

export function setDarkColors(data) {
  return {
    type: GLOBAL_CONSTANTS.SET_DARK_COLORS,
    data: data,
  };
}

export function setLightColors(data) {
  return {
    type: GLOBAL_CONSTANTS.SET_LIGHT_COLORS,
    data: data,
  };
}


export function setActiveTheme(data, color) {
  return {
    type: GLOBAL_CONSTANTS.SET_ACTIVE_THEME,
    data: data,
    iconColor: color,
  };
}


export function setLanguage(data) {
  return {
    type: GLOBAL_CONSTANTS.SET_LANGUAGE,
    data: data,
  };
}


export function setLanguageKeys(data) {
  return {
    type: GLOBAL_CONSTANTS.SET_LANGUAGE_KEYS,
    data: data,
  };
}


export function setError(data) {
  return {
    type: GLOBAL_CONSTANTS.SET_ERROR,
    data: data,
  };
}

export function setIsConnectedWifi(data) {
  return {
    type: GLOBAL_CONSTANTS.SET_IS_CONNECTED_WIFI,
    data: data,
  };
}


export function setIsModal(data) {
  return {
    type: GLOBAL_CONSTANTS.SET_IS_MODAL,
    data: data,
  };
}

export function updateLanguage(data, activeLanguage) {
  return {
    type: GLOBAL_CONSTANTS.UPDATE_LANGUAGE,
    data: data,
    activeLanguage: activeLanguage,
  };
}

export function setConnection(data) {
  return {
    type: GLOBAL_CONSTANTS.SET_CONNECTION,
    data: data,
  };
}

export function setCompanyInfo(data) {
  return {
    type: GLOBAL_CONSTANTS.SET_COMPANY_INFO,
    data: data,
  };
}


export function setMarketDetailCoinList(data) {
  return {
    type: GLOBAL_CONSTANTS.SET_MARKET_DETAIL_COINS,
    data: data,
  };
}






//
