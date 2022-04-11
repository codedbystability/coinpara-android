export function checkProperties(obj) {
  for (let key in obj) {
    if (!obj.hasOwnProperty(key) || !obj[key] || obj[key] === "") {
      return false;
    }
  }
  return true;
}

export function checkPropertiesFilled(obj) {
  const jsObj = {};
  for (let key in obj) {
    if (!obj[key] || obj[key] === "") {
      jsObj[key] = "please_fill";
    }
  }
  return jsObj;
}


export function checkPropertiesExcept(obj, except = []) {
  for (let key in obj) {
    if ((!obj.hasOwnProperty(key) || !obj[key] || obj[key] === "") && !except.includes(key)) {
      return false;
    }
  }
  return true;
}


export function getLanguageField(languageContent, key1, key2) {
  if (
    Object.keys(languageContent).keys <= 0
    || !key1 in languageContent
    || !languageContent[key1]
    || Object.keys(languageContent[key1]).keys <= 0
    || !key2 in languageContent[key1])
    return "";

  return languageContent[key1][key2];
}


export function getLang(languageContent, key1, fallback) {
  if (!languageContent || Object.keys(languageContent).keys <= 0 || !(key1 in languageContent))
    return fallback ? fallback : key1 ? "ERROR_" + key1.toLowerCase() : "ERRRR";

  return languageContent[key1];
}

