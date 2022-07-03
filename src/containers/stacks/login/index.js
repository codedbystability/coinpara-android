import React, { useEffect, useRef, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CustomButton from "../../../components/page-components/button";
import FormInput from "../../../components/page-components/form-input";
import userServices from "../../../services/user-services";
import { useDispatch, useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import TabNavigationHeader from "../../../components/page-components/tab-navigation-header";
import DropdownAlert from "../../../providers/DropdownAlert";
import { navigationRef } from "../../../providers/RootNavigation";
import { DIMENSIONS } from "../../../../utils/dimensions";
import LocalStorage from "../../../providers/LocalStorage";
import Checkbox from "../../../components/page-components/checkbox";
import Validation from "../../../components/page-components/validation";
import { setUser, setUserVerifyType } from "../../../actions/auth-actions";
import { useIsFocused } from "@react-navigation/native";
import { inputs } from "./constants";
import { validateEmail } from "../../../helpers/string-helper";
import ReactNativeBiometrics from "react-native-biometrics";
import ModalProvider from "../../../providers/ModalProvider";
import LockScreen from "../lock-screen";
import InputAccessory from "../../../components/page-components/input-accessory";
import Recaptcha from "react-native-recaptcha-that-works";
import TinyImage from "../../../tiny-image";

let refRow = [];
const Login = (props) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userGuid, setUserGuid] = useState("");
  const [userAuthType, setUserAuthType] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [icon, setIcon] = useState("eye-close");
  const [phone, setPhone] = useState("eye");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const [mailProviders, setMailProviders] = useState([]);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const recaptcha = useRef();

  const checkRecaptcha = () => recaptcha.current.open();

  const handleValidatedUserLogin = () => {
    const instance = {
      Email: email,
      Password: password,
    };

    userServices.check(instance)
      .then((response) => {
        if (response.IsSuccess) {

          //TODO CHECK NEW USER CONTROL
          const storedLoginInstance = LocalStorage.getObject("storedLoginInstance");
          const localPasswordEnabled = LocalStorage.getItem("localPasswordEnabled");
          const localPassword = LocalStorage.getItem("localPassword");

          if (storedLoginInstance && storedLoginInstance.Email && localPassword && localPasswordEnabled && localPasswordEnabled === "true") {
            LocalStorage.removeItem("localPasswordEnabled");
            LocalStorage.removeItem("storedLoginInstance");
            LocalStorage.removeItem("localPassword");
          }


          dispatch(setUserVerifyType(response.Data.VerifyType));
          setPhone(response.Data.Phone);
          LocalStorage.setObject("storedLoginInstance", instance);
          setUserGuid(response.Data.UserGuid);
          setUserAuthType(response.Data.VerifyType); // 1 sms --- 2 google auth  -
          return setShowValidation(true);
        }
      }).catch(err => console.log("err -> ", err));
  };

  const onError = () => DropdownAlert.show("error", getLang(language, "ERROR"), getLang(language, "GOOGLE_RECAPTCHA_REQUIRED"));


  const onExpire = () => DropdownAlert.show("error", getLang(language, "ERROR"), getLang(language, "GOOGLE_RECAPTCHA_REQUIRED"));


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

  useEffect(() => {
    if (isFocused) {
      const storedLoginInstance = LocalStorage.getObject("storedLoginInstance");

      if (storedLoginInstance) {

        if (storedLoginInstance.Email) {
          setEmail(storedLoginInstance.Email);
        }

        setTimeout(() => checkForBiometrics(), 250);
      }

      if (props.route && props.route.params) {
        if (props.route.params.email && props.route.params.password) {
          setEmail(props.route.params.email);
          setPassword(props.route.params.password);
        }
      }
    }
  }, [isFocused]);

  const checkForBiometrics = () => {
    ReactNativeBiometrics.isSensorAvailable().then(({ available, biometryType }) => {
      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        promptBiometric(getLang(language, "TOUCH_ID_REQUIRED"));

      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        promptBiometric(getLang(language, "FACE_ID_REQUIRED"));

      } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
        promptBiometric(getLang(language, "PASSCODE_REQUIRED"));

      } else {
        const localPasswordEnabled = LocalStorage.getItem("localPasswordEnabled");
        if (localPasswordEnabled && localPasswordEnabled === "true") {
          ModalProvider.show(<LockScreen onSuccess={onSuccessPasscode}
                                         isAuth={true}
                                         isCreate={false}
                                         onFail={onFailPasscode} />, false);
        }
      }
    });
  };

  const promptBiometric = (title) => {

    ReactNativeBiometrics.simplePrompt({ promptMessage: title })
      .then((resultObject) => {
        handleBiometricResult(resultObject);
      })
      .catch(() => console.log("biometrics failed"));
  };

  const onFailPasscode = () => ModalProvider.hide();

  const onSuccessPasscode = () => {
    const storedLoginInstance = LocalStorage.getObject("storedLoginInstance");
    storeFromLocal(storedLoginInstance);
  };

  const handleBiometricResult = (result) => {
    const storedLoginInstance = LocalStorage.getObject("storedLoginInstance");
    const localPasswordEnabled = LocalStorage.getItem("localPasswordEnabled");
    if (result.success) {
      storeFromLocal(storedLoginInstance);
    } else if (result.error === "User cancellation" && localPasswordEnabled && localPasswordEnabled === "true") {
      ModalProvider.show(<LockScreen onSuccess={onSuccessPasscode}
                                     isAuth={true}
                                     isCreate={false}
                                     onFail={onFailPasscode} />, false);
    }
  };

  const storeFromLocal = (storedLoginInstance) => {
    setEmail(storedLoginInstance && storedLoginInstance.Email ? storedLoginInstance.Email : "");
    setPassword(storedLoginInstance && storedLoginInstance.Password ? storedLoginInstance.Password : "");
  };

  const handleLogin = () => {
    if (!email || !password) {
      return DropdownAlert.show("error", getLang(language, "INFORMATION"), getLang(language, "PLEASE_FILL_ALL_BLANKS"));
    }
    if (!validateEmail(email)) {
      return DropdownAlert.show("error", getLang(language, "INFORMATION"), getLang(language, "EMAIL_IS_NOT_VALID"));
    }
    return checkRecaptcha();
  };

  const handleSetText = (key, value) => {
    if (key === "email") {
      return setEmail(value);
    }
    setPassword(value);
  };

  const onIconPressed = () => setIcon(icon === "eye-open" ? "eye-close" : "eye-open");

  const parentOnFocus = (index) => setFocusedIndex(index);

  const handleForgotPassword = () => navigationRef.current.navigate("ForgotPassword");

  const handleRegister = () => navigationRef.current.navigate("RegisterStack");


  const onResult = response => {
    if (response.Id) {
      setShowValidation(false);
      dispatch(setUser(response));
      setTimeout(() => navigationRef.current.navigate("Tab"), 500);
    } else {
      DropdownAlert.show("error", getLang(language, "ERROR"), getLang(language, "CODE_NOT_APPROVED"));
    }
  };

  const handleStep = (key) => {
    if (key === "next" && focusedIndex < inputs.length - 1) {
      refRow[focusedIndex + 1].focus();
    } else if (key === "prev" && focusedIndex > 0) {
      refRow[focusedIndex - 1].focus();
    }
  };
  return (
    <>
      <TabNavigationHeader{...props} backAble={true}
                          options={{ title: getLang(language, "LOGIN") }}
      />

      <View
        style={styles(activeTheme).hC}>
        <Checkbox />

      </View>

      <KeyboardAvoidingView
        behavior={"padding"}
        style={styles(activeTheme).container}>

        <Image resizeMode={"contain"}
               source={{ uri: "https://images.coinpara.com/files/mobile-assets/logo.png" }}
               style={{
                 width: DIMENSIONS.MIDDLE_IMAGE,
                 height: DIMENSIONS.MIDDLE_IMAGE,
                 tintColor: activeTheme.appWhite,
                 marginBottom: 40,
               }} />






        <View style={styles(activeTheme).wrapper}>
          {
            inputs.map((input, index) => <FormInput placeholder={input.placeholder}
                                                    ref={ref => refRow[index] = ref}
                                                    parentOnFocus={() => parentOnFocus(index)}
                                                    inputKey={input.key}
                                                    key={input.key}
                                                    value={input.key === "email" ? email : password}
                                                    keyboardType={input.keyboardType}
                                                    autoComplete={input.autoComplete}
                                                    autoCapitalize={input.autoCapitalize}
                                                    returnKey={input.returnKey}
                                                    autoFocus={false}
                                                    icon={input.icon ? icon : null}
                                                    onIconPressed={onIconPressed}
                                                    textContentType={input.textContentType ?? "none"}
                                                    type={input.type === "password" ? icon === "eye-close" ? "password" : "text" : input.type}
                                                    onChange={(value) => handleSetText(input.key, value)} />)
          }


        </View>


        <Pressable style={{ paddingHorizontal: DIMENSIONS.PADDING_H, alignItems: "flex-end", width: "100%" }}
                   onPress={handleForgotPassword}>
          <Text style={styles(activeTheme).forgot}>
            {getLang(language, "FORGOT_PASSWORD")}
          </Text>
        </Pressable>


        <View style={styles(activeTheme).bottom}>
          <Pressable
            onPress={handleRegister}>
            <Text style={styles(activeTheme).noAcc}>
              {getLang(language, "NO_ACCOUNT")} {" "}
              <Text style={{ color: activeTheme.actionColor }}>{getLang(language, "SIGN_UP")}</Text>
            </Text>
          </Pressable>

        </View>

      </KeyboardAvoidingView>

      <CustomButton text={getLang(language, "CONTINUE")}
                    filled={true}
                    style={styles(activeTheme).button}
                    onPress={handleLogin} />


      <Validation show={showValidation}
                  onHide={() => setShowValidation(false)}
                  descriptionMessage={getLang(language, userAuthType === 1 ? "VALIDATION_CODE_HAS_BEEN_SENT_TO_YOUR_PHONE" : "PLEASE_ENTER_AUTHENTICATOR_CODE")}
                  type={"login"}
                  email={phone}
                  userGuid={userGuid}
                  onResult={onResult}
                  iconType={userAuthType === 2 ? "phone" : "email"}
      />

      <InputAccessory
        handleStep={handleStep}
        stepAble={true}
        mailProviders={mailProviders}
        onPress={(val) => setEmail(email + val)}
      />


      <Recaptcha
        ref={recaptcha}
        siteKey="6LcWV-keAAAAAK7a3VaNJRQiL7ciwPzMD05H8Jza"
        baseUrl="https://www.coinpara.com"
        onVerify={handleValidatedUserLogin}
        onError={onError}
        onExpire={onExpire}
        loadingComponent={
          <View style={{
            backgroundColor: "transparent",
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <ActivityIndicator color={activeTheme.secondaryText} />

            <Text style={{
              color: "rgba(255,255,255,.6)",
              fontFamily: "CircularStd-Book",
              fontSize: DIMENSIONS.TITLE_FONTSIZE,
              paddingHorizontal: 20,
              marginTop: 16,
            }}>
              {getLang(language, "VERIFICATION_IS_PROCESSING")}
            </Text>
          </View>
        }
        size="invisible"
      />

    </>
  );
};


const LoginScreen = styledHigherOrderComponents(Login);
export default LoginScreen;

const styles = (props) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
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
  button: {
    backgroundColor: props.actionColor,
    // borderTopLeftRadius: 12,
    // borderTopRightRadius: 12,
  },
  icon: {
    position: "absolute",
    right: 10,
    bottom: 0,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    borderRadius: 8,
    paddingVertical: 4,
  },
  bottom: { paddingHorizontal: DIMENSIONS.PADDING_H, paddingVertical: DIMENSIONS.PADDING_V, alignItems: "center", width: "100%" },
  noAcc: {
    marginVertical: 12,
    fontFamily: "CircularStd-Book",
    color: props.secondaryText,
  },
  forgot: {
    marginVertical: 8,
    fontFamily: "CircularStd-Book",
    color: props.changeRed,
  },
  hC: {
    position: "absolute",
    right: 20,
    top: 80,
    zIndex: 999999,
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 12,
    padding: 6,
  },
});
