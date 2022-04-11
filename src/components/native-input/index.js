import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import TinyImage from "../../tiny-image";


const NativeInput = (props) => {
  const {
    searchText,
    setSearchText,
    placeholder = "",
  } = props;
  const { activeTheme } = useSelector(state => state.globalReducer);
  return (
    <View style={styles(activeTheme).searchContainer}>
      <View style={styles(activeTheme).searchIcon}>
        <TinyImage parent={"rest/"} name={"search"} style={styles(activeTheme).icon} />
      </View>

      <TextInput
        keyboardAppearance={"dark"}

        // showSoftInputOnFocus={showOnStart}
        style={styles(activeTheme).input}
        value={searchText}
        autoCapitalize={"characters"}
        onChangeText={setSearchText}
        placeholder={placeholder}
        placeholderTextColor={activeTheme.secondaryText}
        keyboardType={"email-address"}
        autoCorrect={false}
        inputAccessoryViewID={"inputAccessoryViewIDNative"}
        // returnKeyType={"done"}
      />


      {
        searchText ? <Pressable onPress={() => setSearchText("")}>
            <View style={styles(activeTheme).searchIcon}>
              <TinyImage parent={"rest/"} name={"dismiss"} style={styles(activeTheme).icon2} />
            </View>
          </Pressable>
          : null
      }

    </View>
  );
};

export default NativeInput;

const styles = (props) => StyleSheet.create({


  searchContainer: {
    // height: 38,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: props.backgroundApp,
    borderWidth: .4,
    borderColor: props.borderGray,
    // marginBottom: 10,
  },
  input: {
    height: "90%",
    backgroundColor: props.backgroundApp,
    // backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 0,
    paddingVertical: 8,
    flex: 1,
    color: props.appWhite,
    alignSelf: "stretch",
    marginTop: 2,
    marginHorizontal: 12,
    marginBottom: 6,
    padding: 12,
    // backgroundColor: props.backgroundApp,
    borderColor: props.borderGray,
    // borderBottomColor: props.borderGray,
    // borderTopColor: props.borderGray,
  },

  searchIcon: { paddingHorizontal: 10 },
  icon: {
    width: 18,
    height: 18,
  },
  icon2: {
    width: 16,
    height: 16,
  },
});


