import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Pressable, KeyboardAvoidingView,
} from "react-native";
import { useSelector } from "react-redux";
import CustomButton from "../button";
import userServices from "../../../services/user-services";
import { navigationRef } from "../../../providers/RootNavigation";
import transferServices from "../../../services/transfer-services";
import { getLang } from "../../../helpers/array-helper";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { isIphoneX } from "../../../../utils/devices";
import { replaceAll } from "../../../helpers/string-helper";
import Clipboard from "@react-native-community/clipboard";
import { useIsFocused } from "@react-navigation/native";
import TinyImage from "../../../tiny-image";

const CODE_LENGTH = new Array(6).fill(0);

const Validation = (props) => {
  const {
    show,
    onHide,
    descriptionMessage,
    email,
    type,
    userGuid,
    onResult,
    transferInstance,
    token,
    otpId,
    iconType = "email",
    resendAble = transferInstance,
  } = props;
  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const isFocused = useIsFocused();

  const [remainSeconds, setRemainSeconds] = useState(120);
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const values = value.split("");
  const input = useRef(null);

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        handlePress();
      }, 500);
    }
  }, [isFocused]);

  useEffect(() => {
    if (show && iconType === "phone") {
      setError(null);
      setRemainSeconds(120);
      const interval = setInterval(() => {
        setRemainSeconds(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      setValue("");
      setTimeout(() => {
        handlePress();
      }, 1000);
    }
  }, [show]);

  useEffect(() => {
    if (value.length === CODE_LENGTH.length) {
      // Keyboard.dismiss();
      setLoading(true);
      if (type === "register") {
        handleValidateOtp();
      } else if (type === "login") {
        handleGetToken();
      } else if (type === "forgot-password") {
        handleResetPassword();
      } else if (type === "transfer-otp") {
        handleTransferOtpValidate();
      }
    }
  }, [value]);

  const handlePress = () => input.current?.focus();

  const handleFocus = () => setFocused(true);

  const handleChange = (newValue) => {
    if (newValue.length === 6) {
      setValue(newValue);
    } else if (newValue.length === 1) {
      setValue((prevState => (prevState + newValue).slice(0, 6)));
    }
  };

  const handleResetPassword = () => {
    userServices.validateReset({
      Token: token,
      OTP: value,
    }).then((response) => {
      setTimeout(() => setLoading(false), 500);
      if (response && response.IsSuccess) {
        onHide();
        return onResult(token);
      } else {
        return setError(getLang(language, "CODE_NOT_VALID"));
      }
    });
  };

  const handleKeyPress = (e) => {
    if (e.nativeEvent.key === "Backspace") {
      setValue((prevState => prevState.slice(0, prevState.length - 1)));
      if (error && value.length === 6) {
        setTimeout(() => setError(null), 250);
        // warnText.current?.animate({
        //     0: {scale: 1, opacity: 1},
        //     1: {scale: 0, opacity: .5},
        // });
      }
    }
  };

  const handleCopyPaste = async () => {
    const otp = await Clipboard.getString();
    if (otp && otp.length === 6) {
      setValue(otp);
    }
  };

  const handleValidateOtp = () => {
    userServices.validateOtp(otpId, value).then((response) => {
      setTimeout(() => setLoading(false), 500);
      if (response.IsSuccess) {
        onHide();
        return navigationRef.current.navigate("RegisterAdditional", { email });
      } else {
        return setError(getLang(language, "CODE_NOT_VALID"));
      }
    }).catch(err => console.log("err", err));
  };

  const handleTransferOtpValidate = () => {

    const otpInstance = {
      TargetAccount: transferInstance.ToWalletAddress,
      CoinGuid: transferInstance.CoinGuid,
      Amount: transferInstance.Amount,
      DestinationTag: transferInstance.DestinationTag ?? "",
      OTP: value,
    };

    transferServices.validateOtp(otpInstance).then((response) => {
      setLoading(false);
      return onResult(response);
    }).catch(err => console.log("err", err));
  };

  const handleGetToken = () => {
    const instance = {
      grant_type: "password",
      refresh_token: "",
      password: value,
      username: userGuid,
    };

    userServices.token(instance).then((response) => {
      setTimeout(() => setLoading(false), 500);
      if (!response || !response.Id) {
        return setError(getLang(language, "CODE_NOT_VALID"));
      }
      onResult(response);
    }).catch(err => console.log("err -> ", err));
  };

  return (
    <Modal
      hideModalContentWhileAnimating={true} useNativeDriver={true}
      animationType={"slide"}
      presentationStyle={"overFullScreen"}
      transparent={false}
      visible={show}
      onHide={onHide} onRequestClose={onHide}
      statusBarTranslucent
    >

      <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
        <View style={styles(activeTheme).container}>

          <View style={{ paddingBottom: DIMENSIONS.PADDING_H * 2 }}>
            <TinyImage parent={"rest/"} name={iconType === "phone" ? "google-auth" : "email"}
                       style={styles(activeTheme).icon} />
          </View>

          <Text style={styles(activeTheme).desc}>{descriptionMessage}</Text>

          <Text style={styles(activeTheme).desc}>{email}</Text>

          <TouchableOpacity activeOpacity={1} onPress={handlePress} style={styles(activeTheme).wrap}>
            {CODE_LENGTH.map((v, index) => {
              const selected = values.length === index;
              const filled = values.length === CODE_LENGTH.length && index === CODE_LENGTH.length - 1;
              const removeBorder = index === CODE_LENGTH.length - 1 ? styles(activeTheme).noBorder : undefined;
              return (
                <View style={[styles(activeTheme).display, removeBorder]} key={index}>
                  <Text style={styles(activeTheme).text}>{values[index] || ""}</Text>
                  {(selected || filled) && focused && <View style={styles(activeTheme).shadows} />}
                </View>
              );
            })}
          </TouchableOpacity>


          <Pressable
            onPress={handleCopyPaste}
            style={{
              paddingTop: 24,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Text style={{
              fontFamily: "CircularStd-Book",
              color: activeTheme.appWhite,
              fontSize: 16,
              marginRight: 10,
            }}>
              {getLang(language, "PASTE")}
            </Text>

            <TinyImage parent={"rest/"} name={"copy"}
                       style={styles(activeTheme).icon} />
          </Pressable>


          <TextInput
            keyboardAppearance={"dark"}
            // autoComplete={"sms-otp"}
            textContentType={"oneTimeCode"}
            style={{
              position: "absolute",
              color: "transparent",
              backgroundColor: "transparent",
              width: 200,
              height: 40,
            }}
            caretHidden={true}
            importantForAutofill={"yes"}
            onFocus={handleFocus}
            onKeyPress={handleKeyPress}
            onChangeText={handleChange}
            value={""}
            ref={input}
            autoFocus={false}
            keyboardType="numeric"
            // keyboardAppearance={activeThemeKey === "light" ? "light" : "dark"}
          />

          <View style={styles(activeTheme).buttonWrapper}>
            {
              error ? <Text
                animation={"slideInLeft"}
                style={styles(activeTheme).warningText}>{error}</Text> : null

            }

            {
              iconType === "phone" && resendAble && remainSeconds >= 1 ?
                <Text
                  style={styles(activeTheme).secondsText}>{replaceAll(getLang(language, "VALIDATION_CODE_SECONDS"), "v1", remainSeconds)}</Text>
                :

                iconType === "phone" && resendAble &&
                <CustomButton onPress={() => Alert.alert("resend code")}
                              filled={true}
                              text={getLang(language, "RESEND_CODE")}
                              style={{ marginVertical: DIMENSIONS.MARGIN_T }}
                              isRadius={true}
                />
            }


          </View>


        </View>
      </KeyboardAvoidingView>

      {
        loading && <View style={styles(activeTheme).load}>
          <ActivityIndicator color={activeTheme.actionColor} />
        </View>
      }

      <TouchableOpacity onPress={onHide} activeOpacity={1} style={[styles(activeTheme).dismissButton]}>
        <TinyImage parent={"rest/"} name={"cancel"} style={styles(activeTheme).icon2} />
      </TouchableOpacity>

    </Modal>
  );


};


export default Validation;
const styles = (props) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // paddingTop: isIphoneX ? DIMENSIONS.MARGIN_T : DIMENSIONS.MARGIN_T / 2,
    backgroundColor: props.backgroundApp,
  },
  wrap: {
    borderWidth: 1,
    borderColor: props.borderGray,
    borderRadius: 5,
    position: "relative",
    flexDirection: "row",
  },
  display: {
    borderRightWidth: 1,
    borderRightColor: props.borderGray,
    width: DIMENSIONS.SCREEN_WIDTH / 6 - (40 / 6),
    height: isIphoneX ? 74 : 66,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  text: {
    fontSize: 32,
    color: props.appWhite,
    fontFamily: "CircularStd-Book",
  },
  noBorder: {
    borderRightWidth: 0,
  },
  input: {
    position: "absolute",
    fontSize: 32,
    textAlign: "center",
    backgroundColor: "transparent",
    width: 32,
    top: 0,
    bottom: 0,
    color: props.appWhite,

  },
  shadows: {
    position: "absolute",
    left: -1,
    top: -1,
    bottom: -1,
    right: -1,
    borderColor: props.appWhite,
    borderWidth: 1,
    borderRadius: 5,
  },

  secondsText: {
    marginVertical: 24,
    fontSize: 12,
    fontFamily: "CircularStd-Bold",
    color: props.secondaryText,
    textAlign: "center",
  },


  warningText: {
    marginVertical: 4,
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    fontFamily: "CircularStd-Bold",
    color: props.noRed,
    textAlign: "center",
    paddingHorizontal: DIMENSIONS.PADDING_H,
  },

  resendContainer: {
    marginVertical: 40,
  },
  resendText: {
    fontSize: 16,
    fontFamily: "CircularStd-Bold",
    color: props.secondaryText,
  },
  desc: {
    marginBottom: 20,
    fontSize: 13,
    fontFamily: "CircularStd-Book",
    color: props.appWhite,
    lineHeight: 23,
    letterSpacing: 0,
    textAlign: "center",
    paddingHorizontal: "10%",
  },
  img: {
    marginVertical: isIphoneX ? DIMENSIONS.PADDING_H * 2 : DIMENSIONS.PADDING_H,
    tintColor: props.secondaryText,
    height: 40,
    width: 40,
  },
  buttonWrapper: {
    paddingHorizontal: DIMENSIONS.PADDING_H,
    paddingVertical: 12,
    width: "100%",
  },
  dismissButton: {
    fontFamily: "CircularStd-Bold",
    color: "#fff",
    position: "absolute",
    top: 36,
    right: 24,
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  load: {
    position: "absolute",
    bottom: "50%",
    height: 80,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: DIMENSIONS.MARGIN_T,
  },
  icon2: {
    width: 18,
    height: 18,
  },
  icon: {
    width: 26,
    height: 22,
  },
});
