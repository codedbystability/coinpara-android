import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import DepositBtcScreen from "../deposit-btc";
import DepositTryScreen from "../deposit-try";
import WithdrawBtcScreen from "../withdraw-btc";
import WithdrawTryScreen from "../withdraw-try";
import MarketSelect from "../../../components/market-select";
import { useSelector } from "react-redux";
import LoadingScreen from "../../../components/loading";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import transferServices from "../../../services/transfer-services";
import DropdownAlert from "../../../providers/DropdownAlert";
import { getLang } from "../../../helpers/array-helper";
import ModalProvider from "../../../providers/ModalProvider";
import AnimatedTab from "../../../components/animated-tab";
import { HEADER_HEIGHT, PADDING_H } from "../../../../utils/dimensions";
import { isIphoneX } from "../../../../utils/devices";
import userServices from "../../../services/user-services";
import { useIsFocused } from "@react-navigation/native";
import TinyImage from "../../../tiny-image";


const transactionTypes = [
  { id: 1, key: "deposit", title: "DEPOSIT", ableField: "da" },
  { id: 2, key: "withdraw", title: "WITHDRAW", ableField: "wa" },
];

const TransferContainer = (props) => {
  const isFocused = useIsFocused();
  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const wallets = useSelector(state => state.walletReducer.wallets);
  const [validUser, setValidUser] = useState(null);

  const [wallet, setWallet] = useState({});
  const [transactionType, setTransactionType] = useState("deposit");
  const [coinType, setCoinType] = useState("");
  const [amount, setAmount] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (props && props.route.params && props.route.params.wallet && typeof props.route.params.wallet === "string") {
      const selectedWallet = wallets.find(wall => wall.cd === props.route.params.wallet);
      if (selectedWallet) {
        setWallet(selectedWallet);
        setTransactionType(props.route.params.transactionType ?? "deposit");
        setCoinType(["TRY", "USD", "EUR", "GBP"].includes(props.route.params.wallet) ? "price" : "crypto");
      }
    } else {
      setTransactionType(props.route.params.transactionType);
      setCoinType(props.route.params.coinType);
      setWallet(props.route.params.wallet);
      if (props.route.params.amount) {
        setAmount(props.route.params.amount);
      }
    }

  }, [props.route]);


  useEffect(() => {
    setValidUser(null);

    if (isFocused) {
      if (transactionType === "withdraw") {
        userServices.getApproval().then((res) => {
          if (res && res.IsSuccess) {
            const data = res.Data;
            setValidUser(data.AdminApproval);
          }
        });
      } else {
        setValidUser(true);
      }
    }
  }, [isFocused, transactionType]);

  const getDynamicContent = () => {
    if (transactionType === "deposit" && coinType === "crypto") {
      return <DepositBtcScreen {...{ wallet, transactionType, activeTheme, handleComplete, showModal }} />;
    }
    if (transactionType === "deposit" && coinType === "price") {
      return <DepositTryScreen {...{
        refresh,
        wallet,
        activeTheme,
        transactionType,
        handleComplete,
        oldAmount: amount,
        showModal,
      }} />;
    }
    if (transactionType === "withdraw" && coinType === "crypto") {
      return <WithdrawBtcScreen {...{ wallet, transactionType, activeTheme, handleComplete, showModal, validUser }} />;
    }
    if (transactionType === "withdraw" && coinType === "price") {
      return <WithdrawTryScreen {...{
        wallet,
        transactionType,
        activeTheme,
        handleComplete,
        showModal,
        validUser,
        refresh,
      }} />;
    }
    return null;
  };

  const handleCoinSelected = (selectedCoin) => {
    ModalProvider.hide();
    const theWallet = wallets.find(item => item.gd === selectedCoin.CoinGuid);
    // setTransactionType(["TRY", "USD", "EUR", "GBP"].includes(theWallet.cd) ? "price" : "crypto");
    setCoinType(["TRY", "USD", "EUR", "GBP"].includes(theWallet.cd) ? "price" : "crypto");
    setWallet(theWallet);
  };

  const showModal = () => {
    return ModalProvider.show(() =>
      <MarketSelect
        shouldCheck={true}
        type={transactionType}
        initialActiveType={coinType}
        setActiveType={setCoinType}
        handleSelect={handleCoinSelected}
      />, false);
  };

  const handleComplete = async (instance) => {
    let response = null;
    if (transactionType === "deposit" && coinType === "price") {
      response = await createCurrencyDeposit(instance);
    } else if (transactionType === "withdraw" && coinType === "price") {
      response = await createCurrencyWithdraw(instance);
    } else if (transactionType === "withdraw" && coinType === "crypto") {
      response = await createCryptoWithdraw(instance);
    }

    if (response && response.IsSuccess) {
      DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, transactionType === "deposit" ? "DEPOSIT_TRANSFER_REQUEST_CREATED_SUCCESSFULLY" : "WITHDRAW_TRANSFER_REQUEST_CREATED_SUCCESSFULLY"));
      setRefresh(true);
    }
  };

  const createCurrencyDeposit = (instance) => {
    return transferServices.currencyDeposit(instance).then((response) => {
      return response;
    });
  };

  const createCurrencyWithdraw = (instance) => {
    return transferServices.currencyWithdraw(instance).then((response) => {
      return response;
    });
  };

  const createCryptoWithdraw = (instance) => {
    return transferServices.cryptoWithdraw(instance).then((response) => {
      return response;
    });
  };

  const handleChangeTry = (item) => {
    if (item.key === "deposit" && !wallet.da) {
      return DropdownAlert.show("info", getLang(language, "INFORMATION"), wallet.cd + " " + getLang(language, "IN_MAINTENANCE_DEPOSIT"));
    } else if (item.key === "withdraw" && !wallet.wa) {
      return DropdownAlert.show("info", getLang(language, "INFORMATION"), wallet.cd + " " + getLang(language, "IN_MAINTENANCE_WITHDRAW"));
    }

    setTransactionType(item.key);
  };

  if (!transactionType || !coinType || !wallet) {
    return <LoadingScreen />;
  }

  return (
    <>

      <View style={styles(activeTheme).container}>

        <Pressable onPress={() => props.navigation.goBack()} activeOpacity={1}
                   style={styles(activeTheme).backButtonContainer}>

          <TinyImage parent={"rest/"} name={"c-left"} style={styles(activeTheme).icon} />

        </Pressable>


        <Pressable onPress={showModal}
                   style={styles(activeTheme).walletCD}>

          <TinyImage parent={"rest/"} name={"refresh"} style={styles(activeTheme).icon} />
          <Text style={styles(activeTheme).coinName}>{wallet.cd}</Text>
        </Pressable>

        <View
          style={styles(activeTheme).backButtonContainer} />
      </View>

      <View>
        <View style={{ paddingHorizontal: PADDING_H }}>
          <View style={{ paddingVertical: PADDING_H }}>
            <AnimatedTab {...{
              activeKey: transactionType,
              headers: transactionTypes,
              width: "50%",
              onChange: itm => handleChangeTry(itm),
            }} />
          </View>
        </View>
      </View>

      {
        getDynamicContent()
      }

    </>
  );
};
const TransferScreen = styledHigherOrderComponents(TransferContainer);
export default TransferScreen;


const styles = (props) => StyleSheet.create({
  container: {
    width: "100%",
    height: HEADER_HEIGHT,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: PADDING_H,
    paddingTop: isIphoneX ? 24 : 6,
    zIndex: 999999,
    flexDirection: "row",
  },
  backButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  title: {
    fontFamily: "CircularStd-Book",
    color: props.appWhite,
    fontSize: 16,
  },
  walletCD: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    bottom: 0,
  },
  coinName: {
    fontFamily: "CircularStd-Bold",
    color: props.appWhite,
    marginHorizontal: 8,
  },
  icon: {
    width: 18,
    height: 18,
  },
});
