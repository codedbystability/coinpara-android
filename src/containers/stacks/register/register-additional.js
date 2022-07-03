import React, { useEffect, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FormInput from "../../../components/page-components/form-input";
import CustomButton from "../../../components/page-components/button";
import TabNavigationHeader from "../../../components/page-components/tab-navigation-header";
import FormPhoneInput from "../../../components/page-components/phone-input";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import DropdownAlert from "../../../providers/DropdownAlert";
import { navigationRef } from "../../../providers/RootNavigation";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { normalizeInput } from "../../../helpers/math-helper";
import { handleTcRegex, handleTcValid, phoneInputRegex } from "../../../helpers/string-helper";
import CountrySelectInput from "./components/country-select-input";
import ModalProvider from "../../../providers/ModalProvider";
import InputAccessory from "../../../components/page-components/input-accessory";
import moment from "moment";
import TinyImage from "../../../tiny-image";
import DatePicker from "react-native-date-picker";

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

  // {
  //   id: 4,
  //   key: "birthdate",
  //   value: "",
  //   type: "text",
  //   keyboardType: "numeric",
  //   placeholder: "YOUR_BIRTHDATE",
  //   autoComplete: "name",
  //   autoFocus: false,
  //   isMasked: true,
  //   returnKey: "next",
  //   visible: true,
  //   mask: "[0000]-[00]-[00]",
  // },

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
const FROM_DATE = moment().subtract(20, "years").toDate();

const RegisterAdditional = (props) => {

  const email = props.route.params && props.route.params.email ? props.route.params.email : "--";

  const { language, activeTheme, activeThemeKey } = useSelector(state => state.globalReducer);


  const [showRefCode, setShowRefCode] = useState(false);
  const [name, setName] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [lastname, setLastname] = useState("");
  const [refCode, setRefCode] = useState("");
  const [birthDate, setBirthDate] = useState(FROM_DATE);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
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
      nationality: activeCountry.code,
      name,
      lastname,
      phoneNumber: validPhone,
      email,
      refCode,
      birthdate: moment(birthDate).format("YYYY-MM-DD") + "T00:00:00",
    });


  };

  const getInputValue = (input) => {
    if (input.key === "name")
      return name;
    if (input.key === "lastname")
      return lastname;
    if (input.key === "ref")
      return refCode;
    if (input.key === "birthdate")
      return birthDate;
  };

  const handleSetText = (key, value) => {
    if (key === "name")
      return setName(value);
    if (key === "lastname")
      return setLastname(value);
    if (key === "ref")
      return setRefCode(value);
    if (key === "birthdate")
      return setBirthDate(value);

  };

  const handleIdentitySet = (val) => setIdentityNumber(activeCountry.name === "Turkey" ? val ? handleTcRegex(val) : "" : val);

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
        isBack={true}
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
                mask={input.mask}
                isMasked={input.isMasked || false}
                type={input.type}
                parentOnFocus={() => parentOnFocus(index)}
                ref={ref => refRow[index] = ref}
                onChange={(value) => handleSetText(input.key, value)}
              />)
          }


          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={styles(activeTheme).inp1}>

            <Text style={styles(activeTheme).dte}>{moment(birthDate).format("DD-MM-YYYY")}</Text>

            <TinyImage parent={"rest/"} name={"c-down"} style={styles(activeTheme).a1} />


          </Pressable>


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
      </KeyboardAvoidingView>


      <InputAccessory
        handleStep={handleStep}
        stepAble={true}
        mailProviders={[]}
        onPress={null}
      />

      <DatePicker
        modal
        mode={"date"}
        confirmText={getLang(language, "APPROVE")}
        cancelText={getLang(language, "CANCEL")}
        theme={activeThemeKey === "light" ? "light" : "dark"}
        textColor={activeTheme.appWhite}
        title={getLang(language, "BIRTH_DATE")}
        // maximumDate={activeDateType === "END_DATE" ? moment().toDate() : startDate}
        open={showDatePicker}
        date={birthDate}
        onConfirm={(date) => {
          setBirthDate(date);
          setShowDatePicker(false);
        }}

        onCancel={() => setShowDatePicker(false)}
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
    fontFamily: "CircularStd-Book",
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
    paddingHorizontal: DIMENSIONS.PADDING_H,
  },

  description: {
    fontFamily: "CircularStd-Book",
    color: props.changeRed,
    fontSize: DIMENSIONS.NORMAL_FONTSIZE,
    // lineHeight: 23,
    marginTop: -2,
    paddingLeft: DIMENSIONS.PADDING_H,
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

  inp1: {
    width: "100%",
    height: DIMENSIONS.INPUT_HEIGHT,
    borderColor: props.borderGray,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: DIMENSIONS.PADDING_H,
    flexDirection: "row",
  },
  dte: {
    color: props.appWhite,
    fontFamily: "CircularStd-Bold",
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
  },
});
