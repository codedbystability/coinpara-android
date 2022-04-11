import React, { useEffect, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FormInput from "../../../components/form-input";
import CustomButton from "../../../components/button";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import FormPhoneInput from "../../../components/phone-input";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import DropdownAlert from "../../../providers/DropdownAlert";
import { navigationRef } from "../../../providers/RootNavigation";
import {  NORMAL_FONTSIZE, PADDING_H } from "../../../../utils/dimensions";
import { normalizeInput } from "../../../helpers/math-helper";
import { handleTcRegex, handleTcValid, phoneInputRegex } from "../../../helpers/string-helper";
import CountrySelectInput from "../../../components/country-select";
import ModalProvider from "../../../providers/ModalProvider";
import InputAccessory from "../../../components/input-accessory";

const initialInputs = [
  {
    id: 1,
    key: "name",
    value: "",
    type: "text",
    keyboardType: "email-address",
    placeholder: "YOUR_NAME",
    autoComplete: "name",
    autoFocus: false,
    returnKey: "next",
    visible: true,
  },
  {
    id: 2,
    key: "lastname",
    value: "",
    type: "text",
    keyboardType: "email-address",
    placeholder: "YOUR_SURNAME",
    autoComplete: "name",
    autoFocus: false,
    returnKey: "next",
    visible: true,
  },

  {
    id: 3,
    key: "ref",
    value: "",
    type: "text",
    keyboardType: "email-address",
    placeholder: "YOUR_REFERRAL_CODE",
    autoComplete: "off",
    autoFocus: false,
    returnKey: "next",
    visible: false,
  },


];
let refRow = [];
const RegisterAdditional = (props) => {

  const email = props.route.params && props.route.params.email ? props.route.params.email : "--";

  const { language, activeTheme } = useSelector(state => state.globalReducer);


  const [showRefCode, setShowRefCode] = useState(false);
  const [name, setName] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [lastname, setLastname] = useState("");
  const [refCode, setRefCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [inputs, setInputs] = useState(initialInputs);

  const [activeCountry, setActiveCountry] = useState({
    "name": "Turkey",
    "dial_code": "+90",
    "code": "TR",
  });

  const [activeIdCountry, setActiveIdCountry] = useState({
    "name": "Turkey",
    "dial_code": "+90",
    "code": "TR",
  });




  useEffect(() => {
    setInputs(prevState => prevState.map(item => item.key === "ref" ? { ...item, visible: showRefCode } : item));
  }, [showRefCode]);

  const handleSelectCountryId = (country) => {
    setActiveIdCountry(country);
    ModalProvider.hide();
  };

  const onCountrySelect = (country) => setActiveCountry(country);

  const handleRegister = () => {
    if (!name || !lastname || !phoneNumber || !identityNumber || !activeCountry || !activeCountry.name) {
      return DropdownAlert.show("error",
        getLang(language, "ERROR"),
        getLang(language, "PLEASE_FILL_ALL_BLANKS"));
    }


    if (!handleTcValid(identityNumber)) {
      return DropdownAlert.show("error",
        getLang(language, "ERROR"),
        getLang(language, "PLEASE_ENTER_A_VALID_TC_NO"));
    }

    if (!phoneInputRegex.test(phoneNumber)) {
      return DropdownAlert.show("error",
        getLang(language, "ERROR"),
        getLang(language, "PLEASE_CHECK_YOUR_PHONE_NUMBER"));
    }

    const num = phoneNumber.replace(/\s/g, "").replace(/-/g, "").replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
    const validPhone = activeCountry.dial_code.substring(1) + num;

    return navigationRef.current.navigate("RegisterPassword", {
      identityNumber,
      nationality: activeCountry.name,
      name,
      lastname,
      phoneNumber: validPhone,
      email,
      refCode,
    });


  };

  const getInputValue = (input) => {
    if (input.key === "name")
      return name;
    if (input.key === "lastname")
      return lastname;
    if (input.key === "ref")
      return refCode;
  };

  const handleSetText = (key, value) => {
    if (key === "name")
      return setName(value);
    if (key === "lastname")
      return setLastname(value);
    if (key === "ref")
      return setRefCode(value);

  };

  const handleIdentitySet = (val) =>  setIdentityNumber(activeCountry.name === "Turkey" ? val ? handleTcRegex(val) : "" : val);

  const onFocusCountry = () => setFocusedIndex(19);

  const handleStep = (key) => {
    if (key === "next") {
      if (focusedIndex < inputs.filter((input) => input.visible === true).length - 1) {
        refRow[focusedIndex + 1].focus();
      }
      if (focusedIndex === inputs.filter((input) => input.visible === true).length - 1) {
        refRow[42].focus();
      } else if (focusedIndex === 19) {
        refRow[0].focus();
      }
    } else if (key === "prev") {
      if (focusedIndex === 0) {
        refRow[19].focus();
      } else if (focusedIndex === 42) {
        refRow[42].focus();
      } else if (focusedIndex > 0) {
        refRow[focusedIndex - 1].focus();
      }
    }
  };

  const parentOnFocus = (index) => setFocusedIndex(index);

  if (!email || email === "") return null;

  return (
    <>
      <TabNavigationHeader
        {...props}
        backAble={true}
        options={{
          presentation: "modal",
          title: email,
        }}
        headerRight={
          <TouchableOpacity
            onPress={() => setShowRefCode(!showRefCode)}
            activeOpacity={1}
            style={styles(activeTheme).headerRight}>
            <Text style={styles(activeTheme).refText}>
              {showRefCode ? "" : getLang(language, "INVITED_REFERRAL_CODE")}
            </Text>
          </TouchableOpacity>
        }
      />
      {/*<View style={styles(activeTheme).wrapper}>*/}
      <KeyboardAvoidingView behavior={"padding"} style={styles(activeTheme).wrapper}>


        <View style={styles(activeTheme).inputWrapper}>


          <CountrySelectInput
            ref={ref => refRow[19] = ref}
            onFocus={onFocusCountry}
            setIdentityNumber={handleIdentitySet}
            identityNumber={identityNumber}
            activeCountry={activeIdCountry}
            handleSelectCountry={handleSelectCountryId}
          />


          {
            inputs
              .filter((input) => input.visible === true)
              .map((input, index) => <FormInput
                placeholder={input.placeholder}
                key={input.key}
                inputKey={input.key}
                value={getInputValue(input)}
                keyboardType={input.keyboardType}
                autoComplete={input.autoComplete}
                returnKey={input.returnKey}
                autoFocus={input.autoFocus}
                type={input.type}
                parentOnFocus={() => parentOnFocus(index)}
                ref={ref => refRow[index] = ref}
                onChange={(value) => handleSetText(input.key, value)}
              />)
          }


          <FormPhoneInput value={normalizeInput(phoneNumber)}
                          ref={ref => refRow[42] = ref}
                          placeholder={getLang(language, "YOUR_PHONE_NUMBER")}
                          activeCountry={activeCountry}
                          onCountrySelect={onCountrySelect}
                          onChangePhoneNumber={(number) => setPhoneNumber(number)}
          />


          <Text style={styles(activeTheme).description}>
            {getLang(language, "WE_USE_YOUR_PHONE_NUMBER_TO_VERIFY")}
          </Text>

        </View>


        <View style={styles(activeTheme).buttonWrapper}>

          <CustomButton text={"Continue"}
                        filled={true}
                        onPress={handleRegister} />

        </View>
        {/*</View>*/}
      </KeyboardAvoidingView>


      <InputAccessory
        handleStep={handleStep}
        stepAble={true}
        mailProviders={[]}
        onPress={null}
      />
    </>
  );

};


const RegisterAdditionalScreen = styledHigherOrderComponents(RegisterAdditional);
export default RegisterAdditionalScreen;


const styles = (props) => StyleSheet.create({
  container: {
    flex: 1,
  },

  headerRight: {
    position: "absolute",
    right: 10,
    bottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  refText: {
    color: props.actionColor,
    fontFamily: "CircularStd-Medium",
    fontSize: 14,
  },

  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: PADDING_H,
  },

  description: {
    fontFamily: "CircularStd-Book",
    color: props.changeRed,
    fontSize: NORMAL_FONTSIZE,
    // lineHeight: 23,
    marginTop: -2,
    paddingLeft: PADDING_H,
  },

  buttonWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },


  button: {
    // marginTop: 30,
    width: "75%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
  textInput: {
    height: 60,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgb(42,70,92)",
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 0,
    // paddingVertical:12,
    width: "100%",
    marginVertical: 8,

  },
  text: {
    // paddingTop: 12,
    color: "rgba(255,255,255,1)",
  },
});
