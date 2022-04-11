import React, { forwardRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import ModalProvider from "../../providers/ModalProvider";
import CountrySelect from "../../country-select";
import { useSelector } from "react-redux";
import { INPUT_HEIGHT, NORMAL_FONTSIZE, PADDING_H, TITLE_FONTSIZE } from "../../../utils/dimensions";
import TinyImage from "../../tiny-image";
import NImage from "../image/index.tsx";

const FormPhoneInput = forwardRef((props, ref) => {

  const {
    value,
    onChangePhoneNumber,
    onCountrySelect,
    activeCountry,
    editable = true,
    placeholder = "placeholder",
  } = props;
  const { activeTheme } = useSelector(state => state.globalReducer);

  const showCountryModal = () => ModalProvider.show(() => <CountrySelect {...{
    activeCountry,
    handleSelectCountry,
  }} />, false);

  const handleSelectCountry = (item) => {
    ModalProvider.hide();
    onCountrySelect(item);
  };

  return (
    <View style={{
      marginVertical: 8,
      width: "100%",
    }}>
      {/*style={{ width: "100%", padding: 0 }}*/}

      {
        value ? <Text
          style={[styles(activeTheme).smallPlaceholder,
          ]}>{placeholder}</Text> : null
      }


      <View style={[styles(activeTheme).flag, !value ? { paddingVertical: 8 } : { paddingTop: 24 }]}>

        <Pressable
          onPress={() => editable && showCountryModal()}
          style={styles(activeTheme).flag1}>

          <NImage
            style={{
              width: 20,
              height: 16,
              marginRight: PADDING_H,
            }}
            useFastImage={true}
            source={{ uri: `https://images.coinpara.com/files/mobile-assets/countries/${activeCountry.code.toLowerCase()}.png` }}
          />

          <Text style={styles(activeTheme).dial}>
            {activeCountry.dial_code}
          </Text>
        </Pressable>

        <TextInput
          keyboardAppearance={"dark"}
          secureTextEntry={false}
          style={[styles(activeTheme).input]}
          onChangeText={onChangePhoneNumber}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={activeTheme.secondaryText}
          keyboardType={"numeric"}
          autoFocus={false}
          autoCapitalize={"none"}
          autoComplete={"off"}
          returnKeyType={"next"}
          editable={editable}
          ref={ref}
        />

        <View
          style={styles(activeTheme).right}>
          <TinyImage parent={"rest/"} name={"google-auth"}
                     style={styles(activeTheme).icon2} />
        </View>


      </View>


    </View>
  );
});


export default React.memo(FormPhoneInput);

const styles = (props) => StyleSheet.create({

  textInput: {
    height: 60,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: props.borderGray,
    borderRadius: 5,
    paddingHorizontal: PADDING_H,
    paddingVertical: 0,
    width: "100%",
    marginVertical: 8,

  },
  text: {
    color: props.appWhite,
  },

  input: {
    // height: INPUT_HEIGHT,
    paddingRight: 40,
    width: "80%",
    color: props.appWhite,
    fontSize: TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
    borderRadius: 5,
    marginVertical: 8,
  },


  flag: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: props.borderGray,
    width: "100%",
    height: INPUT_HEIGHT,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: PADDING_H,
  },
  flag1: {
    height: "100%",
    width: "20%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    borderRadius: 5,
  },
  right: {
    width: "10%",
    paddingHorizontal: PADDING_H,
    position: "absolute",
    right: PADDING_H,
    top: "60%",

  },
  dial: {
    color: props.appWhite,
    fontFamily: "CircularStd-Book",
    fontSize: TITLE_FONTSIZE,
    marginLeft: 2,

  },
  smallPlaceholder: {
    position: "absolute",
    top: 8,
    fontSize: NORMAL_FONTSIZE,
    left: 15,
    color: props.secondaryText,
    // fontSize:12,
    fontFamily: "CircularStd-Book",
  },
  icon2: {
    width: 18,
    height: 18,
  },
});
