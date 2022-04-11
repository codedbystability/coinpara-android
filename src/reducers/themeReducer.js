import { THEME_CONSTANTS } from "../constants/theme-constants";

const AuthenticationStates = {
  theme: "dark",
};

const themeReducer = (state = AuthenticationStates, action) => {
  switch (action.type) {
    case THEME_CONSTANTS.SET_THEME:
      return {
        ...state,
        theme: state.theme === "light" ? "dark" : "light",
      };


    default:
      return state;

  }
};

export default themeReducer;
