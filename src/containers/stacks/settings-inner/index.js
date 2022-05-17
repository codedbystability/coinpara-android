/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from "react";
import { ScrollView, View, StyleSheet, Pressable, Text } from "react-native";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { useDispatch, useSelector } from "react-redux";
import { PADDING_H } from "../../../../utils/dimensions";
import SecuritySection from "../../tabs/settings/components/sections/security-section";
import GeneralSection from "../../tabs/settings/components/sections/general";
import { useEffect, useState } from "react";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import { getLang } from "../../../helpers/array-helper";
import Loading from "../../../components/loading";
import SettingsLogout from "../../tabs/settings/components/settings-logout";
import generalServices from "../../../services/general-services";
import { setActiveTheme, setClassicColors, setFontSize } from "../../../actions/global-actions";
import LocalStorage from "../../../providers/LocalStorage";
import DropdownAlert from "../../../providers/DropdownAlert";
import TinyImage from "../../../tiny-image";
import FloatingAction from "../../../components/floating-action";

const SecuritySettings = (props) => {

  const dispatch = useDispatch();
  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const { authenticated } = useSelector(state => state.authenticationReducer);
  const [param, setParam] = useState("");


  useEffect(() => {
    if (props.route && props.route.params && props.route.params.param) {
      setParam(props.route.params.param);
    }
  }, [props.route]);


  const handleResetSettings = () => {
    generalServices.getColors("classic").then((response) => {
      if (response && response.IsSuccess) {
        dispatch(setClassicColors(response.Data));
        LocalStorage.setItem("activeTheme", "classic");
        dispatch(setActiveTheme("classic", response.IconColor));
        dispatch(setFontSize(11));
      }
    });
  };

  return (

    <>
      <TabNavigationHeader
        {...props}
        backAble={true}
        options={{
          title: getLang(language, param === "system" ? "SYSTEM_SETTINGS" : "SECURITY_SETTINGS"),
        }}
      />

      <View style={styles(activeTheme).wrapper}>

        <SecuritySection />

      </View>


    </>

  );
};

const SecuritySettingsScreen = styledHigherOrderComponents(SecuritySettings);

export default SecuritySettingsScreen;


const styles = props => StyleSheet.create({
  wrapper: {
    flex: 1, backgroundColor: props.backgroundApp,
    paddingHorizontal: PADDING_H, paddingVertical: 40,
  },
  wrapper2: {
    marginTop: 60,
  },
  text: {
    textAlign: "center",
    fontFamily: "CircularStd-Bold",
    color: props.secondaryText,
  },
});
