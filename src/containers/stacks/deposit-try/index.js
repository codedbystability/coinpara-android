import React, { useEffect, useState } from "react";
import {   StyleSheet, View } from "react-native";
import InfoCard from "../../../components/info-card";
import CustomButton from "../../../components/button";
import FormInput from "../../../components/form-input";
import BankSelect from "../bank-select";
import FeeTotal from "../../../components/fee-total";
import SelectBankInput from "../../../components/select-bank-input";
import TransactionDescriptions from "../transaction-descriptions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import DropdownAlert from "../../../providers/DropdownAlert";
import { formattedNumber } from "../../../helpers/math-helper";
import ModalProvider from "../../../providers/ModalProvider";
import {
  BIG_TITLE_FONTSIZE,
  NORMAL_FONTSIZE,
  PADDING_H,
} from "../../../../utils/dimensions";
import InputAccessory from "../../../components/input-accessory";
import Clipboard from "@react-native-community/clipboard";
import QrCreateModalize from "../deposit-btc/read-qr";
import { replaceAll } from "../../../helpers/string-helper";

const descriptions = [
  { id: 1, text: "CURRENCY_DEPOSIT_INFO" },
];

const DepositTryScreen = (props) => {

  const { wallet, showModal, handleComplete, activeTheme, oldAmount, refresh } = props;
  const { language } = useSelector(state => state.globalReducer);
  const [selectedBank, setSelectedBank] = useState({});
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (refresh) {
      setSelectedBank({});
      setAmount("");
    }
  }, [refresh]);
  useEffect(() => {
    if (oldAmount)
      setAmount(oldAmount);
  }, [oldAmount]);

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    ModalProvider.hide();
  };

  const showBankModal = () => ModalProvider.show(() => <BankSelect
    type={"deposit"}
    handleClose={() => ModalProvider.hide()}
    selectedBank={selectedBank}
    handleItemSelect={handleBankSelect} />,
  );

  const handleBankInputAction = (action) => {
    switch (action) {
      case "copy-name":
        Clipboard.setString(selectedBank.NameSurname);
        return DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "ACCOUNT_OWNER_COPIED_TO_CLIPBOARD"));

      case "copy-iban":
        Clipboard.setString(selectedBank.Iban);
        return DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "IBAN_COPIED_TO_CLIPBOARD"));

      case "qr":
        return selectedBank.Iban ? ModalProvider.show(() => <QrCreateModalize
          qrValue={selectedBank.Iban} />) : DropdownAlert.show("info", getLang(language, "ERROR"), getLang(language, "AN_UNKNOWN_ERROR_OCCURED"));
    }
  };

  const handleContinue = () => {

    //lb -> DEPOSIT-MIN-LIMIT
    //la -> DEPOSIT-MAX-LIMIT
    //le -> DEPOSIT-DAILY-REMAINING
    //lf -> DEPOSIT-MONTHLY-REMAINING

    if (!amount || parseFloat(amount) <= 0) {
      return DropdownAlert.show("info", getLang(language, "WARNING"), getLang(language, "PLEASE_ENTER_A_VALID_AMOUNT"));
    } else if (Object.keys(selectedBank).length <= 0) {
      return DropdownAlert.show("info", getLang(language, "WARNING"), getLang(language, "PLEASE_SELECT_BANK"));
    } else if (parseFloat(amount) < wallet.lb) {
      return DropdownAlert.show("info", getLang(language, "WARNING"), replaceAll(getLang(language, "MINIMUM_AMOUNT_TO_DEPOSIT"), "MINIMUM_AMOUNT", formattedNumber(wallet.lb, wallet.dp) + " " + wallet.cd));
    } else if (parseFloat(amount) > wallet.la) {
      return DropdownAlert.show("info", getLang(language, "WARNING"), replaceAll(getLang(language, "MAXIMUM_AMOUNT_TO_DEPOSIT"), "MAXIMUM_AMOUNT", formattedNumber(wallet.la, wallet.dp) + " " + wallet.cd));
    } else if (parseFloat(amount) > wallet.le) {
      return DropdownAlert.show("info", getLang(language, "WARNING"), replaceAll(getLang(language, "DAILY_REMAINING_DEPOSIT_AMOUNT"), "REMAINING_DAILY", formattedNumber(wallet.le, wallet.dp) + " " + wallet.cd));
    } else if (parseFloat(amount) > wallet.lf) {
      return DropdownAlert.show("info", getLang(language, "WARNING"), replaceAll(getLang(language, "MONTHLY_REMAINING_DEPOSIT_AMOUNT"), "REMAINING_MONTHLY", formattedNumber(wallet.lf, wallet.dp) + " " + wallet.cd));
    }

    const instance = {
      "BankGuid": selectedBank.BankGuid,
      "Amount": parseInt(amount),
      "CoinGuid": wallet.gd,
      "EasyOrderId": 0,
    };
    handleComplete(instance);
  };

  return (

    <>

      <KeyboardAwareScrollView
        // extraScrollHeight={100}
        // extraHeight={100}
        extraScrollHeight={100}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles(activeTheme).scroll}>

        <InfoCard wallet={wallet} onPress={showModal} />

        <SelectBankInput
          onAction={handleBankInputAction}
          showName={true}
          showIban={true}
          selectedBank={selectedBank}
          handlePress={showBankModal} />


        <FormInput
          placeholder={"AMOUNT"}
          inputKey={"amount"}
          value={amount.toString()}
          keyboardType={"numeric"}
          autoComplete={"off"}
          returnKey={"done"}
          autoFocus={false}
          type={"text"}
          onChange={(value) => setAmount(value)}
        />

        <FeeTotal fee={"FREE"} amount={amount && amount !== "" ? formattedNumber(amount, "TRY") : 0} />
        <TransactionDescriptions descriptions={descriptions} />

        {/*</View>*/}
      </KeyboardAwareScrollView>


      <View style={styles(activeTheme).buttonWrapper}>

        <CustomButton text={getLang(language, "CONTINUE")}
                      filled={true}
                      style={{ backgroundColor: activeTheme.actionColor }}
                      onPress={handleContinue} />
        <InputAccessory
          handleStep={null}
          stepAble={false}
          mailProviders={[]}
          onPress={null}
        />
      </View>



    </>
  );
};


export default DepositTryScreen;

const styles = props => StyleSheet.create({

  scroll: {
    paddingHorizontal: PADDING_H,
    // paddingBottom: 60,
    // flex: 1,
    paddingBottom: 100,

  },
  buttonWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  title: {
    fontSize: BIG_TITLE_FONTSIZE,
    color: props.appWhite,
    fontFamily: "CircularStd-Bold",
  },
  desc: {
    fontSize: NORMAL_FONTSIZE,
    color: props.secondaryText,
    fontFamily: "CircularStd-Book",

  },
  container: {
    flex: 1,
  },
});
