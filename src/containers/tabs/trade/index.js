import * as React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
} from "react-native";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { useEffect, useState } from "react";
import TradeSelect from "./select";
import { useSelector } from "react-redux";
import CustomButton from "../../../components/button";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import {
  BIG_TITLE_FONTSIZE,
  NORMAL_FONTSIZE,
  PADDING_H,
  PADDING_V, SCREEN_WIDTH,
  TITLE_FONTSIZE,
} from "../../../../utils/dimensions";
import { formatMoney } from "../../../helpers/math-helper";
import marketServices from "../../../services/market-services";
import { getLang } from "../../../helpers/array-helper";
import DropdownAlert from "../../../providers/DropdownAlert";
import { navigationRef } from "../../../providers/RootNavigation";
import PercentageSelect from "../../../components/percentage-select";
import { percentages, tradeTypes } from "./constants";
import { isIphoneX } from "../../../../utils/devices";
import ActionSheetComProvider from "../../../providers/ActionSheetComProvider";
import AnimatedTab from "../../../components/animated-tab";
import store from "../../../reducers/createReducers";
import DynamicImage from "../../../components/dynamic-image";
import { replaceAll } from "../../../helpers/string-helper";
import InputAccessory from "../../../components/input-accessory";
import TradeChart from "./chart";


import LocalStorage from "../../../providers/LocalStorage";
import { useIsFocused } from "@react-navigation/native";
import TinyImage from "../../../tiny-image";


