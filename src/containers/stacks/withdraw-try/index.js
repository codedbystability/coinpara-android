import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import InfoCard from "../../../components/info-card";
import FeeTotal from "../../../components/fee-total";
import FormInput from "../../../components/form-input";
import PercentageSelect from "../../../components/percentage-select";
import CustomButton from "../../../components/button";
import BankSelect from "../bank-select";
import SelectBankInput from "../../../components/select-bank-input";
import { useSelector } from "react-redux";
import { formatMoney, formattedNumber } from "../../../helpers/math-helper";
import { getLang } from "../../../helpers/array-helper";
import DropdownAlert from "../../../providers/DropdownAlert";
import transferServices from "../../../services/transfer-services";
import BankHistory from "./bank-history";
import Validation from "../../../components/validation";
import ModalProvider from "../../../providers/ModalProvider";
import {
  BIG_TITLE_FONTSIZE, HEADER_HEIGHT,
  LABEL_HEIGHT,
  NORMAL_FONTSIZE,
  PADDING_H,
} from "../../../../utils/dimensions";
import { handleIbanRegex, replaceAll } from "../../../helpers/string-helper";
import { navigationRef } from "../../../providers/RootNavigation";
import InputAccessory from "../../../components/input-accessory";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const percentages = [
  { id: 1, value: "10" },
  { id: 2, value: "25" },
  { id: 3, value: "50" },
  { id: 4, value: "100" },
];


