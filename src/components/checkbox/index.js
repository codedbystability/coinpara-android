import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { TITLE_FONTSIZE } from "../../../utils/dimensions";
import ModalProvider from "../../providers/ModalProvider";
import LanguageSelect from "../language-select";
import generalServices from "../../services/general-services";
import DropdownAlert from "../../providers/DropdownAlert";
import { getLang } from "../../helpers/array-helper";
import { updateLanguage } from "../../actions/global-actions";
import ActionSheetComProvider from "../../providers/ActionSheetComProvider";
import HapticProvider from "../../providers/HapticProvider";
import LocalStorage from "../../providers/LocalStorage";

let isNew = false;
const Checkbox = () => {

  const [selectedLang, setSelectedLang] = useState({});
  const dispatch = useDispatch();
  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const { activeLanguage } = useSelector(state => state.languageReducer);


  useEffect(() => {
    if (Object.keys(selectedLang).length >= 1 && isNew) {
      ModalProvider.hide();
      setTimeout(() => {
        ActionSheetComProvider.show({
          title: getLang(language, "CHANGE_LANGUAGE_POPUP_DESCRIPTION"),
          options: [getLang(language, "CHANGE_LANGUAGE_POPUP_TITLE"), getLang(language, "CANCEL")],
          onAction: (index) => handleLanguageSelect(index),
        });
      }, 250);

    }
  }, [selectedLang]);

  const handleLang = () => {
    setSelectedLang({});
    HapticProvider.trigger();
    ModalProvider.show(() => <LanguageSelect handleSelect={handleLanguageSelectPopUp} />, true, "overFullScreen");
  };
  const handleLanguageSelect = (index) => {
    isNew = false;

    if (index !== 0) {
      setSelectedLang({});
      return;
    }
    ModalProvider.hide();
    generalServices.getLanguageContent(selectedLang.ISO).then((response) => {
      if (response && response.IsSuccess) {
        const newL = [];
        response.Data.map(item => newL[item.key] = item.value);
        DropdownAlert.show("success", getLang(newL, "SUCCESS"), getLang(newL, "LANGUAGE_UPDATED_SUCCESSFULLY"));
        LocalStorage.setObject("theLanguage", response.Data);
        // console.log(' selectedLang - ',selectedLang)//"tr-TR"
        dispatch(updateLanguage(response.Data, selectedLang));
      }
    });
  };

  const handleLanguageSelectPopUp = (lang) => {
    if (lang.Id === activeLanguage.Id) {
      return;
    }
    isNew = true;
    LocalStorage.setObject("selectedLanguageL", lang);
    setSelectedLang(lang);
  };

  if (!activeLanguage || !activeLanguage.Slug) {
    return null;
  }
  return (
    <Pressable
      onPress={handleLang}
      style={styles(activeTheme).activeWrapper}>

      <View style={styles(activeTheme).activeCircle} />

      <Text style={styles(activeTheme).activeText}>{activeLanguage.Slug.toUpperCase()}</Text>

    </Pressable>
  );

};


export default React.memo(Checkbox);

const styles = (props) => StyleSheet.create({
  wrapper: {
    width: 54,
    height: 26,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  activeWrapper: {
    width: 54,
    height: 26,
    backgroundColor: props.activeListBg,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  circle: {
    height: 14,
    width: 14,
    borderRadius: 6,
  },

  activeCircle: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: props.appWhite,
  },
  text: {
    fontFamily: "CircularStd-Bold",
    color: "red",
    fontSize: 14,
  },
  activeText: {
    fontFamily: "CircularStd-Bold",
    color: props.appWhite,
    fontSize: TITLE_FONTSIZE,
  },

});
