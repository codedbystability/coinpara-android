import * as React from "react";
import { StackActions } from "@react-navigation/native";

export const navigationRef = React.createRef();

export const navigate = (pageName, params = {}, { resetStack = false } = {}) => {

  return navigationRef.current.navigate(pageName, params);


  // return navigationRef.current.reset({
  //   index: 0,
  //   routes: [
  //     {
  //       name: pageName,
  //       params: params,
  //     },
  //   ],
  // });

};

export const push = (pageName, params = {}) => {
  navigationRef.current.dispatch(StackActions.push(pageName, params));
};

export const goBack = () => {
  navigationRef.current.goBack();
};
export const canGoBack = () => {
  navigationRef.current.canGoBack();
};

export default {
  navigate,
  push,
  goBack,
};
