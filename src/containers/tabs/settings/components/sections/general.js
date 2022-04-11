import React from "react";
import ScreenSaver from "../screen-saver";
import ThemeSelector from "../theme-selector";
import FontSizeView from "../font-size/font-size-view";
import ColorOption from "../color-option";
import BuySellApprove from "../buysell-approve";
import LanguageItem from "../../components/language-item";

const item = {
  id: 2,
  key: "LANGUAGE_SETTINGS",
  type: "language",
  page: null,
  image: "language",
};

const GeneralSection = (props) => {

  return (
    <>
      <ThemeSelector />
      <FontSizeView />
      <ColorOption />

      <LanguageItem item={item} />
      <BuySellApprove />

      <ScreenSaver />
    </>

  );
};


export default React.memo(GeneralSection);
