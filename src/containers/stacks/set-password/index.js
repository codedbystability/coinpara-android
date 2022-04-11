import React, { useEffect, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { StyleSheet, View } from "react-native";
import FormInput from "../../../components/form-input";
import CustomButton from "../../../components/button";
import userServices from "../../../services/user-services";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import DropdownAlert from "../../../providers/DropdownAlert";
import { navigationRef } from "../../../providers/RootNavigation";
import FormPhoneInput from "../../../components/phone-input";
import { normalizeInput } from "../../../helpers/math-helper";
import { phoneInputRegex } from "../../../helpers/string-helper";
import InputAccessory from "../../../components/input-accessory";


const SetPasswords = (props) => {
  const [inputs, setInputs] = useState([
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
      icon: "eye-open",

    },
  ]);
  const [icon, setIcon] = useState("eye-open");
  const onIconPressed = () => setIcon(icon === "eye-open" ? "eye-close" : "eye-open");

  // const handleSetIcon = (input) => {
  //   setInputs(inputs.map(item => item.id === input.id ? {
  //     ...item,
  //     type: item.type === "text" ? "password" : "text",
  //     icon: item.icon === "eye-open" ? "eye-close" : "eye-open",
  //
  //   } : item));
  // };

  const [hasPhone, setHasPhone] = useState(false);
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");


  const { language } = useSelector(state => state.globalReducer);

  useEffect(() => {
    setToken(props.route.params.token);
    setHasPhone(props.route.params.hasPhone);
  }, [props.route]);

  const handleSetText = (type, value) => {
    switch (type) {
      case "new-password":
        return setNewPassword(value);
      case "password-confirmation":
        return setPasswordConfirmation(value);
    }
  };


  const getInputValue = (key) => {
    if (key === "new-password") {
      return newPassword;
    } else if (key === "password-confirmation") {
      return passwordConfirmation;
    }
  };

  const handlePress = () => {

    if (!hasPhone) {
      if (!phoneNumber) {
        return DropdownAlert.show("error",
          getLang(language, "ERROR"),
          getLang(language, "PLEASE_FILL_ALL_BLANKS"));
      }

      if (!phoneInputRegex.test(phoneNumber)) {
        return DropdownAlert.show("error",
          getLang(language, "ERROR"),
          getLang(language, "PLEASE_CHECK_YOUR_PHONE_NUMBER"));
      }

    }

    const num = phoneNumber.replace(/\s/g, "").replace(/-/g, "").replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
    const validPhone = activeCountry.dial_code.substring(1) + num;

    const instance = {
      "Token": token,
      "Password": newPassword,
      "ConfirmPassword": passwordConfirmation,
      "Phone": hasPhone ? "" : validPhone,
    };

    userServices.setPassword(instance).then((response) => {
      if (response.IsSuccess) {
        DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "YOUR_PASSWORD_CHANGED"));
        return navigationRef.current.navigate("Tab");
      }
    });
  };
  const [phoneNumber, setPhoneNumber] = useState("");
  const onCountrySelect = (country) => setActiveCountry(country);
  const [activeCountry, setActiveCountry] = useState({
    "name": "Turkey",
    "dial_code": "+90",
    "code": "TR",
  });

  return (
    <>
      <View style={styles.wrapper}>

        <View style={styles.content}>

          {
            !hasPhone && <FormPhoneInput value={normalizeInput(phoneNumber)}
                                         placeholder={getLang(language, "YOUR_PHONE_NUMBER")}
                                         activeCountry={activeCountry}
                                         onCountrySelect={onCountrySelect}
                                         onChangePhoneNumber={(number) => setPhoneNumber(number)}
            />
          }


          {
            inputs.map(input =>
              <FormInput placeholder={input.placeholder}
                         inputKey={input.key}
                         key={input.key}
                         value={getInputValue(input.key)}
                         icon={icon}
                         onIconPressed={onIconPressed}
                         keyboardType={input.keyboardType}
                         autoComplete={input.autoComplete}
                         returnKey={input.returnKey}
                         autoFocus={input.autoFocus}
                         type={icon === "eye-close" ? "text" : input.type}
                         onChange={(value) => handleSetText(input.key, value)} />)
          }


        </View>

      </View>


      <CustomButton text={getLang(language, "CONTINUE")}
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

const SetPasswordsScreen = styledHigherOrderComponents(SetPasswords);
export default SetPasswordsScreen;

const styles = StyleSheet.create({
  wrapper: { flex: 1, justifyContent: "center", alignItems: "center" },
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
