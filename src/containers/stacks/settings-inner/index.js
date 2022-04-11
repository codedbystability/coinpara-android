/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { useSelector } from "react-redux";
import { PADDING_H } from "../../../../utils/dimensions";
import SettingsHeader from "../../tabs/settings/settings-header";
import SecuritySection from "../../tabs/settings/components/sections/security-section";
import GeneralSection from "../../tabs/settings/components/sections/general";
import { useEffect, useState } from "react";

const SettingsInner = (props) => {

  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const [param, setParam] = useState("");


  useEffect(() => {
    if (props.route && props.route.params && props.route.params.param) {
      setParam(props.route.params.param);
    }
  }, [props.route]);

  return (

    <>

      <SettingsHeader
        title={param === "system" ? "SYSTEM_SETTINGS" : "SECURITY_SETTINGS"}
        language={language}
        props={props}
        authenticated={true}
        backAble={true}
      />


      <View style={styles(activeTheme).wrapper}>


        {
          param === "system" ?
            <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles(activeTheme).scroll}>

              <GeneralSection />
            </ScrollView>
            :
            <SecuritySection />
        }


      </View>

    </>

  );
};

const SettingsScreen = styledHigherOrderComponents(SettingsInner);

export default SettingsScreen;


const styles = props => StyleSheet.create({
  wrapper: {
    flex: 1, backgroundColor: props.backgroundApp,
    paddingHorizontal: PADDING_H, paddingVertical: 40,
  },
});
