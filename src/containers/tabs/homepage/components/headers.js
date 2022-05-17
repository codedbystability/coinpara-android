import React from "react";
import HomepageSlider from "./slider";
import Shortcuts from "./shortcuts";
import Videos from "./videos";
import Announcements2 from "./announcements-pure";
import WalletTotal from "../../../../components/wallet-total";


const HomepageHeaders = (props) => {
  const { refreshing, authenticated } = props;
  return (
    <>
      {/*{authenticated ? <AuthHeader refreshing={refreshing} /> :*/}
      {/*<NonAuthHeader*/}
      {/*  navigation={navigation}*/}
      {/*  activeTheme={activeTheme}*/}
      {/*  language={language}*/}
      {/*  authenticated={authenticated}*/}
      {/*  refreshing={refreshing}*/}
      {/*  activeThemeKey={activeThemeKey} />*/}
      {/*}*/}

      {
        authenticated && <WalletTotal refreshing={refreshing} />
      }

      <HomepageSlider />

      {
        !authenticated && <Videos />

      }

      <Announcements2 />

      <Shortcuts />

    </>
  );
};


export default React.memo(HomepageHeaders);
