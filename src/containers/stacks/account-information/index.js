import React, { useEffect, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { useDispatch, useSelector } from "react-redux";
import { Pressable, StyleSheet, View } from "react-native";
import FormInput from "../../../components/form-input";
import { getLang } from "../../../helpers/array-helper";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import CustomButton from "../../../components/button";
import keyboardAvoidingViewHoc from "../../../hocs/keyboardAvoidingViewHoc";
import FormPhoneInput from "../../../components/phone-input";
import DropdownAlert from "../../../providers/DropdownAlert";
import userServices from "../../../services/user-services";
import { updateUserField } from "../../../actions/auth-actions";
import StillLogo from "../../../components/still-logo";
import { normalizeInput } from "../../../helpers/math-helper";
import { PADDING_H } from "../../../../utils/dimensions";
import { useIsFocused } from "@react-navigation/native";

const inputs = [
  {
    id: 1,
    key: "name",
    type: "text",
    keyboardType: "default",
    placeholder: "YOUR_NAME",
    autoComplete: "off",
    returnKey: "done",
    icon: null,
    editable: true,
  },
  {
    id: 2,
    key: "surname",
    type: "text",
    keyboardType: "default",
    placeholder: "YOUR_SURNAME",
    autoComplete: "off",
    returnKey: "done",
    icon: null,
    disabled: true,
    editable: true,


  },
  {
    id: 3,
    key: "email",
    type: "text",
    keyboardType: "default",
    placeholder: "YOUR_EMAIL",
    autoComplete: "off",
    returnKey: "done",
    // icon: "eye",
    icon: "email-user",
    editable: false,


  },
  {
    id: 4,
    key: "ref",
    type: "text",
    keyboardType: "default",
    placeholder: "YOUR_REFERRAL_CODE",
    autoComplete: "off",
    returnKey: "done",
    icon: "ref-code",
    editable: false,
  },

];

const AccountInformation = (props) => {

  const isFocused = useIsFocused();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [approved, setApproved] = useState(false);
  const [refCode, setRefCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [activeCountry, setActiveCountry] = useState({
    "name": "Turkey",
    "dial_code": "+90",
    "code": "TR",
  });
  const { user } = useSelector(state => state.authenticationReducer);
  const { language, keyboardShown, activeTheme } = useSelector(state => state.globalReducer);
  const { activeLanguage } = useSelector(state => state.languageReducer);

  const dispatch = useDispatch();


  useEffect(() => {
    if (isFocused) {
      userServices.getApproval().then((response) => {
        if (response.IsSuccess) {
          if (response.Data.AdminApproval) {
            setApproved(true);
          }
        }
      });
    }
  }, [isFocused]);


  useEffect(() => {
    if (Object.keys(user).length >= 1) {
      setEmail(user.Email);
      setName(user.Name);
      setSurname(user.Surname);
      setRefCode(user.AffiliateCode);
      setPhoneNumber(user.Phone.replace(activeCountry.dial_code.substring(1), ""));
    }
  }, [user]);
  const handleSetText = (type, value) => {
    switch (type) {
      case "name":
        return setName(value);
      case "surname":
        return setSurname(value);
    }
  };

  const onCountrySelect = (country) => setActiveCountry(country);

  const getInputValue = (key) => {
    if (key === "email")
      return email;

    if (key === "name")
      return name;
    if (key === "surname")
      return surname;
    if (key === "ref")
      return refCode;
  };

  const handleUpdate = () => {
    if (!name || !surname) {
      return DropdownAlert.show("error",
        getLang(language, "ERROR"),
        getLang(language, "PLEASE_FILL_ALL_BLANKS"));
    }

    const instance = {
      "Name": name,
      "Surname": surname,
      "Email": user.Email,
      "Phone": user.Phone,
      "Birthdate": user.Birthdate,
      "Adress": user.Adress,
      "Lang": activeLanguage.Slug,
      "LangId": activeLanguage.Id,
    };

    userServices.updateUser(instance).then((response) => {
      if (response.IsSuccess) {
        dispatch(updateUserField(instance));
        return DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "PROFILE_UPDATED_SUCCESSFULLY"));
      }
    });

  };
  return <>
    <TabNavigationHeader
      {...props}
      backAble={true}
      options={{
        presentation: "modal",
        title: getLang(language, "ACCOUNT_INFORMATION"),
      }}
    />


    <Pressable
      // onPress={() => keyboardShown && Keyboard.dismiss()}
      style={styles.wrapper}>


      <View style={styles.content}>
        {
          inputs.map(input =>
            <FormInput placeholder={input.placeholder}
                       inputKey={input.key}
                       key={input.key}
                       value={getInputValue(input.key)}
                       icon={input.icon}
                       keyboardType={input.keyboardType}
                       autoComplete={input.autoComplete}
                       returnKey={input.returnKey}
                       autoFocus={input.autoFocus}
                       type={input.type}
                       editable={input.editable && !approved}
                       onChange={(value) => handleSetText(input.key, value)} />)
        }


        <FormPhoneInput value={normalizeInput(phoneNumber)}
                        placeholder={getLang(language, "YOUR_PHONE_NUMBER")}
                        activeCountry={activeCountry}
                        onCountrySelect={onCountrySelect}
                        editable={false}
                        onChangePhoneNumber={(number) => setPhoneNumber(number)}
        />

        <StillLogo />
      </View>

      {
        !approved &&
        <View style={styles.btnWrapper}>
          <CustomButton
            onPress={handleUpdate}
            text={getLang(language, "UPDATE")}
          />
        </View>

      }
    </Pressable>

  </>;


};


const AccountInformationScreen = styledHigherOrderComponents(keyboardAvoidingViewHoc(AccountInformation));
export default AccountInformationScreen;
const styles = StyleSheet.create({
  wrapper: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: PADDING_H,
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  container: {
    flex: 1,
  },
  btnWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
