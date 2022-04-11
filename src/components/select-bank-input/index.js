import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getLang } from "../../helpers/array-helper";
import { useSelector } from "react-redux";
import TinyImage from "../../tiny-image";


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
            : <>
              <Text style={[styles(activeTheme).text, { color: activeTheme.appWhite }]}>
                {
                  selectedBank && Object.keys(selectedBank).length >= 1 && <Text style={{
                    color: isCapital ? activeTheme.appWhite : activeTheme.secondaryText,
                  }}>
                    {/*{getLang(language, "IBAN")}*/}
                    {isWithdraw ? getLang(language, "IBAN") : selectedBank.BankName}

                  </Text>
                }
                {"\n"}
                {"\n"}
                <Text style={{
                  color: activeTheme.appWhite,
                }}>
                  {isWithdraw ? selectedBank.BankName : selectedBank.Iban}
                </Text>
                {
                  showIban &&
                  <>
                    {"\n"}
                    <Text style={[styles(activeTheme).text, { color: activeTheme.appWhite }]}>
                      {selectedBank.Iban}
                    </Text>
                  </>
                }
              </Text>
            </>
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


        {/*<Entypo name={"chevron-right"} size={20} color={activeTheme.secondaryText} />*/}
      </Pressable>


      {
        showName && selectedBank && Object.keys(selectedBank).length >= 1 &&
        <Pressable onPress={handlePress} style={styles(activeTheme).wrapper}>


          <Text style={[styles(activeTheme).text, { color: activeTheme.secondaryText }]}>
            {getLang(language, "TAKER")}
            <>
              {"\n"}
              {"\n"}
              <Text style={[styles(activeTheme).text, { color: activeTheme.appWhite }]}>
                {selectedBank.NameSurname}
              </Text>
            </>


          </Text>


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
    fontSize: 12,
    fontFamily: "CircularStd-Book",
  },
  icon: {
    width: 18,
    height: 18,
  },
});
