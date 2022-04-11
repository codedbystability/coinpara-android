import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

const setItem = (key, value) => {
  if (value !== undefined) {
    storage.set(key, value);
  }
};

const getItem = (key, defaultKey = null) => {
  const value = storage.getString(key);
  if (value)
    return value;

  return defaultKey;
};

const removeItem = (key) => storage.delete(key);

const clearAll = () => storage.clearAll();

const setObject = (key, value) => storage.set(key, JSON.stringify(value));

const getObject = (key) => {
  try {
    const jsonValue = storage.getString(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
  }
};

const getArray = function(key) {
  try {
    const myArray = storage.getString(key);
    if (myArray !== null) {
      return JSON.parse(myArray);
    }
    return [];
  } catch (error) {
    // Error retrieving data
    return [];
  }
};

const storeObject = (key, value) => storage.set(key, JSON.stringify(value));

export default {
  setItem,
  getItem,
  removeItem,
  clearAll,
  getObject,
  setObject,
  getArray,
  storeObject,
};
