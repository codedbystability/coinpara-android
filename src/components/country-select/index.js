import React, { forwardRef } from "react";
import { Text, View, StyleSheet, Pressable, TextInput } from "react-native";
import { INPUT_HEIGHT, NORMAL_FONTSIZE, PADDING_H, TITLE_FONTSIZE } from "../../../utils/dimensions";
import { useSelector } from "react-redux";
import ModalProvider from "../../providers/ModalProvider";
import CountrySelect from "../../country-select";
import { getLang } from "../../helpers/array-helper";
import NImage from "../image/index.tsx";


const CountrySelectInput = forwardRef((props, ref) => {

  const { activeCountry, handleSelectCountry, setIdentityNumber, identityNumber, onFocus } = props;
  const { activeTheme, language } = useSelector(state => state.globalReducer);

  const handleShowModal = () => ModalProvider.show(() => <CountrySelect
    showPhone={false}
    {...{
      activeCountry,
      handleSelectCountry,
    }} />, false);


  return (
    <View style={styles(activeTheme).wrapper}>

      <Pressable onPress={handleShowModal} style={styles(activeTheme).press}>

        <Text style={styles(activeTheme).smallTitle}>{getLang(language, "YOUR_NATIONALITY")}</Text>

        <View style={styles(activeTheme).leftWrap}>
          <View style={{ width: "20%" }}>
            <NImage
              style={{
                width: 20,
                height: 16,
              }}
              useFastImage={true}
              source={{ uri: `https://images.coinpara.com/files/mobile-assets/countries/${activeCountry.code.toLowerCase()}.png` }}
            />

          </View>
          <View style={{ width: "80%", alignItems: "center" }}>
            <Text
              style={styles(activeTheme).title}>{activeCountry.name === "Turkey" ? "Türkiye" : activeCountry.name}</Text>
          </View>

        </View>
      </Pressable>


      <View
        style={styles(activeTheme).modl}>
        <Text
          style={styles(activeTheme).smallTitle}>{getLang(language, activeCountry && activeCountry.name === "Turkey" ? "ENTER_YOUR_TC_ID" : "ENTER_YOUR_FOREIGN_ID")}</Text>


        <View
          style={styles(activeCountry).rightWrap}>
          <TextInput
            keyboardAppearance={"dark"}
            onFocus={onFocus}
            ref={ref}
            keyboardType={activeCountry && activeCountry.name === "Turkey" ? "numeric" : "default"}
            style={styles(activeTheme).input}
            placeholder={""}
            placeholderTextColor={activeTheme.secondaryText}
            onChangeText={setIdentityNumber}
            value={identityNumber}
            autoFocus={true}
          />

        </View>
      </View>


    </View>
  );

});


export default React.memo(CountrySelectInput);


const styles = props => StyleSheet.create({
  wrapper: {
    height: INPUT_HEIGHT,
    paddingVertical: 2,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: PADDING_H,
    borderWidth: 1,
    borderColor: props.borderGray,
    borderRadius: 5,
  },
  title: {
    color: props.appWhite,
    fontSize: TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
  },
  smallTitle: {
    color: props.secondaryText,
    fontSize: NORMAL_FONTSIZE,
    fontFamily: "CircularStd-Book",
    width: "100%",
  },
  input: {
    paddingRight: PADDING_H,
    width: "100%",
    color: props.appWhite,
    fontSize: TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
    borderBottomWidth: 1,
    borderColor: props.borderGray,
  },
  leftWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  press: {
    width: "30%",
    alignItems: "center",
    height: "100%",
    justifyContent: "space-around",
  },
  rightWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modl: {
    width: "70%",
    height: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
