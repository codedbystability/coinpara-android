import React from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { LABEL_HEIGHT } from "../../../utils/dimensions";
import TinyImage from "../../tiny-image";


const SearchInput = ({ text, onChange, onFocus = null, onBlur = null, style = null, showTypes = false }) => {

  const { activeTheme } = useSelector(state => state.globalReducer);

  const debouncedChangeHandler = (val) => onChange(val.toUpperCase() || "");


  const handleDismiss = () => {
    Keyboard.dismiss();
    onChange("");
  };
  return (

    <>
      <View style={style ? style : styles(activeTheme).searchSection}>
        {
          text ? <>
              <TouchableOpacity
                activeOpacity={1}
                onPress={handleDismiss}
                style={styles(activeTheme).dismissButtonContainer}>
                <View style={styles(activeTheme).image}>
                  <TinyImage parent={"rest/"} name={"dismiss"} style={styles(activeTheme).icon2} />
                </View>
              </TouchableOpacity>
            </> :
            <View style={styles(activeTheme).image}>
              <TinyImage parent={"rest/"} name={"search"} style={styles(activeTheme).icon} />
            </View>
        }
        <TextInput
          keyboardAppearance={"dark"}
          autoCorrect={false}
          autoCapitalize={"characters"}
          keyboardType={"default"}
          onFocus={onFocus}
          onBlur={onBlur}
          style={[styles(activeTheme).input, { borderBottomWidth: showTypes ? 1 : 4 }]}
          placeholder=""
          onChangeText={debouncedChangeHandler}
          value={text}
          underlineColorAndroid="transparent"
        />

      </View>
    </>

  );
};

export default SearchInput;

const styles = (props) => StyleSheet.create({
  searchSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: LABEL_HEIGHT + 2,
    // borderBottomWidth:4,

  },
  input: {
    height: LABEL_HEIGHT + 2,
    // margin: 12,
    paddingRight: 35,
    paddingLeft: 12,
    borderRadius: 4,
    width: "100%",
    borderBottomColor: props.borderGray,
    borderBottomWidth: 4,
    color: props.appWhite,
  },
  image: {
    position: "absolute",
    right: 5,
    maxHeight: 20,
    maxWidth: 20,
    tintColor: props.actionColor,
  },
  leftImage: {
    position: "absolute",
    maxHeight: 16,
    maxWidth: 16,
    left: 15,
  },
  dismissButtonContainer: {
    // padding: 5,
    position: "absolute",
    right: 5,
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  icon: {
    width: 18,
    height: 18,
  },
  icon2: {
    width: 14,
    height: 14,
  },
});