const Trade = (props) => {

  const authenticated = useSelector(state => state.authenticationReducer.authenticated);
  const isFocused = useIsFocused();

  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const { marketsWithKey, marketCount, btcTryGd } = useSelector(state => state.marketReducer);
  const [amount, setAmount] = useState("");
  const [formatPrecision, setFormatPrecision] = useState(2);
  const [activeType, setActiveType] = useState("buy");
  const [selectedMarket, setSelectedMarket] = useState({});
  const [userToWallet, setUserToWallet] = useState({});
  const [userFromWallet, setUserFromWallet] = useState({});
  const [info, setInfo] = useState({});
  const [prediction, setPrediction] = useState("");
  const [activePercentage, setActivePercentage] = useState("0");
  const [isFocusedTI, setIsFocusedTI] = useState(false);


  useEffect(() => {
    if (props && props.route.params && props.route.params.parity) {
      const parity = props.route.params.parity;
      const to = parity.split("-")[1];
      const marketKey = Object.keys(marketsWithKey).find(key => marketsWithKey[key].fs === "TRY" && marketsWithKey[key].to === to);
      const marketItem = marketsWithKey[marketKey];
      if (marketItem) {
        setSelectedMarket(marketItem);
        const wallets = store.getState()["walletReducer"]["wallets"];
        setUserToWallet(wallets.find(item => item.cd.toLowerCase() === marketItem.to.toLowerCase()));
        setUserFromWallet(wallets.find(item => item.cd.toLowerCase() === marketItem.fs.toLowerCase()));
      }
      getMarketInfo(marketItem.fs, marketItem.to);
    } else {
      getMarketInfo("TRY", "BTC");
    }
  }, [props.route]);

  useEffect(() => {
    if (selectedMarket && selectedMarket.to) {
      const wallets = store.getState()["walletReducer"]["wallets"];
      setUserToWallet(wallets.find(item => item.cd.toLowerCase() === selectedMarket.to.toLowerCase()));
      setUserFromWallet(wallets.find(item => item.cd.toLowerCase() === selectedMarket.fs.toLowerCase()));
      setSelectedMarket(marketsWithKey[selectedMarket.gd]);
    } else {
      setSelectedMarket(marketsWithKey[btcTryGd]);
      const wallets = store.getState()["walletReducer"]["wallets"];
      setUserToWallet(wallets.find(item => item.cd === "BTC"));
      setUserFromWallet(wallets.find(item => item.cd === "TRY"));
    }
  }, [marketCount]);

  useEffect(() => {
    setAmount("");
    setActivePercentage("0");
  }, [activeType]);

  useEffect(() => {
    if (Object.keys(info).length > 1) {
      activeType === "buy" ? setFormatPrecision(info.FromCoinDecimalPoints) : setFormatPrecision(info.ToCoinDecimalPoints);
    }
  }, [info, activeType]);

  useEffect(() => {
    if (amount) {
      if (selectedMarket && selectedMarket.pr) {
        setPrediction(activeType === "buy" ? amount / selectedMarket.pr : amount * selectedMarket.pr);
      }
    }
  }, [amount]);

  useEffect(() => {
    const theWallet = activeType === "buy" ? userFromWallet : userToWallet;

    if (activePercentage && activePercentage > 0 && theWallet) {
      const walletBalance = theWallet.wb;
      let calculatedAmount;


      if (activeType === "buy") {
        const decimal = info.FromCoinDecimalPoints;
        const re = new RegExp("^-?\\d+(?:\.\\d{0," + (decimal || -1) + "})?");
        calculatedAmount = (walletBalance * parseInt(activePercentage) / 100).toString().match(re)[0]; // TODO toFixed withot rounding !!!
        setAmount(calculatedAmount);

      } else if (activeType === "sell") {
        const decimal = info.ToCoinDecimalPoints;
        const re = new RegExp("^-?\\d+(?:\.\\d{0," + (decimal || -1) + "})?");
        calculatedAmount = (walletBalance * parseInt(activePercentage) / 100).toString().match(re)[0]; // TODO toFixed withot rounding !!!
        setAmount(calculatedAmount);
      }

    }
  }, [activePercentage]);

  const handleChangeTradeType = (tradeType) => setActiveType(tradeType.key);

  const handleSetPercentage = (tab) => setActivePercentage(tab.value);

  const handleSelect = (item) => {
    const newItem = marketsWithKey[item["MarketGuids"]["TRY"]];
    if (!newItem) {
      return console.log("no new item - ", newItem);
    }
    setSelectedMarket(newItem);
    const wallets = store.getState()["walletReducer"]["wallets"];
    setUserToWallet(wallets.find(item => item.cd.toLowerCase() === newItem.to.toLowerCase()));
    setUserFromWallet(wallets.find(item => item.cd.toLowerCase() === newItem.fs.toLowerCase()));
    setSelectedMarket(marketsWithKey[newItem.gd]);

    getMarketInfo(newItem.fs, newItem.to);

  };

  // const handleMax = () => userFromWallet && userFromWallet.wb > 0 && setAmount(userFromWallet.wb);

  const getMarketInfo = (from, to) => {
    setInfo({});
    if (!from || !to)
      return;

    marketServices.getMarketInfo(from, to).then((response) => {
      if (response && response.IsSuccess) {
        setInfo(response.Data);
      }
    });
  };

  const handleOrder = () => {
    if (!authenticated) {
      return navigationRef.current.navigate("LoginRegister");
    }

    if (!amount || parseFloat(amount) < 0) {
      return DropdownAlert.show("error", getLang(language, "ERROR"), getLang(language, "ENTER_VALID_AMOUNT"));
    }


    if (activeType === "buy" && amount > userFromWallet.wb) {
      return ActionSheetComProvider.show({
        title: getLang(language, "NOT_ENOUGH_BALANCE_DO_YOU_WANT_TO_DEPOSIT"),
        options: [getLang(language, "DEPOSIT"), getLang(language, "CANCEL")],
        onAction: (index) => handleActionDeposit(index),
      });
    } else if (activeType === "sell" && amount > userToWallet.wb) {
      return ActionSheetComProvider.show({
        title: getLang(language, "NOT_ENOUGH_BALANCE_DO_YOU_WANT_TO_DEPOSIT"),
        options: [getLang(language, "DEPOSIT"), getLang(language, "CANCEL")],
        onAction: (index) => handleActionDeposit(index),
      });
    }

    const theLatestMarketUpdate = marketsWithKey[selectedMarket.gd];
    if (!theLatestMarketUpdate || !theLatestMarketUpdate.pr) {
      return DropdownAlert.show("error", getLang(language, "ERROR"), getLang(language, "AN_UNKNOWN_ERROR_OCCURED"));
    }

    const coinTotal = activeType === "buy" ? amount / theLatestMarketUpdate.pr : amount;

    if (info.ToCoinMin > 0 && coinTotal < info.ToCoinMin) {
      const validMessage = replaceAll(getLang(language, "TO_COIN_MIN_AMOUNT"), "MINAMOUNT", info.ToCoinMin);
      const resultMessage = replaceAll(validMessage, "COINNAME", info.ToCoinName);
      return DropdownAlert.show("info", getLang(language, "INFO"), resultMessage);
    }


    let instance, path = null;
    instance = {
      "CoinFrom": selectedMarket.fs,
      "CoinTo": selectedMarket.to,
      // "Amount": activeType === "buy" ? total / theLatestMarketUpdate.pr : total, // FOR CRYPTO
      "Amount": activeType === "sell" ? amount : 0, // FOR PRICE
      "Total": activeType === "buy" ? amount : 0, // FOR PRICE
      "OrderValue": theLatestMarketUpdate.pr,
      "Direction": activeType === "buy" ? 1 : 2,// buy-sell
      "StopAmount": 0,//stop
      "PriceRiseDrop": 0,//stop
    };
    path = "orders/market/new";
    Keyboard.dismiss();

    marketServices.newOrder(path, instance).then((response) => {
      if (!response)
        return DropdownAlert.show("success", getLang(language, "ERROR"), getLang(language, "AN_UNKNOWN_ERROR_OCCURED"));
      if (!response.IsSuccess) {
        if (response.StatusCode === 409) {
          ActionSheetComProvider.show({
            title: getLang(language, "NOT_ENOUGH_BALANCE_DO_YOU_WANT_TO_DEPOSIT"),
            options: [getLang(language, "DEPOSIT"), getLang(language, "CANCEL")],
            onAction: (index) => handleActionDeposit(index),
          });

        } else {
          return DropdownAlert.show("error", getLang(language, "ERROR"), response.ErrorMessage);
        }
      } else {
        setAmount("");
        setActivePercentage("0");
        setPrediction("");
        return DropdownAlert.show("success", getLang(language, "SUCCESS"), response.ErrorMessage);
      }
    });
  };

  const handleActionDeposit = (index) => {
    if (index !== 0)
      return;

    return navigationRef.current.navigate("Transfer", {
      wallet: activeType === "buy" ? userFromWallet : userToWallet,
      transactionType: "deposit",
      coinType: activeType === "buy" ? "price" : "crypto",
      amount: amount,
    });
  };

  const handleOnFocus = () => setIsFocusedTI(true);

  const handleOnBlur = () => setIsFocusedTI(false);

  return (
    <>

      <TabNavigationHeader{...props} backAble={false}
                          options={{ title: getLang(language, "TRADE") }} />

      <View style={{ flex: 1 }}>


          <View style={styles(activeTheme).upW}>
            <AnimatedTab {...{
              cd: selectedMarket ? selectedMarket.to : null,
              filled: false,
              activeKey: activeType,
              headers: tradeTypes,
              width: `50%`,
              isBig: true,
              onChange: handleChangeTradeType,
            }} />
          </View>


        <View>


            <View style={styles(activeTheme).upW}>
              <TradeSelect {...{ selectedMarket, handleSelect }} />
            </View>

            <View style={[styles(activeTheme).wrapper, { paddingTop: PADDING_H / 2 }]}>

              {
                selectedMarket && Object.keys(selectedMarket).length >= 1 &&
                <View style={{ flexDirection: "row", alignItems: "center" }}>

                  <Text style={[styles(activeTheme).text, { fontSize: BIG_TITLE_FONTSIZE + 4, marginRight: 4 }]}>
                    {selectedMarket && Object.keys(selectedMarket).length >= 1 && formatMoney(selectedMarket.pr, info.FromCoinDecimalPoints)}
                    {
                      "  "
                    }
                    {selectedMarket && selectedMarket.fs}
                  </Text>

                  <Text
                    style={[styles(activeTheme).textChange, { color: parseFloat(selectedMarket.cp) >= 0 ? activeTheme.changeGreen : activeTheme.changeRed }]}>
                    % {selectedMarket && selectedMarket.cp.toFixed(2)}
                  </Text>

                  <TinyImage parent={"rest/"}
                             name={selectedMarket && selectedMarket.cp >= 0 ? "arrow-up" : "arrow-down"}
                             style={styles(activeTheme).icon}
                  />
                </View>

              }

            </View>


          <View
            style={styles(activeTheme).wrapper}>


              <View style={styles(activeTheme).inputContainer}>

                <TextInput
                  keyboardAppearance={"dark"}
                  style={[styles(activeTheme).textInput, {
                    fontSize: 18,
                    borderColor: activeType === "sell" ? activeTheme.noRed : activeTheme.yesGreen,
                    color: activeType === "sell" ? activeTheme.noRed : activeTheme.yesGreen,
                  }]}
                  onFocus={handleOnFocus}
                  onBlur={handleOnBlur}
                  textAlign={"center"}
                  blurOnSubmit={true}
                  // onChangeText={setAmount}
                  onChangeText={val => (val.match(/\./g) || []).length <= 1 && setAmount(val)}

                  value={
                    (!amount) || isFocusedTI ?
                      amount.toString() : formatMoney(amount, formatPrecision)
                  }
                  keyboardType={"numeric"}
                  numberOfLines={1}
                />


                <Text style={styles(activeTheme).txt}>
                  {
                    selectedMarket && selectedMarket.to && replaceAll(getLang(language, activeType === "buy" ? "INSTANT_TRADE_BUY" : "INSTANT_TRADE_SELL"), "COINNAME", selectedMarket.to)
                  }
                </Text>
                <View style={styles(activeTheme).tlIcon}>
                  {
                    selectedMarket && <DynamicImage style={styles(activeType).icon2}
                                                    market={activeType === "buy" ? selectedMarket.fs : selectedMarket.to} />
                  }

                </View>


              </View>


            {
              authenticated && <View style={{ width: "100%", paddingVertical: PADDING_H / 2 }}>
                <PercentageSelect percentages={percentages}
                                  handlePress={(item) => handleSetPercentage(item)}
                                  activePercentage={activePercentage} />
              </View>
            }


          </View>


        </View>


      </View>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}>

        {
          selectedMarket && selectedMarket.gd && <TradeChart
            {...{
              cp: selectedMarket.cp,
              fs: selectedMarket.fs,
              to: selectedMarket.to,
              gd: selectedMarket.gd,
            }}
          />

        }

        {
          userToWallet && userFromWallet &&
          <View style={styles(activeTheme).textContainer}>

            <View style={{ flexDirection: "row" }}>
              <Text style={[styles(activeTheme).text, { marginRight: 10 }]}>{getLang(language, "AVAILABLE")}</Text>
              <Text
                style={[styles(activeTheme).text, { color: activeTheme.actionColor }]}>
                {activeType === "buy" ? formatMoney(userFromWallet.wb, userFromWallet.dp) : formatMoney(userToWallet.wb, userToWallet.dp)}
                <Text> {activeType === "buy" ? userFromWallet.cd : userToWallet.cd}</Text>
              </Text>
            </View>


            {
              prediction ? <View style={styles(activeTheme).prediction}>
                <Text
                  style={[styles(activeTheme).text, { color: activeTheme.actionColor }]}> = {formatMoney(prediction, activeType === "buy" ? info.ToCoinDecimalPoints : info.FromCoinDecimalPoints)} </Text>
                <Text
                  style={[styles(activeTheme).text, { color: activeTheme.actionColor }]}>{activeType === "buy" ? selectedMarket.to : selectedMarket.fs}</Text>
              </View> : null
            }
          </View>
        }

            <CustomButton
              text={getLang(language, activeType.toUpperCase())} onPress={handleOrder}
              style={{ backgroundColor: activeType === "sell" ? activeTheme.noRed : activeTheme.yesGreen }}
            />


      </View>
      <InputAccessory
        tabBarShown={true}
      />

    </>
  );
};
const TradeScreen = styledHigherOrderComponents(Trade);

