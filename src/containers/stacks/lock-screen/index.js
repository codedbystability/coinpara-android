import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable, FlatList, Image, Keyboard } from "react-native";
import {
  BIG_TITLE_FONTSIZE,
  MARGIN_T, MIDDLE_IMAGE,
  PADDING_H,
  SCREEN_WIDTH,
  TITLE_FONTSIZE,
} from "../../../../utils/dimensions";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { useSelector } from "react-redux";
import LocalStorage from "../../../providers/LocalStorage";
import { getLang } from "../../../helpers/array-helper";
import ModalProvider from "../../../providers/ModalProvider";
import { isIphoneX } from "../../../../utils/devices";
import { useIsFocused } from "@react-navigation/native";
import HapticProvider from "../../../providers/HapticProvider";

const numbers = [
  {
    value: 1,
    text: "-",
  },
  {
    value: 2,
    text: "ABC",
  },
  {
    value: 3,
    text: "DEF",
  },
  {
    value: 4,
    text: "GHI",
  },
  {
    value: 5,
    text: "JKL",
  },
  {
    value: 6,
    text: "MNO",
  },
  {
    value: 7,
    text: "PQRS",
  },
  {
    value: 8,
    text: "TUV",
  },
  {
    value: 9,
    text: "WXYZ",
  },
  {
    value: null,
    text: null,
    action: "DELETE",
  },
  {
    value: 0,
    text: "-",
  },
  {
    value: null,
    text: null,
    show: true,
    action: "CANCEL",

  },
];
const PASSWORD_LENGTH = 4;
const LockScreen2 = (props) => {

  const { onSuccess = null, onFail = null, isAuth = false, isCreate = false } = props;

  const [newRegistered, setNewRegistered] = useState(false);
  const [isApprove, setIsApprove] = useState(false);
  const [notMatch, setNotMatch] = useState(false);
  const localPassword = LocalStorage.getItem("localPassword");

  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");

  const isFocused = useIsFocused();


  useEffect(() => {
    if (isApprove)
      Keyboard.dismiss();
  }, [isFocused]);


  useEffect(() => {
    if (value) {
      setNotMatch(false);
    }
    if (value.length === 4) {
      if (!isCreate && !isAuth) {
        if (isApprove) {
          if (value === localPassword) {
            LocalStorage.removeItem("localPassword");
            LocalStorage.removeItem("localPasswordEnabled");
            onSuccess();
          }
        } else {
          if (value === localPassword) {
            setIsApprove(true);
            setValue("");
            setValue2("");
          } else {
            setValue("");
            setValue2("");
            setNotMatch(true);
          }
        }
      } else if (isCreate && !isApprove) {
        setValue2(value);
        setValue("");
        setIsApprove(true);
      } else if (isCreate && isApprove) {
        if (value !== value2) {
          setValue("");
          setValue2("");
          setNotMatch(true);
          setIsApprove(false);
          HapticProvider.trigger();
        } else {
          setNewRegistered(true);
        }
      } else {
        checkForAuth();
      }
    }
  }, [value]);

  useEffect(() => {
    if (newRegistered) {
      setTimeout(() => {
        LocalStorage.setItem("localPassword", value);
        LocalStorage.setItem("localPasswordEnabled", "true");
        hideModal();
        onSuccess && onSuccess();
      }, 1000);
    }

  }, [newRegistered]);

  const checkForAuth = () => {
    if (localPassword === value) {
      setValue("");
      setValue2("");
      onSuccess();
      hideModal();
    } else {
      setValue("");
      setValue2("");
      setNotMatch(true);
    }
  };

  const hideModal = () => ModalProvider.hide();

  const handleSet = (item) => setValue(value + item.value);

  const getDynamicTitle = () => {
    if (notMatch) {
      return <Text
        style={[styles(activeTheme).desc, { color: activeTheme.noRed }]}>{getLang(language, "PINS_NOT_MATCH")}</Text>;
    }
    if (isApprove) {
      return <Text style={styles(activeTheme).desc}>2- {getLang(language, "VALIDATE_YOUR_PIN")}</Text>;
    }
    if (isCreate) {
      return <Text
        style={[styles(activeTheme).desc, { color: activeTheme.appWhite }]}>1- {getLang(language, "DECLARE_YOUR_PIN")}</Text>;
    } else {
      return <Text
        style={[styles(activeTheme).desc, { color: activeTheme.appWhite }]}>{getLang(language, "ENTER_YOUR_PIN_TO_AUTHENTICATE")}</Text>;
    }
  };

  const handleAction = (action) => {
    HapticProvider.trigger();
    if (action === "CANCEL") {
      onFail();
    } else {
      setValue(value ? value.slice(0, -1) : "");
    }
  };

  const renderNumber = ({ item, index }) => {

    if (!item.text) {
      return (
        <Pressable onPress={() => handleAction(item.action)}
                   style={[styles(activeTheme).numberWrap, {
                     borderWidth: 0,
                     borderRadius: 0,
                     overflow: "visible",
                   }]}>
          <Text style={styles(activeTheme).desc}>{getLang(language, item.action)}</Text>
        </Pressable>
      );
    }

    return (
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? activeTheme.inActiveListBg
              : "transparent",
          },
          styles(activeTheme).numberWrap,
        ]}
        onPress={() => handleSet(item)}
      >
        {
          item.value !== null ? <Text style={styles(activeTheme).number}>{item.value}</Text> : null
        }
        <Text style={styles(activeTheme).alpha}>{item.text}</Text>
      </Pressable>
    );
  };
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>

      <View style={styles(activeTheme).valueWrap1}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Image
            source={{
              uri: "https://images.coinpara.com/files/mobile-assets/logo.png",
            }}
            style={{
              width: MIDDLE_IMAGE,
              height: MIDDLE_IMAGE,
              tintColor: activeTheme.appWhite,
            }}
            resizeMode={"contain"} />
          {
            newRegistered ? <Text style={[styles(activeTheme).desc, { color: activeTheme.changeGreen }]}>
              {
                getLang(language, "PASSCODE_REGISTRATION_COMPLETED")
              }
            </Text> : null
          }

          {
            getDynamicTitle()
          }
        </View>
        <View style={styles(activeTheme).val}>
          {
            new Array(PASSWORD_LENGTH).fill(0).map((item, i) => {
              return (
                <View key={i.toString()} style={[styles(activeTheme).valueWrap, {
                  backgroundColor: value[i] ? activeTheme.appWhite : "transparent",
                }]}>
                </View>
              );
            })
          }
        </View>

      </View>

      <View style={styles(activeTheme).bottomWrap}>
        <View style={styles(activeTheme).list}>
          <FlatList data={numbers} numColumns={3}
                    contentContainerStyle={styles(activeTheme).container}
                    renderItem={renderNumber}
          />
        </View>
      </View>
    </View>
  );

};

