import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import InfoCard from "../../../components/info-card";
import FormInput from "../../../components/form-input";
import PercentageSelect from "../../../components/percentage-select";
import CustomButton from "../../../components/button";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import BigInput from "../../../components/big-input";
import Clipboard from "@react-native-community/clipboard";
import DropdownAlert from "../../../providers/DropdownAlert";
import ScanScreen from "../sqan-qr";
import transferServices from "../../../services/transfer-services";
import Networks from "../../../components/networks";
import walletServices from "../../../services/wallet-services";
import {
  BIG_TITLE_FONTSIZE,
  HEADER_HEIGHT,
  LABEL_HEIGHT,
  NORMAL_FONTSIZE,
  PADDING_H,
} from "../../../../utils/dimensions";
import Validation from "../../../components/validation";
import ModalProvider from "../../../providers/ModalProvider";
import { replaceAll } from "../../../helpers/string-helper";
import { navigationRef } from "../../../providers/RootNavigation";
import TransactionDescriptions from "../transaction-descriptions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { formattedNumber } from "../../../helpers/math-helper";
import Loading from "../../../components/loading";
import userServices from "../../../services/user-services";

const percentages = [
  { id: 1, value: "10" },
  { id: 2, value: "25" },
  { id: 3, value: "50" },
  { id: 4, value: "100" },
];
const WithdrawBtcScreen = ({ wallet, showModal, handleComplete, validUser = null }) => {

  // const isFocused = useIsFocused();
  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const { user } = useSelector(state => state.authenticationReducer);
  const [activePercentage, setActivePercentage] = useState("0");
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [valid, setValid] = useState(true);
  const [transferInstance, setTransferInstance] = useState({});
  const [networkInstance, setNetworkInstance] = useState({});
  const [activeNetwork, setActiveNetwork] = useState("");
  const [activeNetworkName, setActiveNetworkName] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [networks, setNetworks] = useState([]);
  const [memoValue, setMemoValue] = useState("");
  const [tagValue, setTagValue] = useState("");
  const [verifyType, setVerifyType] = useState("");

  const [isMemo, setIsMeMo] = useState("");
  const [isTag, setIsTag] = useState("");


  const [isAdminApproved, setIsAdminApproved] = useState(false);


  useEffect(() => {
    setWalletAddress("");
    setAmount("");
    // setActiveNetwork("");
    // console.log("wallet - ", wallet);
    if (wallet && wallet.gd) {
      if (!isAdminApproved) {
        userServices.getApproval().then((response) => {
          if (response.IsSuccess) {
            setIsAdminApproved(response.Data.AdminApproval === true);
          }
        });
      }

      setIsMeMo("");
      setIsTag("");
      setNetworkInstance({});
      walletServices.getNetworks(wallet.gd).then((response) => {
        if (response.IsSuccess && response.Data.length >= 1 && response.Data[0].netWorks.providerNetWorks.length >= 1) {
          // const actives = response.Data[0].netWorks.providerNetWorks.filter(itm => !itm.DefaultNetWork);
          const actives = response.Data[0].netWorks.providerNetWorks;
          setNetworks(actives);

          if (actives.length >= 1) {
            setNetworkInstance(actives[0]);
            setActiveNetwork(actives[0].Id);
            setActiveNetworkName(actives[0].CoinNetwork);
            const dt = actives[0].DestinationTag;
            if (dt) {
              const memoIndex = dt.indexOf("memoId=");
              const tagIndex = dt.indexOf("dt=");
              if (memoIndex !== -1) {
                setIsMeMo(true);
              } else if (tagIndex !== -1) {
                setIsTag(true);
              }
            }
          }
        } else {
          setActiveNetwork(0);
        }
      });
    }
  }, [wallet]);

  useEffect(() => {
    if (parseInt(activePercentage) >= 1 && parseFloat(wallet.wb) > 0) {
      setAmount((parseFloat(wallet.wb) * activePercentage / 100).toFixed(wallet.dp));
    }
  }, [activePercentage]);

  useEffect(() => {
    if (walletAddress) {
      setValid(true);
      walletServices.check(wallet.cd, walletAddress, activeNetworkName.indexOf(" ") >= 0 ? "" : activeNetworkName)
        .then((response) => {
          setValid(response && response.isValid);
        });
    }
  }, [walletAddress]);

  const handleSetPercentage = (tab) => setActivePercentage(tab.value);

  const handleValidationNav = () => navigationRef.current.navigate("AccountApprove");

  const handleContinue = () => {

    if (isMemo && !memoValue) {
      return DropdownAlert.show("info", getLang(language, "INFO"), getLang(language, "PLEASE_ENTER_MEMO_VALUE"));
    } else if (tagValue && !tagValue) {
      return DropdownAlert.show("info", getLang(language, "INFO"), getLang(language, "PLEASE_ENTER_TAG_VALUE"));
    } else if (!walletAddress || walletAddress === getLang(language, "ENTER_WALLET_ADDRESS")) {
      return DropdownAlert.show("info", getLang(language, "INFO"), getLang(language, "PLEASE_ENTER_WALLET_ADDRESS"));
    } else if (!amount || parseFloat(amount) <= 0) {
      return DropdownAlert.show("info", getLang(language, "INFO"), getLang(language, "PLEASE_ENTER_A_VALID_AMOUNT"));
    }

    const formattedAmount = parseFloat(amount.replace(/\./g, "").replace(/,/g, "."));


    const dailyRemainingField = isAdminApproved ? wallet.lk : wallet.li;
    const monthlyRemainingField = isAdminApproved ? wallet.lm : wallet.lj;


    if (!formattedAmount || parseInt(formattedAmount) <= 0) {
      return DropdownAlert.show("info", getLang(language, "INFORMATION"), getLang(language, "PLEASE_ENTER_A_VALID_AMOUNT"));
    } else if (parseFloat(amount) > wallet.wb) {
      return DropdownAlert.show("info", getLang(language, "WARNING"), getLang(language, "NO_BALANCE"));
    } else if (parseFloat(amount) < wallet.ld) {
      return DropdownAlert.show("info", getLang(language, "WARNING"), replaceAll(getLang(language, "MINIMUM_AMOUNT_TO_WITHDRAW"), "MINIMUM_AMOUNT", formattedNumber(wallet.ld, wallet.dp) + " " + wallet.cd));
    } else if (parseFloat(amount) > wallet.lc) {
      return DropdownAlert.show("info", getLang(language, "WARNING"), replaceAll(getLang(language, "MAXIMUM_AMOUNT_TO_WITHDRAW"), "MAXIMUM_AMOUNT", formattedNumber(wallet.lc, wallet.dp) + " " + wallet.cd));
    } else if (parseFloat(amount) > dailyRemainingField) {
      return DropdownAlert.show("info", getLang(language, "WARNING"), replaceAll(getLang(language, "DAILY_REMAINING_WITHDRAW_AMOUNT"), "REMAINING_DAILY", formattedNumber(wallet.li, wallet.dp) + " " + wallet.cd));
    } else if (parseFloat(amount) > monthlyRemainingField) {
      return DropdownAlert.show("info", getLang(language, "WARNING"), replaceAll(getLang(language, "MONTHLY_REMAINING_WITHDRAW_AMOUNT"), "REMAINING_MONTHLY", formattedNumber(wallet.lj, wallet.dp) + " " + wallet.cd));
    }

    const instance = {
      ToWalletAddress: walletAddress,
      Amount: amount.replace(/,/g, "."),
      CoinGuid: wallet.gd,
      DestinationTag: isMemo ? memoValue : isTag ? tagValue : "",
      TransferSecret: "",
      wallet: wallet,
      NetworkId: activeNetwork,
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

    // handleComplete(instance);
  };

  const showCameraModal = () => ModalProvider.show(() => <ScanScreen
    onHide={() => ModalProvider.hide()}
    onQrRead={(barcode) => {
      setWalletAddress(barcode);
      ModalProvider.hide();
    }}
    isComp={true}
  />);

  const handleAction = async (type) => {
    if (type === "copy") {
      setWalletAddress((await Clipboard.getString()).slice(0, 70));
    } else if (type === "qr") {
      showCameraModal();
    }

  };

  const onLongPress = async () => {
    const walletAdd = await Clipboard.getString();
    if (walletAdd) {
      setWalletAddress((walletAdd).slice(0, 70));
    } else {
      DropdownAlert.show("error", getLang(language, "ERROR"), getLang(language, "NOTHING_TO_PASTE"));
    }

  };

  const onResult = (response) => {
    if (!response || !response.IsSuccess) {
      return;
    }
    setShowValidation(false);


    // const btcInstance = {
    //   "ToWalletAddress": transferInstance.ToWalletAddress,
    //   "Amount": transferInstance.amount,
    //   "CoinGuid": transferInstance.CoinGuid,
    //   "DestinationTag": isMemo ? isMemo : isTag ? isTag : "",
    //   "TransferSecret": "",
    //   "NetworkId": activeNetwork,
    // };

    // return console.log("btcInstance - ", btcInstance);

    return handleComplete(transferInstance);
  };


  return (
    <>


      {
        validUser !== null ? <KeyboardAwareScrollView
          extraScrollHeight={200}
          enableAutomaticScroll={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles(activeTheme).scroll}>
          <InfoCard wallet={wallet} onPress={showModal} />


          <Networks activeNetwork={activeNetwork}
                    networks={networks}
                    onSelect={(val, networkName, ntw) => {
                      setNetworkInstance(ntw);
                      setActiveNetwork(val);
                      setActiveNetworkName(networkName);
                    }}
          />

          <BigInput handleAction={handleAction} paste={true}
                    onLongPress={onLongPress}
                    inputValue={walletAddress ? walletAddress : getLang(language, "PRESS_LONG_TO_PASTE")} />
          {
            !valid &&
            <Text style={styles(activeTheme).warn}>{getLang(language, "ADDRESS_NOT_MATCH_NETWORK_DESCRIPTION")}</Text>
          }

          {
            isMemo ? <FormInput returnKey={"done"} autoComplete={"off"}
                                placeholder={"ENTER_MEMO_ID"}
                                value={memoValue} keyboardType={"numeric"}
                                smallTitle={getLang(language, "MEMO_ID")}
                                onChange={setMemoValue} /> : null
          }


          {
            isTag ? <FormInput returnKey={"done"} autoComplete={"off"}
                               placeholder={"ENTER_DESTINATION_TAG"}
                               value={tagValue} keyboardType={"numeric"}
                               smallTitle={getLang(language, "DESTINATION_TAG")}
                               onChange={setTagValue} /> : null
          }


          <FormInput returnKey={"done"} autoComplete={"off"} placeholder={"AMOUNT"}
                     value={amount} keyboardType={"numeric"}
                     onChange={setAmount} />

          {
            wallet.wb > 0 && <PercentageSelect
              percentages={percentages}
              handlePress={(item) => handleSetPercentage(item)}
              activePercentage={activePercentage} />
          }


          <TransactionDescriptions
            isNormal={false}
            o1={"WITHDRAW_LIMIT"}
            n1={networkInstance && networkInstance.WithdrawMinLimit ? networkInstance.WithdrawMinLimit : wallet.ld}
            o2={"COINNAME"}
            n2={wallet.cd}
            descriptions={[
              {
                id: 1, text: "COIN_WITHDRAW1", isChange: true,
              },
              {
                id: 2, text: "COIN_WITHDRAW2",
              },
              {
                id: 3,
                text: "COIN_WITHDRAW3",
              },
              {
                id: 4,
                text: "COIN_WITHDRAW4",
              },
            ]}
          />


        </KeyboardAwareScrollView> : <Loading />
      }


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


      {/*</View>*/}


      <Validation show={showValidation} onHide={() => setShowValidation(false)}
                  type={"transfer-otp"}
                  descriptionMessage={getLang(language, verifyType === 1 ? "VALIDATION_CODE_HAS_BEEN_SENT_TO_YOUR_PHONE" : "PLEASE_ENTER_AUTHENTICATOR_CODE")}
                  iconType={verifyType === 1 ? "phone" : "email"}
                  email={verifyType === 1 ? user.Phone : "-"}
                  userGuid={null}
                  transferInstance={transferInstance}
                  onResult={onResult}
      />


    </>
  );

};


export default WithdrawBtcScreen;


const styles = props => StyleSheet.create({
  scroll: {
    paddingHorizontal: PADDING_H,
    paddingBottom: 100,
    // flex: 1,
  },
  wrapper: {
    width: "100%",
    alignItems: "flex-end",
    paddingHorizontal: 15,
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
  warn: {
    fontSize: NORMAL_FONTSIZE - 1,
    color: props.changeRed,
    fontFamily: "CircularStd-Book",
    paddingLeft: PADDING_H * 2,
    marginTop: -4,
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
  load: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
