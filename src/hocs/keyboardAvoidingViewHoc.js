import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";


const keyboardAvoidingViewHoc = WrappedComponent => props => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      {...(Platform.OS === "ios" ? { behavior: "padding" } : { behavior: "padding" })}
    >
        <WrappedComponent {...props} />
    </KeyboardAvoidingView>

  );
};

export default keyboardAvoidingViewHoc;
