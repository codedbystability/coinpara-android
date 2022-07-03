import React, { useEffect, useState } from "react";
import styledHigherOrderComponents from "../../hocs/styledHigherOrderComponents";
import { Image, KeyboardAvoidingView, StyleSheet, View } from "react-native";
import TabNavigationHeader from "../../components/page-components/tab-navigation-header";
import { getLang } from "../../helpers/array-helper";
import FormInput from "../../components/page-components/form-input";
import CustomButton from "../../components/page-components/button";
import { useSelector } from "react-redux";
import userServices from "../../services/user-services";
import { DIMENSIONS } from "../../../utils/dimensions";
import DropdownAlert from "../../providers/DropdownAlert";
import Validation from "../../components/page-components/validation";
import { navigationRef } from "../../providers/RootNavigation";
import LocalStorage from "../../providers/LocalStorage";
import InputAccessory from "../../components/page-components/input-accessory";


const input = {
  id: 1,
  key: "email",
  value: "",
  type: "text",
  keyboardType: "email-address",
  placeholder: "YOUR_EMAIL_ADDRESS",
  autoComplete: "email",
  returnKey: "next",
  autoFocus: true,
};
const ForgotPassword = (props) => {


  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const [email, setEmail] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [hasPhone, setHasPhone] = useState(false);
  // const [verifyType, setVerifyType] = useState(1);
  const [response, setResponse] = useState({
    token: "",
  });
  const [mailProviders, setMailProviders] = useState([]);

  useEffect(() => {
    const storedLoginInstance = LocalStorage.getObject("storedLoginInstance");
    setEmail(storedLoginInstance && storedLoginInstance.Email ? storedLoginInstance.Email : "");

  }, []);
  useEffect(() => {
    if (email && email.indexOf("@") === email.length - 1) {
      setMailProviders([
        {
          id: 1,
          value: "gmail.com",
        },
        {
          id: 2,
          value: "hotmail.com",
        },
        {
          id: 3,
          value: "yahoo.com",
        },
        {
          id: 4,
          value: "icloud.com",
        },
        {
          id: 5,
          value: "outlook.com",
        },
        {
          id: 6,
          value: "live.com",
        },
        {
          id: 7,
          value: "mail.ru",
        },
      ]);
    } else {
      setMailProviders([]);
    }
  }, [email]);

  const handleOtp = () => {

    if (!email) {
      return DropdownAlert.show("error",
        getLang(language, "ERROR"),
        getLang(language, "PLEASE_FILL_ALL_BLANKS"));
    }

    // if (!phoneInputRegex.test(phoneNumber)) {
    //   return DropdownAlert.show("error",
    //     getLang(language, "ERROR"),
    //     getLang(language, "PLEASE_CHECK_YOUR_PHONE_NUMBER"));
    // }

    userServices.resetPassword({
      Email: email,
      // Phone: activeCountry.dial_code.substring(1) + phoneNumber.replace(/[^0-9]/g, ""),
      Phone: "",
    }).then((response) => {
      setHasPhone(response.Data.HasPhone);
      setResponse(response.Data);
      // setVerifyType(response.Data.VerifyType);
      setShowValidation(true);
    });
  };

  const handleSetText = (key, val) => key === "email" ? setEmail(val) : setPhone(val);


  const handleSuccessValidation = (token) => navigationRef.current.navigate("SetPassword", { token, hasPhone });

  return (
    <>

      <TabNavigationHeader
        {...props}
        backAble={true}
        options={{ title: getLang(language, "FORGOT_PASSWORD") }}
      />

      <KeyboardAvoidingView
        behavior={"padding"}
        // onPress={() => keyboardShown && Keyboard.dismiss()}
        style={styles.container}>

        <Image
          source={{
            uri: "https://images.coinpara.com/files/mobile-assets/logo.png",
          }}
          style={{
            width: DIMENSIONS.MIDDLE_IMAGE,
            height: DIMENSIONS.MIDDLE_IMAGE,
            tintColor: activeTheme.appWhite,
            marginBottom: 40,
          }}
          resizeMode={"contain"} />

        <View style={styles.wrapper}>
          <FormInput placeholder={input.placeholder}
                     inputKey={input.key}
                     value={email}
                     keyboardType={input.keyboardType}
                     autoComplete={input.autoComplete}
                     returnKey={input.returnKey}
                     autoFocus={input.autoFocus}
                     autoCapitalize={"none"}
                     type={input.type}
                     onChange={(value) => handleSetText(input.key, value)} />


        </View>


      </KeyboardAvoidingView>


      <CustomButton text={getLang(language, "CONTINUE")}
                    filled={true}
                    onPress={handleOtp} />


      <Validation show={showValidation} onHide={() => setShowValidation(false)}
                  descriptionMessage={getLang(language, "VALIDATION_CODE_HAS_BEEN_SENT_TO_YOUR_EMAIL")}
                  type={"forgot-password"}
                  email={email}
                  token={response.Token}
                  userGuid={null}
                  transferInstance={null}
                  resendAble={false}
                  iconType={"phone"}
                  otpId={""}
                  onResult={handleSuccessValidation}
      />

      <InputAccessory
        handleStep={null}
        onPress={(val) => setEmail(email + val)}
        stepAble={false}
        mailProviders={mailProviders}
      />


    </>

  );

};


const ForgotPasswordScreen = styledHigherOrderComponents(ForgotPassword);
export default ForgotPasswordScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // justifyContent: 'flex-end',
  },
  wrapper: {
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: DIMENSIONS.PADDING_H,
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

});
