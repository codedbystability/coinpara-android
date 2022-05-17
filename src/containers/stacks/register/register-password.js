import React, { useCallback, useEffect, useRef, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { Animated, Image, KeyboardAvoidingView, StyleSheet, View, Easing, Text } from "react-native";
import FormInput from "../../../components/form-input";
import CustomButton from "../../../components/button";
import keyboardAvoidingViewHoc from "../../../hocs/keyboardAvoidingViewHoc";
import { useSelector } from "react-redux";
import userServices from "../../../services/user-services";
import DropdownAlert from "../../../providers/DropdownAlert";
import { getLang } from "../../../helpers/array-helper";
import { navigationRef } from "../../../providers/RootNavigation";
import { MIDDLE_IMAGE, PADDING_H } from "../../../../utils/dimensions";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import { passwordInputs } from "./constants";
import { inputs } from "../login/constants";


let refRow = [];
const RegisterPassword = (props) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  const { language, activeTheme } = useSelector(state => state.globalReducer);

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  // let score = 0;
  const [score, setScore] = useState(0);
  const {
    email = "",
    name = "",
    lastname = "",
    phoneNumber = "",
    refCode = "",
    identityNumber = "",
    birthdate = "",
    nationality = "",
  } = props.route && props.route.params;
  // } = props;


  useEffect(() => {
    checkPassword(password);
  }, [password]);


  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue: score,
      useNativeDriver: false,
      friction: 4,
      tension: 4,
    }).start();
  }, [score]);


  const handleStep = (key) => {
    if (key === "next" && focusedIndex < inputs.length - 1) {
      refRow[focusedIndex + 1].focus();
    } else if (key === "prev" && focusedIndex > 0) {
      refRow[focusedIndex - 1].focus();
    }
  };

  const handleLogin = () => {

    if (!password || !passwordConfirmation) {
      return DropdownAlert.show("error", getLang(language, "ERROR"), getLang(language, "PLEASE_FiLL_ALL_BLANKS"));
    }

    if (password !== passwordConfirmation) {
      return DropdownAlert.show("error", getLang(language, "ERROR"), getLang(language, "PASSWORDS_DONT_MATCH"));
    }

    if (parseFloat(score) < 0.5) {
      return DropdownAlert.show("error", getLang(language, "ERROR"), getLang(language, "PASSWORD_NOT_STRONG"));
    }

    // const passwordMeter = checkPassword(password);


    const instance = {
      IdentityNumber: identityNumber,
      Nationality: nationality,
      Email: email,
      Name: name,
      LastName: lastname,
      PhoneNumber: "+" + phoneNumber.replace(/\s/g, ""),
      Password: password,
      PasswordCopy: passwordConfirmation,
      ReferralCode: refCode,
      BirthDate: birthdate,
    };

    console.log(instance);
    userServices.register(instance).then((response) => {
      if (response && response.IsSuccess) {
        DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "REGISTERED_SUCCESSFULLY"));
        setTimeout(() => {
          navigationRef.current.navigate("Login", {
            email,
            password,
          });
        }, 1000);
      }
    }).catch(err => console.log("err -", err));
  };

  const handleSetText = (key, value) => {
    if (key === "password") {
      return setPassword(value);
    } else if (key === "password-confirmation") {
      return setPasswordConfirmation(value);
    }
  };

  const [icon, setIcon] = useState("eye-open");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const onIconPressed = () => setIcon(icon === "eye-open" ? "eye-close" : "eye-open");

  const parentOnFocus = (index) => setFocusedIndex(index);


  const checkPassword = (pass) => {

    if (!pass)
      return setScore(0);

    let result = 0;

    // award every unique letter until 5 repetitions
    let letters = {};
    for (let i = 0; i < pass.length; i++) {
      letters[pass[i]] = (letters[pass[i]] || 0) + 1;
      result += 5.0 / letters[pass[i]];
    }

    // bonus points for mixing it up
    let variations = {
      digits: /\d/.test(pass),
      lower: /[a-z]/.test(pass),
      upper: /[A-Z]/.test(pass),
      nonWords: /\W/.test(pass),
    };

    let variationCount = 0;
    for (let check in variations) {
      variationCount += (variations[check] === true) ? 1 : 0;
    }
    result += (variationCount - 1) * 10;
    // result = parseInt(score) / 100;

    setScore(parseInt(result) / 100);
    // Animated.timing(widthAnim, {
    //   toValue: score,
    //   duration: 200,
    //   easing: Easing.linear,
    //   useNativeDriver: false,
    // }).start();
    //
    // return score;
  };

  return (
    <>
      <TabNavigationHeader
        {...props}
        backAble={true}
        isBack={true}
        options={{ title: getLang(language, "CREATE_PASSWORD") }}
      />

      <KeyboardAvoidingView behavior={"padding"} style={styles(activeTheme).wrap}>

        {/*<View style={styles(activeTheme).wrap}>*/}


        <View style={{ paddingHorizontal: PADDING_H, width: "100%", alignItems: "center" }}>
          <Image
            source={{
              uri: "https://images.coinpara.com/files/mobile-assets/logo.png",
            }}
            style={styles(activeTheme).img}
            resizeMode={"contain"} />

          {
            passwordInputs.map((input, index) => <FormInput
              ref={ref => refRow[index] = ref}
              parentOnFocus={() => parentOnFocus(index)}
              placeholder={input.placeholder}
              onIconPressed={onIconPressed}
              key={input.key}
              inputKey={input.key}
              icon={icon}
              value={input.key === "password" ? password : passwordConfirmation}
              keyboardType={input.keyboardType}
              autoComplete={input.autoComplete}
              returnKey={input.returnKey}
              autoFocus={input.autoFocus}
              type={icon === "eye-close" ? "default" : "password"}
              onChange={(value) => handleSetText(input.key, value)} />)
          }

          {
            password ? <View style={{
              width: "100%",
              height: 12,
              backgroundColor: "transparent",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: activeTheme.borderGray,
            }}>

              <Animated.View style={{
                width: widthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
                backgroundColor: widthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [activeTheme.noRed, activeTheme.yesGreen],
                }),
                height: "100%",
                borderRadius: 12,

              }}>

              </Animated.View>

            </View> : null
          }

        </View>


        <View style={styles(activeTheme).btn}>

          <CustomButton text={"Continue"}
                        filled={true}
                        onPress={handleLogin} />

        </View>
        {/*</View>*/}
      </KeyboardAvoidingView>

    </>

  );

};

const RegisterPasswordScreen = styledHigherOrderComponents(RegisterPassword);
export default RegisterPasswordScreen;


const styles = props => StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    flex: 1,
  },
  img: { width: MIDDLE_IMAGE, height: MIDDLE_IMAGE, tintColor: props.appWhite, marginBottom: 40 },
  btn: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

});
