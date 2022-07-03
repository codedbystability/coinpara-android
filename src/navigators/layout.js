import React from "react";
import { useSelector } from "react-redux";
import NImage from "../components/page-components/image/index.tsx";


const AppStateLayout = ({ show }) => {

  const { activeThemeKey } = useSelector(state => state.globalReducer);
  if (!show)
    return null;
  return (
    <NImage
      useFastImage={true}
      source={{ uri: `https://images.coinpara.com/files/mobile-assets/${activeThemeKey}-bg-full.jpg` }}
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: 99999999,
      }}>
    </NImage>
  );

};

export default AppStateLayout;
