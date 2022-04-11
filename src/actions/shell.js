import { GLOBAL_CONSTANTS } from "../constants/global-constants";

export const showLoading = () => {
  return {
    type: GLOBAL_CONSTANTS.SET_IS_FETCHING,
    data: true,
  };
};

export const hideLoading = () => {
  return {
    type: GLOBAL_CONSTANTS.SET_IS_FETCHING,
    data: false,
  };
};