const LockScreen = styledHigherOrderComponents(LockScreen2);
export default LockScreen;


const styles = props => StyleSheet.create({
  title: {
    fontFamily: "CircularStd-Bold",
    fontSize: BIG_TITLE_FONTSIZE,
    color: props.appWhite,
    // marginBottom: PADDING_H,
  },
  desc: {
    fontFamily: "CircularStd-Book",
    fontSize: TITLE_FONTSIZE - 1,
    color: props.appWhite,
    marginBottom: PADDING_H,
    textAlign: "center",
    paddingHorizontal: PADDING_H,
    lineHeight: 24,
    marginVertical: MARGIN_T,
  },
  valueWrap1: {
    flex: .3,
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    paddingTop: PADDING_H * 6,

  },
  val: {
    flexDirection: "row",
    width: SCREEN_WIDTH / 3,
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: MARGIN_T * 2,
  },
  valueWrap: {
    marginBottom: PADDING_H,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: props.appWhite,
  },
  container: {
    alignItems: "center",
  },
  bottomWrap: {
    width: "100%",
    flex: .7,
    paddingTop: "10%",
  },
  list: {
    flex: 1,
  },
  element: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  number: {
    fontFamily: "CircularStd-Book",
    fontSize: BIG_TITLE_FONTSIZE + 1,
    color: props.appWhite,
  },
  alpha: {
    fontFamily: "CircularStd-Book",
    fontSize: TITLE_FONTSIZE,
    color: props.secondaryText,
  },
  numberWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: PADDING_H,
    marginHorizontal: PADDING_H * 2,
    borderWidth: 1,
    borderColor: props.borderGray,
  },
  numberWrap2: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: PADDING_H,
    marginHorizontal: PADDING_H * 2,
  },
  dismissButton: {
    position: "absolute",
    top: isIphoneX ? 50 : 20,
    right: 20,
    // width: 60,
    // height: ww,
    // borderRadius: ww / 2,
    zIndex: 999999,
  },
});
