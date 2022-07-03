import React, { useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import FormInput from "../../../components/page-components/form-input";
import CustomButton from "../../../components/page-components/button";
import userServices from "../../../services/user-services";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import DropdownAlert from "../../../providers/DropdownAlert";
import TabNavigationHeader from "../../../components/page-components/tab-navigation-header";
import InputAccessory from "../../../components/page-components/input-accessory";

const inputs = [
  {
    id: 1,
    key: "password",
    value: "",
    type: "password",
    keyboardType: "default",
    placeholder: "YOUR_PASSWORD",
    autoComplete: "off",
    returnKey: "done",
    autoFocus: true,
    icon: "eye-close",
  },
  {
    id: 2,
    key: "new-password",
    value: "",
    type: "password",
    keyboardType: "default",
    placeholder: "NEW_PASSWORD",
    autoComplete: "off",
    returnKey: "done",
    autoFocus: false,
    icon: "eye-close",

  },
  {
    id: 3,
    key: "password-confirmation",
    value: "",
    type: "password",
    keyboardType: "default",
    placeholder: "NEW_PASSWORD_COPY",
    autoComplete: "off",
    returnKey: "done",
    autoFocus: false,
    icon: "eye-close",

  },
];

const ChangePassword = (props) => {
  const [icon, setIcon] = useState("eye-close");

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");


  const { language } = useSelector(state => state.globalReducer);
  const handleSetText = (type, value) => {
    switch (type) {
      case "password":
        return setPassword(value);
      case "new-password":
        return setNewPassword(value);
      case "password-confirmation":
        return setPasswordConfirmation(value);
    }
  };

  // const handleSetIcon = (input) => {
  //   setInputs(inputs.map(item => item.id === input.id ? {
  //     ...item,
  //     type: item.type === "text" ? "password" : "text",
  //     icon: item.icon === "eye" ? "eye-with-line" : "eye",
  //
  //   } : item));
  //
  // };

  const handleSetIcon = () => setIcon(icon === "eye-open" ? "eye-close" : "eye-open");

  const getInputValue = (key) => {
    if (key === "password") {
      return password;
    } else if (key === "new-password") {
      return newPassword;
    } else if (key === "password-confirmation") {
      return passwordConfirmation;

    }
  };

  const handlePress = () => {
    if (!password || !newPassword || !passwordConfirmation) {
      return DropdownAlert.show("error", getLang(language, "INFORMATION"), getLang(language, "PLEASE_FILL_ALL_BLANKS"));
    }

    if (newPassword !== passwordConfirmation) {
      return DropdownAlert.show("error", getLang(language, "INFORMATION"), getLang(language, "PASSWORDS_NOT_MATCH"));
    } else {
      const instance = {
        OldPass: password,
        NewPass: newPassword,
        NewPassCopy: passwordConfirmation,
      };

      userServices.changePassword(instance).then((response) => {
        if (!response) {
          return DropdownAlert.show("warning", getLang(language, "ERROR"), getLang(language, "PLEASE_SIGNIN_OR_CREATE_ACCOUNT"));
        } else if (!response.IsSuccess) {
          return;
        }
        DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "YOUR_PASSWORD_CHANGED"));
        return props.navigation.goBack();
      });
    }


  };
  return (

    <>

      <TabNavigationHeader
        {...props}
        backAble={true}
        isBack={true}
        options={{ title: getLang(language, "CHANGE_PASSWORD") }}
      />
      {/*<Pressable*/}
      {/*  // activeOpacity={1}*/}
      {/*  // onPress={() => Keyboard.dismiss()}*/}
      {/*  style={styles.wrapper}>*/}

      <KeyboardAvoidingView
        behavior={"padding"}
        style={styles.wrapper}>

        <View style={styles.content}>
          {
            inputs.map(input =>
              <FormInput placeholder={input.placeholder}
                         inputKey={input.key}
                         key={input.key}
                         value={getInputValue(input.key)}
                         icon={icon}
                         onIconPressed={() => handleSetIcon(input)}
                         inputAccessoryViewID={"inputAccessoryViewIDCh"}
                         keyboardType={input.keyboardType}
                         autoComplete={input.autoComplete}
                         returnKey={input.returnKey}
                         autoFocus={input.autoFocus}
                         type={icon === "eye-close" ? "password" : "text"}
                         onChange={(value) => handleSetText(input.key, value)} />)
          }


        </View>

      </KeyboardAvoidingView>
      {/*</Pressable>*/}
      <CustomButton text={getLang(language, "CHANGE_PASSWORD")}
                    filled={true}
                    onPress={handlePress} />
      <InputAccessory
        handleStep={null}
        onPress={null}
        stepAble={false}
        mailProviders={[]}
      />
    </>

  );

};

const ChangePasswordScreen = styledHigherOrderComponents(ChangePassword);
export default ChangePasswordScreen;

const styles = StyleSheet.create({
  wrapper: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: {
    width: "100%",
    justifyContent: "center", alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  container: {
    flex: 1,
  },

});
