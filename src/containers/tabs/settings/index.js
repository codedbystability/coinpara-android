/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { useSelector } from "react-redux";
import SettingsHeader from "./settings-header";
import AccountsSection from "./components/sections/accounts";


const Settings = (props) => {

  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const { authenticated } = useSelector(state => state.authenticationReducer);

  return (
    <>
      <SettingsHeader
        activeTheme={activeTheme}
        language={language}
        props={props}
        authenticated={authenticated}
      />

      <AccountsSection authenticated={authenticated} />
    </>

  );
};

const SettingsScreen = styledHigherOrderComponents(Settings);

export default SettingsScreen;