export default React.memo(TradeScreen);
const styles = (props) => StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingHorizontal: PADDING_H * 2,
    justifyContent: "center",
    alignItems: "center",
  },
  selectContainer: {
    width: SCREEN_WIDTH / 3,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: props.borderGray,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  text: {
    color: props.appWhite,
    fontSize: TITLE_FONTSIZE,
    fontFamily: "CircularStd-Medium",
  },
  image: {
    height: 26,
    width: 26,
  },

  buttonWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",

  },
  textChange: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    fontSize: BIG_TITLE_FONTSIZE,
    marginRight: 8,

    // marginLeft: 12,
  },
  textContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: PADDING_H,
    paddingVertical: 8,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    width: "100%",
    height: 50,
    borderRadius: 10,
    // paddingHorizontal: 8,
    fontSize: 18,
    fontFamily: "CircularStd-Bold",
    alignItems: "center",
    paddingRight: 30,
  },

  prediction: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  maxContainer2: {
    position: "absolute",
    borderColor: props.borderGray,
    right: -24,
    top: 10,
    fontFamily: "Helvetica",
    fontSize: 22,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  icon2: {
    height: 20,
    width: 20,
  },
  tlIcon: {
    position: "absolute",
    right: "5%",
    top: 14,
    fontFamily: "Helvetica",
    fontSize: 22,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: props.secondaryText,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    // backgroundColor: "red",
  },
  upW: { paddingHorizontal: PADDING_H, paddingVertical: isIphoneX ? PADDING_V * 2 : 0 },
  txt: {
    color: props.secondaryText,
    marginLeft: -10,
    marginTop: 4,
    fontFamily: "CircularStd-Book",
    fontSize: NORMAL_FONTSIZE,
  },
  icon: {
    width: 12,
    height: 12,
  },
});
