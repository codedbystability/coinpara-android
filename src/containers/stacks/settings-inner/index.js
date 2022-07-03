import * as React from "react";
import { View, StyleSheet } from "react-native";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { useSelector } from "react-redux";
import { DIMENSIONS } from "../../../../utils/dimensions";
import SecuritySection from "../../tabs/settings/components/sections/security-section";
import { useEffect, useState } from "react";
import TabNavigationHeader from "../../../components/page-components/tab-navigation-header";
import { getLang } from "../../../helpers/array-helper";

const SecuritySettings = (props) => {

  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const [param, setParam] = useState("");

  useEffect(() => {
    if (props.route && props.route.params && props.route.params.param) {
      setParam(props.route.params.param);
    }
  }, [props.route]);


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
    paddingHorizontal: DIMENSIONS.PADDING_H,
    paddingVertical: DIMENSIONS.PADDING_H * 2,
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
