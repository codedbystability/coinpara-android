import React, { useEffect, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView, Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FormInput from "../../../components/page-components/form-input";
import CustomButton from "../../../components/page-components/button";
import userServices from "../../../services/user-services";
import { useSelector } from "react-redux";
import TabNavigationHeader from "../../../components/page-components/tab-navigation-header";
import { getLang } from "../../../helpers/array-helper";
import DropdownAlert from "../../../providers/DropdownAlert";
import { navigationRef } from "../../../providers/RootNavigation";
import { DIMENSIONS } from "../../../../utils/dimensions";
import Validation from "../../../components/page-components/validation";
import CustomCheckbox from "../../../components/page-components/custom-checkbox";
import Linking from "../../../providers/Linking";
import Intercom from "@intercom/intercom-react-native";
import InputAccessory from "../../../components/page-components/input-accessory";
import { validateEmail } from "../../../helpers/string-helper";
import TinyImage from "../../../tiny-image";
import { WebView } from "react-native-webview";

const inputs = [
  {
    id: 1,
    key: "email",
    value: "",
    type: "text",
    keyboardType: "email-address",
    placeholder: "YOUR_EMAIL_ADDRESS",
    autoComplete: "email",
    autoCapitalize: "none",
    autoFocus: true,
    returnKey: "next",
  },
];

const RegisterEmail = (props) => {

  const [email, setEmail] = useState("");
  const [webViewURL, setWebViewURL] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [mailProviders, setMailProviders] = useState([]);
  const [otpId, setOtpId] = useState("");
  const [agreementConfirmed, setAgreementConfirmed] = useState(false);
  const { language, activeTheme, keyboardShown } = useSelector(state => state.globalReducer);
  const { authenticated, user } = useSelector(state => state.authenticationReducer);


  useEffect(() => {
    otpId && setShowValidation(true);
  }, [otpId]);

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

  const handleSendOtp = () => {

    if (!agreementConfirmed) {
      return DropdownAlert.show("error", getLang(language, "ERROR"), getLang(language, "PLEASE_CONFIRM_AGGREEMENTS"));
    }

    if (!email) {
      return DropdownAlert.show("error", getLang(language, "ERROR"), getLang(language, "PLEASE_FILL_YOUR_EMAIL"));
    }

    if (!validateEmail(email)) {
      return DropdownAlert.show("error", getLang(language, "ERROR"), getLang(language, "PLEASE_ENTER_A_VALID_EMAIL"));
    }

    return userServices.sendOtp({
      email,
    }).then(response => {
      if (response.IsSuccess) {
        setOtpId(response.Data);
        getLang(language, "CHECK_YOUR_EMAIL_FOR_CONFIRMATION");
      }
    }).catch(err => {
      console.log("err - ", err);
    });
  };

  const handleSetAgreementConfirmed = () => setAgreementConfirmed(!agreementConfirmed);

  const handleStaticNavigation = (action) => {
    let url = null;
    switch (action) {
      case "V1":
        url = "https://coinpara.com/yasal/kvk-aydinlatma-metni";
        break;
      case "V2":
        url = "https://coinpara.com/yasal/kullanici-sozlesmesi";
        break;
      case "V3":
        url = "https://coinpara.com/yasal/gizlilik-sozlesmesi";
        break;
      case "V4":
        url = "https://coinpara.com/yasal/cerez-politikasi";
        break;
    }


    if (url) {
      setIsLoaded(false);
      setWebViewURL(url);

      // Linking.openURL(url).then(r => null);
    }


  };

  const getTitle = () => {

    const originalText = getLang(language, "I_ACCEPT_TERMSCONDITIONS_AND_PRIVACYPOLICY");
    // const beforeV1 = originalText.split("V1")[0];
    const v1 = getLang(language, "DESCRIPTION_TEXT");
    const betweenV1V2 = originalText.substring(originalText.indexOf("V1"), originalText.lastIndexOf("V2"));
    const v2 = getLang(language, "END_USER_LICENCE_AGGREEMENT");
    const v3 = getLang(language, "PRIVACY_POLICY");
    // const betweenV3V4 = originalText.substring(originalText.indexOf("V3"), originalText.lastIndexOf("V4"));
    const v4 = getLang(language, "COOKIE_POLICY");

    return <Text style={{
      paddingRight: DIMENSIONS.PADDING_H,
      width: "44%",
    }}>
      <Text style={[styles(activeTheme).descText, {}]}>
      </Text>


      <Pressable style={[styles(activeTheme).linkText, {}]}>

        <Text style={[styles(activeTheme).descText, {}]}>
          {getLang(language, "BY_ENABLING_DESCRIPTION")} {" "}
        </Text>
      </Pressable>


      <Pressable onPress={() => handleStaticNavigation("V1")} style={[styles(activeTheme).linkText, {}]}>
        <Text style={[styles(activeTheme).linkText, {}]}>
          {
            v1
          }
        </Text>

      </Pressable>

      <Text style={styles(activeTheme).descText}>
        {", "}
      </Text>


      <Text style={[styles(activeTheme).descText, {}]}>
        {
          betweenV1V2
        }
      </Text>
      <Pressable style={styles(activeTheme).linkText} onPress={() => handleStaticNavigation("V2")}>

        <Text style={styles(activeTheme).linkText}>
          {
            v2
          }
        </Text>
      </Pressable>

      <Text style={styles(activeTheme).descText}>
        {", "}
      </Text>
      <Pressable style={styles(activeTheme).linkText} onPress={() => handleStaticNavigation("V3")}>

        <Text style={styles(activeTheme).linkText}>
          {
            v3
          }
        </Text>
      </Pressable>


      <Pressable style={[styles(activeTheme).linkText, {}]}>
        <Text style={styles(activeTheme).descText}>
          {" "} {getLang(language, "AND")} {" "}
        </Text>
      </Pressable>


      <Pressable style={styles(activeTheme).linkText} onPress={() => handleStaticNavigation("V4")}>

        <Text style={styles(activeTheme).linkText}>
          {
            v4 + " "
          }
        </Text>
      </Pressable>


      <Pressable style={[styles(activeTheme).linkText, {}]}>

        <Text style={styles(activeTheme).descText}>
          {getLang(language, "YOU_ACCEPTED_RELATEDS")}
        </Text>
      </Pressable>

    </Text>;
  };

  const handleSupport = () => {
    if (authenticated) {
      Intercom.registerIdentifiedUser({
        userId: user.Id,
        email: user.Email,
      }).then(null);
    } else {
      Intercom.registerUnidentifiedUser().then(r => console.log("intercom - ", r));
    }
    Intercom.displayMessenger().then(null);
    // return;
  };

  const handleSetText = (key, value) => {

    setEmail(value);
  };

  return (
    <>

      <TabNavigationHeader
        {...props}
        backAble={true}
        options={{
          presentation: "modal",
          title: getLang(language, "SIGN_UP"),
        }}
      />

      <Pressable
        onPress={handleSupport}
        style={styles(activeTheme).hC}>

        <TinyImage parent={"shortcuts/"} name={"contact"} style={styles(activeTheme).icon} />

      </Pressable>


      <KeyboardAvoidingView behavior={"padding"} style={styles(activeTheme).container}>

        <Image
          source={{ uri: "https://images.coinpara.com/files/mobile-assets/logo.png" }}
          style={{
            width: DIMENSIONS.MIDDLE_IMAGE,
            height: DIMENSIONS.MIDDLE_IMAGE,
            tintColor: activeTheme.appWhite,
            marginBottom: 40,
          }}
          resizeMode={"contain"} />


        <View style={styles(activeTheme).wrapper}>
          {
            inputs.map(input => <FormInput
              placeholder={input.placeholder}
              key={input.key}
              inputKey={input.key}
              value={email}
              keyboardType={input.keyboardType}
              autoComplete={input.autoComplete}
              // returnKey={input.returnKey}
              autoFocus={input.autoFocus}
              autoCapitalize={input.autoCapitalize}
              type={input.type}
              onChange={(value) => handleSetText(input.key, value)} />)
          }


          <View style={{
            width: "100%",
            paddingVertical: DIMENSIONS.PADDING_H * 2,
          }}>
            <CustomCheckbox
              {...{
                handleSetAgreementConfirmed,
                agreementConfirmed,
                specialTitle: getTitle(),
              }}
            />
          </View>


          <View style={{ alignItems: "center", width: "100%" }}>
            <Pressable onPress={() => navigationRef.current.navigate("Login")}>

              <Text style={{
                marginVertical: 12,
                fontFamily: "CircularStd-Book",
                color: activeTheme.secondaryText,
              }}>
                {getLang(language, "HAVE_ACCOUNT")} <Text style={{
                color: activeTheme.actionColor,
              }}>{getLang(language, "SIGN_IN")}</Text>
              </Text>
            </Pressable>
          </View>


        </View>

      </KeyboardAvoidingView>

      <CustomButton text={getLang(language, "CONTINUE")}
                    filled={true}
                    onPress={handleSendOtp} />


      <Validation show={showValidation} onHide={() => setShowValidation(false)}
                  descriptionMessage={getLang(language, "CHECK_YOUR_EMAIL_FOR_CONFIRMATION")}
                  type={"register"}
                  email={email}
                  userGuid={null}
                  onResult={() => console.log("onResult")}
                  otpId={otpId}
      />


      <InputAccessory
        handleStep={null}
        onPress={(val) => setEmail(email + val)}
        stepAble={false}
        mailProviders={mailProviders}
      />


      <Modal visible={webViewURL !== null}
             transparent={true}
             animationType="slide"
             presentationStyle={"overFullScreen"}
             onRequestClose={() => {
               setWebViewURL(null);
               setIsLoaded(false);
             }}
             style={{
               flex: 1,
               backgroundColor: activeTheme.backgroundApp,
             }}
      >


        <WebView
          javaScriptEnabled={true}
          onLoadEnd={() =>
            setTimeout(() => {
              setIsLoaded(true);
            }, 500)
          }
          userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
          source={{ uri: webViewURL }}
          style={{
            flex: 1,
            backgroundColor: activeTheme.backgroundApp,
          }}

        />

        {
          !isLoaded && <ActivityIndicator
            color={activeTheme.backgroundApp}
            style={{ position: "absolute", top: DIMENSIONS.SCREEN_HEIGHT / 2, left: DIMENSIONS.SCREEN_WIDTH / 2 }}
            size="large"
          />
        }


        <Pressable style={styles(activeTheme).dismissButton} onPress={() => {
          setWebViewURL(null);
          setIsLoaded(false);
        }}>
          <TinyImage parent={"rest/"} name={"cancel"} style={styles(activeTheme).icon} />
        </Pressable>

      </Modal>

    </>
  );

};

const RegisterEmailScreen = styledHigherOrderComponents(RegisterEmail);
export default RegisterEmailScreen;


const styles = (props) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,

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

  descText: {
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.NORMAL_FONTSIZE - 1,
    color: props.secondaryText,
    // textDecorationLine: "none",
    lineHeight: 24,

  },

  linkText: {
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.NORMAL_FONTSIZE,
    color: props.appWhite,
    textDecorationLine: "underline",
    lineHeight: 24,
  },

  press: {
    width: "100%",
    backgroundColor: "red",
  },

  text: {
    color: props.appWhite,
    fontSize: DIMENSIONS.NORMAL_FONTSIZE,
    marginTop: 8,
    fontFamily: "CircularStd-Book",
  },
  hC: {
    position: "absolute",
    right: 20,
    top: 80,
    zIndex: 999999,
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: props.actionColor,
    padding: 6,
  },
  icon: {
    width: 24,
    height: 24,
  },
  dismissButton: {
    fontFamily: "CircularStd-Bold",
    position: "absolute",
    top: DIMENSIONS.PADDING_H * 4,
    right: DIMENSIONS.PADDING_H,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999999,
    padding: DIMENSIONS.PADDING_H * 1.4,
  },
});