const WithdrawTryScreen = ({ wallet, showModal, handleComplete, validUser = null, refresh }) => {

  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const { user } = useSelector(state => state.authenticationReducer);

  const [amount, setAmount] = useState("");
  const [iban, setIban] = useState("");
  const [activePercentage, setActivePercentage] = useState("0");
  const [selectedBank, setSelectedBank] = useState({});
  const [showValidation, setShowValidation] = useState(false);
  const [verifyType, setVerifyType] = useState(null);
  const [transferInstance, setTransferInstance] = useState({});

  useEffect(() => {
    if (refresh) {
      setSelectedBank({});
      setAmount("");
      setIban("");
      setActivePercentage("0");
      setTransferInstance({});
    }
  }, [refresh]);

  useEffect(() => {
    if (parseInt(activePercentage) >= 1 && parseFloat(wallet.wb) > 0) {
      setAmount(parseFloat(wallet.wb * activePercentage / 100).toFixed(2));
    }
  }, [activePercentage]);

  const handleIbanSet = (val) => setIban(val ? handleIbanRegex(val) : "");

  const handleSetPercentage = (tab) => setActivePercentage(tab.value);

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    ModalProvider.hide();
  };

  const showBankModal = () => ModalProvider.show(() => <BankSelect
    type={"withdraw"}
    handleClose={() => ModalProvider.hide()}
    handleItemSelect={handleBankSelect} />);

  const handleValidationNav = () => navigationRef.current.navigate("AccountApprove");

  const handleContinue = () => {
    const avAmount = wallet.wb;


    //ld -> WITHDRAW-MIN-LIMIT
    //lc -> WITHDRAW-MAX-LIMIT
    //li -> WITHDRAW-DAILY-REMAINING
    //lj -> WITHDRAW-MONTHLY-REMAINING

    if (parseFloat(avAmount) <= 0) {
      return DropdownAlert.show("info", getLang(language, "INFORMATION"), getLang(language, "NO_FREE_AMOUNT"));
    }
    const formattedAmount = parseFloat(amount.replace(/\./g, "").replace(/,/g, "."));

    if (!formattedAmount || parseInt(formattedAmount) <= 0) {
      return DropdownAlert.show("info", getLang(language, "INFORMATION"), getLang(language, "PLEASE_ENTER_A_VALID_AMOUNT"));
    } else if (Object.keys(selectedBank).length <= 0) {
      return DropdownAlert.show("info", getLang(language, "INFORMATION"), getLang(language, "PLEASE_SELECT_BANK"));
    } else if (!iban) {
      return DropdownAlert.show("info", getLang(language, "INFORMATION"), getLang(language, "PLEASE_ENTER_YOUR_IBAN"));
    } else if (parseFloat(amount) > wallet.wb) {
      return DropdownAlert.show("info", getLang(language, "WARNING"), getLang(language, "NO_BALANCE"));
    } else if (parseFloat(amount) < wallet.ld) {
      return DropdownAlert.show("info", getLang(language, "WARNING"), replaceAll(getLang(language, "MINIMUM_AMOUNT_TO_WITHDRAW"), "MINIMUM_AMOUNT", formattedNumber(wallet.ld, wallet.dp) + " " + wallet.cd));
    } else if (parseFloat(amount) > wallet.lc) {
      return DropdownAlert.show("info", getLang(language, "WARNING"), replaceAll(getLang(language, "MAXIMUM_AMOUNT_TO_WITHDRAW"), "MAXIMUM_AMOUNT", formattedNumber(wallet.lc, wallet.dp) + " " + wallet.cd));
    } else if (parseFloat(amount) > wallet.li) {
      return DropdownAlert.show("info", getLang(language, "WARNING"), replaceAll(getLang(language, "DAILY_REMAINING_WITHDRAW_AMOUNT"), "REMAINING_DAILY", formattedNumber(wallet.li, wallet.dp) + " " + wallet.cd));
    } else if (parseFloat(amount) > wallet.lj) {
      return DropdownAlert.show("info", getLang(language, "WARNING"), replaceAll(getLang(language, "MONTHLY_REMAINING_WITHDRAW_AMOUNT"), "REMAINING_MONTHLY", formattedNumber(wallet.lj, wallet.dp) + " " + wallet.cd));
    }

    // return console.log("formattedAmount - ", formattedAmount, " - amount - ", amount);

    const instance = {
      BankAccount: iban,
      BankGuid: selectedBank.BankGuid,
      // TransferSecret: "",

      CoinGuid: wallet.gd,
      Amount: amount,
      ToWalletAddress: iban,
    };
    setTransferInstance(instance);
    transferServices.getOtp().then((response) => {
      setVerifyType(response.Data);
      if (response.IsSuccess) {
        return setShowValidation(true);
      } else {
        return DropdownAlert.show("error", getLang(language, "ERROR"), getLang(language, "AN_UNKNOWN_ERROR_OCCURED"));
      }
    });
  };

  const handleBankHistorySelected = (bankHistory) => {
    const replace = replaceAll(bankHistory.Account, "TR", "");
    setSelectedBank(bankHistory);
    setIban(replace);
  };

  const onResult = (response) => {
    setShowValidation(false);
    if (response.IsSuccess) {
      handleComplete(transferInstance);
    }
  };


  return (
    <>

      <KeyboardAwareScrollView
        extraScrollHeight={200}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles(activeTheme).scroll}>

        {
          validUser !== null ? <>
            <InfoCard wallet={wallet} onPress={showModal} />

            <SelectBankInput
              showIban={false}
              isCapital={false}
              isWithdraw={true}
              selectedBank={selectedBank} handlePress={showBankModal}
            />


            <FormInput autoComplete={"off"}
                       placeholder={"IBAN_NO"}
                       value={iban}
                       isAddition={"TR"}
                       keyboardType={"numeric"}
                       onChange={handleIbanSet}
                       returnKey={"done"}
                       leftAddition={iban ? "TR" : null}
            />

            <FormInput returnKey={"done"} autoComplete={"off"}
                       placeholder={"AMOUNT"}
                       value={amount.toString()} keyboardType={"numeric"}
                       onChange={setAmount}
            />


            {
              wallet.wb > 0 && <PercentageSelect
                percentages={percentages}
                handlePress={(item) => handleSetPercentage(item)}
                activePercentage={activePercentage}/>
            }

            <FeeTotal fee={formatMoney(amount ? wallet.wf : 0, 2) + " TRY"}
                      amount={formatMoney(amount && amount !== "" ? amount - wallet.wf : 0, 2)} />

            <BankHistory handleSelect={handleBankHistorySelected} />

          </> : <View style={styles(activeTheme).cls}>
            <ActivityIndicator />
          </View>
        }


      </KeyboardAwareScrollView>

      {
        validUser !== null && <>
          {
            !validUser && <View style={[styles(activeTheme).nonValid, {
              backgroundColor: replaceAll(activeTheme.darkBackground, "1)", "0.7)"),
            }]} />
          }

          <View style={styles(activeTheme).buttonWrapper}>
            {
              validUser ? <CustomButton text={getLang(language, "CONTINUE")}
                                        filled={true}
                                        style={{ backgroundColor: activeTheme.actionColor }}
                                        onPress={handleContinue} /> :
                <CustomButton
                  text={getLang(language, "YOU_ARE_NOT_ALLOWED")}
                  smallTitle={replaceAll(getLang(language, "NO_PERMIT_WITHRAW"), "COINNAME", wallet.cd)}
                  filled={true}
                  showR={true}
                  style={{ backgroundColor: activeTheme.noRed }}
                  onPress={handleValidationNav} />
            }
          </View>

        </>
      }


      <Validation show={showValidation} onHide={() => setShowValidation(false)}
                  descriptionMessage={getLang(language, verifyType === 1 ? "VALIDATION_CODE_HAS_BEEN_SENT_TO_YOUR_PHONE" : "PLEASE_ENTER_AUTHENTICATOR_CODE")}
                  iconType={verifyType === 1 ? "phone" : "email"}
                  type={"transfer-otp"} email={user.Phone}
                  userGuid={null} transferInstance={transferInstance}
                  onResult={onResult}
      />

      <InputAccessory
        handleStep={null}
        stepAble={false}
        mailProviders={[]}
        onPress={null}
      />
    </>

  );

};

export default WithdrawTryScreen;

const styles = props => StyleSheet.create({
  scroll: {
    paddingHorizontal: PADDING_H,
    // flex: 1,
    paddingBottom: 100,
  },
  wrapper: {
    width: "100%",
    alignItems: "flex-end",
    paddingHorizontal: PADDING_H,
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
  nonValid: {
    flex: 1,
    top: HEADER_HEIGHT + LABEL_HEIGHT + (PADDING_H * 2),
    left: 0,
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  cls: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
