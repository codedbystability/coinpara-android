import React from "react";
import { useSelector } from "react-redux";
import NonAuthHeader from "./nonauth-header";
import AuthHeader from "./auth-header";
import HomepageSlider from "./slider";
import Shortcuts from "./shortcuts";
import Videos from "./videos";
import Announcements2 from "./announcements-pure";


const HomepageHeaders = ({ refreshing }) => {
  const { authenticated } = useSelector(state => state.authenticationReducer);
  const { activeTheme, activeThemeKey } = useSelector(state => state.globalReducer);

  return (
    <>
      {authenticated ? <AuthHeader refreshing={refreshing} /> :
        <NonAuthHeader activeTheme={activeTheme} activeThemeKey={activeThemeKey} />}

      <HomepageSlider />

      <Videos />

      <Announcements2 />

      <Shortcuts />

    </>
  );
};


export default React.memo(HomepageHeaders);
