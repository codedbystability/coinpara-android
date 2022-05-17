import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getLang } from "../../helpers/array-helper";
import { useSelector } from "react-redux";
import TinyImage from "../../tiny-image";
import { NORMAL_FONTSIZE } from "../../../utils/dimensions";


const SelectBankInput = (props) => {

  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const {
    selectedBank,
    handlePress,
    showIban = true,
    onAction = null,
    showName = false,
    isCapital = false,
    isWithdraw = false,
  } = props;


  return (

    <>
      <Pressable onPress={handlePress} style={styles(activeTheme).wrapper}>


        {
          Object.keys(selectedBank).length <= 0 ?
            <Text style={styles(activeTheme).text}>
              {getLang(language, "SELECT_BANK")}
            </Text>
            : <View style={{
              height: "100%",
              paddingVertical: 4,
              flex: 1,
            }}>
              {
                selectedBank && Object.keys(selectedBank).length >= 1 && <Text

                  style={[styles(activeTheme).text, {
                    marginTop:4,
                    color: isCapital ? activeTheme.appWhite : activeTheme.secondaryText,
                  }]}>
                  {isWithdraw ? getLang(language, "BANK") : selectedBank.BankName.replace(/\s/g, '')}
                </Text>
              }


              <Text style={[styles(activeTheme).text, { color: activeTheme.appWhite, marginTop: 6 }]}>
                {isWithdraw ? selectedBank.BankName.replace(/\s/g, '') : showIban && selectedBank.Iban}
              </Text>
            </View>
        }


        {
          (!selectedBank || Object.keys(selectedBank).length <= 0) ?
            <TinyImage parent={"rest/"} name={"c-down"} style={styles(activeTheme).icon} /> :
            onAction ?
              <View
                style={[{
                  justifyContent: "space-around",
                  alignItems: "center",
                  flexDirection: "row",
                  width: 80,
                  height: "100%",
                }]}>
                <>

                  <Pressable onPress={() => onAction("copy-iban")}>
                    <TinyImage parent={"rest/"} name={"copy"} style={styles(activeTheme).icon} />
                  </Pressable>
                  <Pressable onPress={() => onAction("qr")}>
                    <TinyImage parent={"rest/"} name={"qr"} style={styles(activeTheme).icon} />
                  </Pressable>

                </>
              </View> : null
        }

      </Pressable>


      {
        showName && selectedBank && Object.keys(selectedBank).length >= 1 &&
        <Pressable onPress={handlePress} style={styles(activeTheme).wrapper}>

          <View style={{
            height: "100%",
            paddingVertical: 4,
            flex: 1,
          }}>

            <Text style={[styles(activeTheme).text, {
              marginTop:4,
              color: activeTheme.secondaryText }]}>
              {getLang(language, "TAKER")}
            </Text>


            <Text style={[styles(activeTheme).text, { color: activeTheme.appWhite, marginTop: 6 }]}>
              {selectedBank.NameSurname}
            </Text>
          </View>


          <View style={[{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            width: 40,
            height: "100%",
          }]}>
            <Pressable onPress={() => onAction("copy-name")}>
              <TinyImage parent={"rest/"} name={"copy"} style={styles(activeTheme).icon} />
            </Pressable>
          </View>


        </Pressable>

      }


    </>

  );

};

export default SelectBankInput;


const styles = (props) => StyleSheet.create({
  wrapper: {
    height: 60,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: props.borderGray,
    borderRadius: 5,
    paddingHorizontal: 16,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: props.appWhite,
    fontSize: NORMAL_FONTSIZE,
    fontFamily: "CircularStd-Book",
  },
  icon: {
    width: 18,
    height: 18,
  },
});
