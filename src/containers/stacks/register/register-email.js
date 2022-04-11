import React, { useEffect, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FormInput from "../../../components/form-input";
import CustomButton from "../../../components/button";
import userServices from "../../../services/user-services";
import { useSelector } from "react-redux";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import { getLang } from "../../../helpers/array-helper";
import DropdownAlert from "../../../providers/DropdownAlert";
import { navigationRef } from "../../../providers/RootNavigation";
import { MIDDLE_IMAGE, NORMAL_FONTSIZE } from "../../../../utils/dimensions";
import Validation from "../../../components/validation";
import CustomCheckbox from "../../../components/custom-checkbox";
import Linking from "../../../providers/Linking";
import Intercom from "@intercom/intercom-react-native";
import InputAccessory from "../../../components/input-accessory";
import { validateEmail } from "../../../helpers/string-helper";
import TinyImage from "../../../tiny-image";

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
        url = "https://alpha.coinpara.com/yasal/kvk-aydinlatma-metni";
        break;
      case "V2":
        url = "https://alpha.coinpara.com/yasal/kullanici-sozlesmesi";
        break;
      case "V3":
        url = "https://alpha.coinpara.com/yasal/gizlilik-sozlesmesi";
        break;
      case "V4":
        url = "https://alpha.coinpara.com/yasal/cerez-politikasi";
        break;
    }

    if (url) {
      Linking.openURL(url).then(r => null);
    }

  };

  const getTitle = () => {

    const originalText = getLang(language, "I_ACCEPT_TERMSCONDITIONS_AND_PRIVACYPOLICY");
    // const beforeV1 = originalText.split("V1")[0];
    const v1 = getLang(language, "DESCRIPTION_TEXT");
    const betweenV1V2 = originalText.substring(originalText.indexOf("V1"), originalText.lastIndexOf("V2"));
    const v2 = getLang(language, "END_USER_LICENCE_AGGREEMENT");
    const v3 = getLang(language, "PRIVACY_POLICY");
    const betweenV3V4 = originalText.substring(originalText.indexOf("V3"), originalText.lastIndexOf("V4"));
    const v4 = getLang(language, "COOKIE_POLICY");

    return <Text style={{}}>
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
    return;
  };
  const handleSetText = (key, value) => {

    setEmail(value);
  };

  const inputAccessoryViewID = "inputAccessoryViewID";
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
          style={{ width: MIDDLE_IMAGE, height: MIDDLE_IMAGE, tintColor: activeTheme.appWhite, marginBottom: 40 }}
          resizeMode={"contain"} />


        <View style={styles(activeTheme).wrapper}>
          {
            inputs.map(input => <FormInput
              placeholder={input.placeholder}
              key={input.key}
              // inputAccessoryViewID={inputAccessoryViewID}
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


          <CustomCheckbox
            {...{
              handleSetAgreementConfirmed,
              agreementConfirmed,
              specialTitle: getTitle(),
            }}
          />


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
    paddingHorizontal: 20,
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  descText: {
    fontFamily: "CircularStd-Book",
    fontSize: NORMAL_FONTSIZE - 1,
    color: props.secondaryText,
    // textDecorationLine: "none",
    lineHeight: 24,

  },

  linkText: {
    fontFamily: "CircularStd-Book",
    fontSize: NORMAL_FONTSIZE,
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
    fontSize: NORMAL_FONTSIZE,
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
});
