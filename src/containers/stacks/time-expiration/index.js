import React, { useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import CustomButton from "../../../components/button";
import FormInput from "../../../components/form-input";
import keyboardAvoidingViewHoc from "../../../hocs/keyboardAvoidingViewHoc";
import { useSelector } from "react-redux";
import userServices from "../../../services/user-services";
import { getLang } from "../../../helpers/array-helper";
import DropdownAlert from "../../../providers/DropdownAlert";
import TabNavigationHeader from "../../../components/tab-navigation-header";


const TimeExpiration = (props) => {

  const [timeValue, setTimeValue] = useState("");

  const { activeTheme, language, keyboardShown } = useSelector(state => state.globalReducer);

  const handleOnPress = () => {
    if (timeValue < 5 || timeValue > 3600) {
      return DropdownAlert.show("error",
        getLang(language, "ERROR"),
        getLang(language, "TIME_SHOULD_BE_IN_5_360"));
    }

    userServices.changeTimeExpiration(timeValue).then((response) => {
      if (response.IsSuccess) {
        DropdownAlert.show("success",
          getLang(language, "SUCCESS"),
          getLang(language, "TIME_EXPIRATION_UPDATED"));
        return props.navigation.goBack();
      }
    });
  };
  const handleOnChange = (value) => setTimeValue(value);
  return (

    <>
      <TabNavigationHeader
        {...props}
        backAble={true}
        isBack={true}
        options={{
          presentation: "modal",
          title: getLang(language, "TIME_EXPIRATION"),
        }}
      />

      <Pressable
        // onPress={() => keyboardShown && Keyboard.dismiss()}
        style={styles(activeTheme).wrapper}>
        <View style={styles(activeTheme).contentWrapper}>

          <Text style={styles(activeTheme).text}>
            {
              getLang(language, "TIME_EXPIRATION_TITLE")
            }
          </Text>

          <FormInput
            returnKey={"done"}
            autoComplete={"off"}
            placeholder={"MINUTE"}
            value={timeValue.toString()}
            keyboardType={"numeric"}
            icon={"22"}
            autoFocus={true}
            onChange={handleOnChange} />
        </View>

      </Pressable>


      <CustomButton text={getLang(language, "CONTINUE")}
                    filled={true}
                    onPress={handleOnPress} />

    </>

  );

};

const TimeExpirationScreen = styledHigherOrderComponents(keyboardAvoidingViewHoc(TimeExpiration));
export default TimeExpirationScreen;


const styles = (props) => StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentWrapper: {
    width: "100%",
    paddingHorizontal: 20,
  },
  text: {
    fontFamily: "CircularStd-Book",
    fontSize: 12,
    color: props.appWhite,
    marginVertical: 10,
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
