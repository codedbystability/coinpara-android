import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StyleSheet, Switch, Text, View } from "react-native";
import { DIMENSIONS } from "../../../../../utils/dimensions";
import { getLang } from "../../../../helpers/array-helper";
import LocalStorage from "../../../../providers/LocalStorage";
import ModalProvider from "../../../../providers/ModalProvider";
import LockScreen from "../../../stacks/lock-screen";
import TinyImage from "../../../../tiny-image";


const Passcode = () => {

  const [passcodeEnabled, setPasscodeEnabled] = useState(false);
  const { activeTheme, fontSizes, language } = useSelector(state => state.globalReducer);

  useEffect(() => {
    const localPasswordEnabled = LocalStorage.getItem("localPasswordEnabled");
    setPasscodeEnabled(localPasswordEnabled && localPasswordEnabled === "true");
  }, []);

  const handleSetUserIdle = (val) => ModalProvider.show(<LockScreen onSuccess={onSuccessPasscode}
                                                                    isCreate={val}
                                                                    isAuth={false}
                                                                    onFail={onFailPasscode} />, false);


  const onSuccessPasscode = () => {
    const localPasswordEnabled = LocalStorage.getItem("localPasswordEnabled");
    setPasscodeEnabled(localPasswordEnabled && localPasswordEnabled === "true");
    ModalProvider.hide();
  };

  const onFailPasscode = () => {
    const localPasswordEnabled = LocalStorage.getItem("localPasswordEnabled");
    setPasscodeEnabled(localPasswordEnabled && localPasswordEnabled === "true");
    ModalProvider.hide();
  };

  return (
    <>
      <View style={styles(activeTheme).wrapper}>
        <View style={styles(activeTheme).leftWrapper}>

          <View style={{ marginRight: 10 }}>
            <TinyImage parent={"settings/"} name={"passcode"} style={styles(activeTheme).icon} />
          </View>

          <Text style={styles(activeTheme, fontSizes).title}>
            {getLang(language, "PASSCODE_ACTIVATION")}
          </Text>

        </View>

        <View style={styles(activeTheme).rightWrapper}>
          <Switch
            trackColor={{ false: activeTheme.darkBackground, true: activeTheme.actionColor }}
            thumbColor={passcodeEnabled ? activeTheme.buttonWhite : activeTheme.secondaryText}
            ios_backgroundColor={activeTheme.darkBackground}
            onValueChange={handleSetUserIdle}
            value={passcodeEnabled}
          />
        </View>
      </View>

      <Text style={styles(activeTheme, fontSizes).svT}>
        {getLang(language, "PASSCODE_DESC")}
      </Text>

    </>
  );
};

export default React.memo(Passcode);

const styles = (props, fontSizes) => StyleSheet.create({
  wrapper: {
    width: "100%",
    marginTop: DIMENSIONS.LIST_MARGIN_T,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: DIMENSIONS.PADDING_V,
    paddingHorizontal: DIMENSIONS.PADDING_H,
    borderRadius: 8,
    backgroundColor: props.darkBackground,
    borderWidth: 1,
    borderColor: props.borderGray,
  },
  leftWrapper: {
    alignItems: "center",
    flexDirection: "row",
  },

  image: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: props.appWhite,
  },

  title: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.BIG_TITLE_FONTSIZE,
    color: props.appWhite,
  },

  rightWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  svT: {
    color: props.secondaryText,
    marginTop: 2,
    // marginBottom: 16,
    fontSize: fontSizes?.NORMAL_FONTSIZE - 2,
    paddingHorizontal: DIMENSIONS.PADDING_H,
  },

  icon: {
    width: 22,
    height: 22,
  },
});
