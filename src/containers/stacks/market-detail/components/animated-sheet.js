import * as React from "react";
import { StyleSheet, View, Pressable, Modal, Text, Keyboard } from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
import ModalizeHeader from "../modalize/modalize-header";
import {
  BIG_TITLE_FONTSIZE,
  MARGIN_T,
  PADDING_H,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../../../../utils/dimensions";
import { isIphoneX } from "../../../../../utils/devices";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { formatMoney } from "../../../../helpers/math-helper";
import { limitInputs, marketAmountInputs, marketTotalInputs, percentages, stopInputs } from "../modalize/constants";
import marketServices from "../../../../services/market-services";
import ModalizeInputs from "../modalize/modalize-inputs";
import NeedAuthentication from "../../../../components/need-authentication";
import DropdownAlert from "../../../../providers/DropdownAlert";
import { getLang } from "../../../../helpers/array-helper";
import ModalizeBottom from "../modalize/modalize-bottom";
import CustomButton from "../../../../components/button";
import LocalStorage from "../../../../providers/LocalStorage";
import ActionSheetComProvider from "../../../../providers/ActionSheetComProvider";
import AnimatedTab from "../../../../components/animated-tab";
import CustomCheckbox from "../../../../components/custom-checkbox";
import { actionTabs, modalProps, tradeTypes } from "../constants";
import { replaceAll } from "../../../../helpers/string-helper";
import TinyImage from "../../../../tiny-image";
import HapticProvider from "../../../../providers/HapticProvider";


const AnimatedSheet = (props) => {
// const AnimatedSheet = forwardRef((props, ref) => {
  const { selectedOrder, selectedType, marketInfo, market, getLastTickerParent } = props;

  const [commissionRate, setCommissionRate] = useState(null);

  const { activeTheme, activeUserColors, language } = useSelector(state => state.globalReducer);
  const { authenticated } = useSelector(state => state.authenticationReducer);
  const { wallets } = useSelector(state => state.walletReducer);

  const sheetRef = useRef(null);

  const [modalApproved, setModalApproved] = useState(false);

  const [validInstance, setValidInstance] = useState({});
  const [validPath, setValidPath] = useState("");
  const [toWallet, setToWallet] = useState({});
  const [fromWallet, setFromWallet] = useState({});
  const [stopPrice, setStopPrice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [agreementConfirmed, setAgreementConfirmed] = useState(false);
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState("tt");
  const [activePercentage, setActivePercentage] = useState("");
  const [activeButtonType, setActiveButtonType] = useState("buy");
  const [activeActionTab, setActiveActionTab] = useState("market");
  const [activeIndex, setActiveIndex] = useState("initial");
  const [activeInputs, setActiveInputs] = useState([]);
  const [activeType, setActiveType] = useState("total");


  useEffect(() => {
    setCommissionRate(parseFloat(marketInfo.CommissionRate / 100));
    sheetRef.current.snapTo(1);
    setActivePercentage("");
    setAmount("");
    setPrice("");
  }, [marketInfo]);

  useEffect(() => {
    setActivePercentage("");
    setTotal("");
    setAmount("");
  }, [activeButtonType]);

  useEffect(() => {
    if (market.gd && wallets.length >= 1) {


      if (!price) {
        // setStopPrice(market.pr);

        const result = getLastTickerParent();
        if (!result.ask || !result.bid) {
          return;
        }
        setStopPrice(activeButtonType === "sell" ? result.bid : result.ask);

        const re = new RegExp("^-?\\d+(?:\.\\d{0," + (marketInfo.FromCoinDecimalPoints || -1) + "})?");


        // setPrice(parseFloat(market.pr).toString().match(re)[0]);
        setPrice(parseFloat(activeButtonType === "sell" ? result.bid : result.ask).toString().match(re)[0]);
      }

      setToWallet(wallets.find(wallet => wallet.cd === market.to));
      setFromWallet(wallets.find(wallet => wallet.cd === market.fs));
    }
  }, [wallets, market]);

  useEffect(() => {
    if (activePercentage) {
      if (activeButtonType === "buy") {
        handleBuyOnPercentageChange();
      } else {
        handleSellOnPercentageChange();
      }
    }
  }, [activePercentage]);

  useEffect(() => {
    if (selectedOrder && selectedOrder.fa) {
      setActiveButtonType(selectedType === "bid" ? "sell" : "buy");
      setActiveIndex("top");
      setActiveActionTab("limit");
      setTimeout(() => {
        setAmount(selectedOrder.cs);
        setPrice(selectedOrder.ov);
        const total = selectedOrder.cs * selectedOrder.ov;
        setTotal(
          total + parseFloat(total) * parseFloat(commissionRate),
        );
        sheetRef.current.snapTo(0);
      }, 100);

    }
  }, [selectedOrder, selectedType]);

  useEffect(() => {
    if (activeActionTab === "market") {
      setActiveType("total");
    }
    setActiveInputs(activeActionTab === "market" ? marketTotalInputs : activeActionTab === "limit" ? limitInputs : stopInputs);
  }, [activeActionTab]);

  useEffect(() => {
    setActivePercentage("");
    setAmount("");
    setTotal("");
    // setPrice("");
    if (activeType) {
      setActiveInputs(activeType === "total" ? marketTotalInputs : marketAmountInputs);
    }
  }, [activeType]);

  useEffect(() => {
    setActivePercentage("");
    setAmount("");
    setTotal("");
    // setPrice(0);
  }, [activeActionTab]);


  const handleSellOnPercentageChange = () => {
    const availableToAmount = toWallet.wb;

    if (availableToAmount > 0 && parseFloat(availableToAmount) > 0) {
      if (activeActionTab === "market") {
        const reAmount = new RegExp("^-?\\d+(?:\.\\d{0," + marketInfo.ToCoinDecimalPoints + "})?");
        const newAmount = (availableToAmount * parseInt(activePercentage) / 100).toString().match(reAmount)[0];
        setAmount(newAmount);

        const result = getLastTickerParent();
        if (!result.ask || !result.bid) {
          return;
        }
        const marketPrice = activeButtonType === "sell" ? result.bid : result.ask;
        const newTotal = newAmount * marketPrice;
        // const newTotal = newAmount * market.pr;
        const commissionForAll = newAmount * commissionRate;
        const availableTotal = newTotal - commissionForAll;
        if (availableTotal) {
          const re = new RegExp("^-?\\d+(?:\.\\d{0," + marketInfo.FromCoinDecimalPoints + "})?");
          setTotal(availableTotal.toString().match(re)[0]);
        }

      } else if (activeActionTab === "limit" || activeActionTab === "stop-limit") {

        const re = new RegExp("^-?\\d+(?:\.\\d{0," + (marketInfo.ToCoinDecimalPoints || -1) + "})?");
        const newAmount = (availableToAmount * parseInt(activePercentage) / 100).toString().match(re)[0];

        if (price) {
          const result = getLastTickerParent();
          if (!result.ask || !result.bid) {
            return;
          }
          const marketPrice = activeButtonType === "sell" ? result.bid : result.ask;

          const priceUp = price ? price : marketPrice;
          const newTotal = newAmount * priceUp;
          // const newAmountForAll = newTotal / price;
          const commissionForAll = newAmount * commissionRate;
          const availableTotal = newTotal - commissionForAll;
          // const exactAmount = availableTotal / price;

          const re = new RegExp("^-?\\d+(?:\.\\d{0," + (marketInfo.ToCoinDecimalPoints || -1) + "})?");
          // setAmount(exactAmount.toString().match(re)[0]);
          setAmount(newAmount.toString().match(re)[0]);
          setTotal(availableTotal);
        }
      }
    }
  };

  const handleBuyOnPercentageChange = () => {


    const availableFromAmount = fromWallet.wb;

    if (availableFromAmount > 0 && parseFloat(activePercentage) > 0) {

      const newTotal = availableFromAmount * parseInt(activePercentage) / 100;

      const re = new RegExp("^-?\\d+(?:\.\\d{0," + (fromWallet.dp || -1) + "})?");
      // console.log('newTotal.toString().match(re)[0] - ', newTotal.toString().match(re)[0])
      setTotal(newTotal.toString().match(re)[0]);

      // setTotal(newTotal);

      handleInputRelations(newTotal.toString().match(re)[0]);
    }
  };

  // TODO SEND USER TOTAL AS PARAM
  const handleInputRelations = (newTotal) => {
    const result = getLastTickerParent();
    if (!result.ask || !result.bid) {
      return;
    }
    const marketPrice = activeButtonType === "sell" ? result.bid : result.ask;
    const pp = price || marketPrice;

    // console.log('newTotal - ', newTotal)
    // console.log('commissionRate - ', commissionRate)
    // console.log('pp - ', pp)
    const calculatedAmount = (newTotal - (newTotal * commissionRate)) / pp;
    setAmount(calculatedAmount);


    // const newAmountForAll = newTotal / pp;
    // const commissionForAll = newAmountForAll * commissionRate;

    //(245.20552301 - (245.20552301*(0.25/100))) / 61


    // console.log('fakeAmount - ', fakeAmount)
    // const availableTotal = newTotal - commissionForAll;
    // const exactAmount = availableTotal / pp;
  };

  const handleChangeTradeType = (e) => setActiveType(e.key);

  const handleUpDown = (inputKey, type) => {
    HapticProvider.trigger();
    let calc;
    if (inputKey === "amount") {
      calc = marketInfo.ToCoinMin / 10;
    } else {
      if (market.fdp <= 1) {
        calc = 1;
      } else {
        calc = "0.";
        for (let i = 1; i < market.fdp - 1; i++) {
          calc += "0";
        }
        calc += "1";
        calc = parseFloat(calc);
      }
    }

    if (inputKey === "price") {
      let newPrice;
      if (price) {
        newPrice = type === "+" ? parseFloat(price) + calc : parseFloat(price) - calc;
      } else {
        const result = getLastTickerParent();
        if (!result.ask || !result.bid) {
          return;
        }
        newPrice = activeButtonType === "sell" ? result.bid : result.ask;

        // newPrice = market.pr;
      }
      handlePriceChange(newPrice);
      setPrice(newPrice);

    } else if (inputKey === "amount") {
      let newwAmount = 0;
      if (amount) {
        // setAmount(type === "+" ? parseFloat(amount) + calc : amount - calc < 0 ? 0 : parseFloat(amount) - calc);
        newwAmount = type === "+" ? parseFloat(amount) + calc : amount - calc < 0 ? 0 : parseFloat(amount) - calc;
      } else {
        if (activeButtonType === "buy") {
          // setAmount(marketInfo.ToCoinMin);
          newwAmount = marketInfo.ToCoinMin;
        } else {
          const result = getLastTickerParent();
          if (!result.ask || !result.bid) {
            return;
          }
          // const newAmount = toWallet.wb;
          newwAmount = activeButtonType === "sell" ? result.bid : result.ask;
        }
      }
      handleAmountChange(newwAmount);
      setAmount(newwAmount);
    } else if (inputKey === "total") {
      if (total) {
        setTotal(type === "+" ? parseFloat(total) + calc : total - calc < 0 ? 0 :
          parseFloat(total) - calc);
      } else {
        if (activeButtonType === "buy") {
          setTotal(fromWallet.wb);
        } else {
          const re = new RegExp("^-?\\d+(?:\.\\d{0," + (activeType === "total" ? marketInfo.FromCoinDecimalPoints : marketInfo.ToCoinDecimalPoints || -1) + "})?");
          const newAmount = toWallet.wb.toString().match(re)[0];
          const result = getLastTickerParent();
          if (!result.ask || !result.bid) {
            return;
          }
          // const newAmount = toWallet.wb;
          const marketPrice = activeButtonType === "sell" ? result.bid : result.ask;
          const newTotal = newAmount * marketPrice;
          const commissionForAll = newAmount * commissionRate;
          const availableTotal = newTotal - commissionForAll;
          // const re = new RegExp("^-?\\d+(?:\.\\d{0," + (marketInfo.ToCoinDecimalPoints || -1) + "})?");
          setTotal(availableTotal.toString().match(re)[0]);

          // const totalTotal = totalCoin * market.pr;
          // setTotal(totalTotal);
        }
      }
    } else if (inputKey === "stop-price" && stopPrice) {
      setStopPrice(type === "+" ? parseFloat(stopPrice) + calc : stopPrice - calc < 0 ? 0 :
        parseFloat(stopPrice) - calc);
    }
  };

  const handlePriceChange = (value) => {
    if (activeActionTab === "limit" || activeActionTab === "stop-limit") {
      if (amount > 0) {
        const baseAmount = amount * value;
        const re = new RegExp("^-?\\d+(?:\.\\d{0," + (marketInfo.FromCoinDecimalPoints || -1) + "})?");
        const updatedCommission = (baseAmount * commissionRate).toString().match(re)[0]; // TOTAL COMMISSION
        setTotal(parseFloat(parseFloat(updatedCommission) + parseFloat(baseAmount)).toString().match(re)[0]);
      }
    } else {
      // setTotal(formattedNumber(parseFloat(value), fromWallet.cd));
      setTotal(value);
    }
  };

  const handleTotalChange = (value) => {
    const re = new RegExp("^-?\\d+(?:\.\\d{0," + (marketInfo.ToCoinDecimalPoints || -1) + "})?");
    const result = getLastTickerParent();
    if (!result.ask || !result.bid) {
      return;
    }
    // const newAmount = toWallet.wb;
    const marketPrice = activeButtonType === "sell" ? result.bid : result.ask;
    setAmount(value ? (value / marketPrice).toString().match(re)[0] : 0);
  };

  const handleAmountChange = (value) => {
    if (activeActionTab === "limit" || activeActionTab === "stop-limit" || true) {
      if (activeButtonType === "buy") {
        if (parseFloat(value) > 0 && price) {
          const re = new RegExp("^-?\\d+(?:\.\\d{0," + (marketInfo.FromCoinDecimalPoints || -1) + "})?");

          setTotal(((value * price) + parseFloat(value * price) * parseFloat(commissionRate)).toString().match(re)[0]);
        } else {
          setTotal(0);
        }
      } else if (activeButtonType === "sell") {
        if (parseFloat(value) > 0 && price) {
          const re = new RegExp("^-?\\d+(?:\.\\d{0," + (marketInfo.FromCoinDecimalPoints || -1) + "})?");
          setTotal(((value * price) - parseFloat(value * price) * parseFloat(commissionRate)).toString().match(re)[0]);
        } else {
          setTotal(0);
        }
      }
    }
  };

  const handleInputChange = (key, value, inputPrecision) => {
    switch (key) {
      case "price":
        handlePriceChange(value);
        return setPrice(value);

      case "total":
        handleTotalChange(value);
        return setTotal(value);

      case "stop-price":
        return setStopPrice(value);

      case "amount":
        handleAmountChange(value);
        return setAmount(value);

      default:
        return;
    }
  };

  const handleSetActiveButtonType = (type) => {

    HapticProvider.trigger();

    if (!type) {
      setActiveIndex("initial");
      Keyboard.dismiss();
      return sheetRef.current.snapTo(1);
    }

    setActiveButtonType(type);
    if (sheetRef.current && activeIndex !== "top") {
      const result = getLastTickerParent();
      if (!result.ask || !result.bid) {
        return;
      }
      setPrice(type === "sell" ? result.bid : result.ask);
      setActiveIndex("top");
      sheetRef.current.snapTo(0);
    }
  };

  const getProperPrecision = (input) => {
    if (input.key === "total") {
      return marketInfo.FromCoinDecimalPoints;
    } else if (input.key === "amount") {
      return marketInfo.ToCoinDecimalPoints;
    } else if (input.key === "price") {
      return marketInfo.FromCoinDecimalPoints;
    }
    return 4;
  };

  const getProperTextValue = (input) => {
    switch (input.key) {
      case "price":
        return price ? price.toString() : "";
      // return formatCurrency(price, "USD", "en", true);
      case "total":
        // return formatCurrency(total, "USD", "en", true);
        return total ? total.toString() : "";
      // return total ? Accounting.unformat(total, 4).toString() : "";

      case "stop-price":
        return stopPrice ? stopPrice.toString() : "";

      case "amount":
        return amount ? amount.toString() : "";

      default:
        return "";
    }
  };

  const handleKeyboard = () => Keyboard.dismiss();

  const renderContent = () => {

    return (
      authenticated && fromWallet && toWallet ?
        <>
          <View
            style={[styles(activeTheme).tabWrapper, {
              flex: 1,
              backgroundColor: activeTheme.backgroundApp,
              height: !authenticated ? SCREEN_HEIGHT * .6 : isIphoneX ? SCREEN_HEIGHT * .7 : SCREEN_HEIGHT * .8,
            }]}>

            <View style={{ paddingHorizontal: PADDING_H }}>
              <AnimatedTab {...{
                filled: true,
                activeKey: activeActionTab,
                headers: actionTabs,
                width: `50%`,
                onChange: (itm) => setActiveActionTab(itm.key),
              }} />
            </View>

            <Pressable
              onPress={handleKeyboard} style={{
              flex: .7,
            }}>
              <ModalizeInputs
                {...{
                  activeInputs,
                  handleInputChange,
                  getProperTextValue,
                  getProperPrecision,
                  toWallet,
                  fromWallet,
                  percentages,
                  activePercentage,
                  setActivePercentage,
                  activeActionTab,
                  tradeTypes,
                  handlePriceSet,
                  activeType,
                  market,
                  handleChangeTradeType,
                  handleUpDown,
                }} />
            </Pressable>

            <ModalizeBottom {...{
              activeButtonType,
              activeUserColors,
              activeActionTab,
              activeType,
              activeTheme,
              handleOrder,
              handleSetActiveButtonType,
              language,
              market,
              amount,
              total,
              fromWallet,
              toWallet,
            }} />


          </View>


        </>
        : <View style={[styles(activeTheme).tabWrapper, {
          flex: 1,
          backgroundColor: activeTheme.backgroundApp,
          height: !authenticated ? SCREEN_HEIGHT * .6 : isIphoneX ? SCREEN_HEIGHT * .8 : SCREEN_HEIGHT * .8,
        }]}>
          <NeedAuthentication
            isMinimal={true}
            isSmall={!isIphoneX} scrollEnable={false} isFull={false} />
        </View>
    );
  };

  const renderHeader = () => {

    return (
      <View
        style={styles(activeTheme).header}>
        <Pressable
          onPress={() => sheetRef.current &&
            sheetRef.current.snapTo(1)}
          style={[styles(activeTheme).headerIcon]}>

          <TinyImage parent={"rest/"} name={activeIndex === "top" ? "c-down" : "c-up"}
                     style={styles(activeTheme).icon} />
        </Pressable>

        {
          !authenticated && activeIndex === "top" ? null :
            <ModalizeHeader {...{
              handleSetActiveButtonType,
              activeUserColors,
              language,
              activeTheme,
              activeButtonType,
              activeIndex,
            }} />
        }
      </View>
    );
  };

  const handlePriceSet = (type) => {
    if (type === "total") {
      if (activeButtonType === "buy") {
        setTotal(fromWallet.wb);
      } else {
        const totalCoin = toWallet.wb;
        const result = getLastTickerParent();
        if (!result.ask || !result.bid) {
          return;
        }
        // const newAmount = toWallet.wb;
        const marketPrice = activeButtonType === "sell" ? result.bid : result.ask;
        const totalTotal = totalCoin * marketPrice;
        setTotal(totalTotal);
      }
    } else if (type === "price") {

      const result = getLastTickerParent();
      if (!result.ask || !result.bid) {
        return;
      }
      setPrice(activeButtonType === "sell" ? result.bid : result.ask);

      // setPrice(market.pr);
    } else if (type === "amount") {
      setAmount(toWallet.wb);
    }
  };

  const handleOrder = () => {

    handleKeyboard();

    let instance = null, path = null;
    if (activeActionTab === "market") {
      if (activeType === "amount" && (!amount || parseFloat(amount) <= 0)) {
        return DropdownAlert.show("info", getLang(language, "ERROR"), getLang(language, "PLEASE_ENTER_A_VALID_AMOUNT"));
      } else if (activeType === "total" && (!total || parseFloat(total) <= 0)) {
        return DropdownAlert.show("info", getLang(language, "ERROR"), getLang(language, "PLEASE_ENTER_A_VALID_TOTAL"));
      }


      // if (activeType === "total" && marketInfo.FromCoinMin > 0 && total < marketInfo.FromCoinMin) {
      //   // TODO --- BUY-MARKET-TOTAL MIN FROM AMOUNT
      //   const validMessage = replaceAll(getLang(language, "FROM_COIN_MIN_AMOUNT"), "MINAMOUNT", marketInfo.FromCoinMin);
      //   const resultMessage = replaceAll(validMessage, "COINNAME", marketInfo.FromCoinName);
      //   return DropdownAlert.show("info", getLang(language, "INFO"), resultMessage);
      // } else if (activeType === "total" && marketInfo.FromCoinMax > 0 && total > marketInfo.FromCoinMax) {
      //   // TODO --- BUY-MARKET-TOTAL MAX FROM AMOUNT
      //   const validMessage = replaceAll(getLang(language, "FROM_COIN_MAX_AMOUNT"), "MAXAMOUNT", marketInfo.FromCoinMax);
      //   const resultMessage = replaceAll(validMessage, "COINNAME", marketInfo.FromCoinName);
      //   return DropdownAlert.show("info", getLang(language, "INFO"), resultMessage);
      // }

      if (marketInfo.ToCoinMin > 0 && amount < marketInfo.ToCoinMin) {
        // TODO --- BUY-MARKET-AMOUNT MAX FROM AMOUNT
        const validMessage = replaceAll(getLang(language, "TO_COIN_MIN_AMOUNT"), "MINAMOUNT", marketInfo.ToCoinMin);
        const resultMessage = replaceAll(validMessage, "COINNAME", marketInfo.ToCoinName);
        return DropdownAlert.show("info", getLang(language, "INFO"), resultMessage);
      }


      // CHECK MARKET BALANCE CONTROL
      if (activeButtonType === "buy" && activeType === "total" && fromWallet.wb < total) {
        return DropdownAlert.show("info", getLang(language, "INFO"), getLang(language, "NO_BALANCE"));

      } else if (activeButtonType === "sell" && activeType === "amount" && toWallet.wb < parseFloat(amount)) {
        return DropdownAlert.show("info", getLang(language, "INFO"), getLang(language, "NO_BALANCE"));
      }


      const result = getLastTickerParent();
      if (!result.ask || !result.bid) {
        return;
      }


      instance = {
        "CoinFrom": market.fs,
        "CoinTo": market.to,
        "Amount": parseFloat(amount),
        // "Total": activeType === "total" ? parseFloat(total) : 0,
        "OrderValue": activeButtonType === "sell" ? result.bid : result.ask,
        "Direction": activeButtonType === "buy" ? 1 : 2,// buy-sell
        "StopAmount": 0,//stop
        "PriceRiseDrop": 0,//stop
      };
      path = "orders/market/new";


    } else if (activeActionTab === "limit") {

      if ((!total || parseFloat(total) <= 0) || (!price || parseFloat(price) <= 0)) {
        return DropdownAlert.show("info", getLang(language, "ERROR"), getLang(language, "PLEASE_FILL_ALL_BLANKS"));
      }

      if (marketInfo.ToCoinMin > 0 && amount < marketInfo.ToCoinMin) {
        const validMessage = replaceAll(getLang(language, "TO_COIN_MIN_AMOUNT"), "MINAMOUNT", marketInfo.ToCoinMin);
        const resultMessage = replaceAll(validMessage, "COINNAME", marketInfo.ToCoinName);
        return DropdownAlert.show("info", getLang(language, "INFO"), resultMessage);
      }


      // CHECK MARKET BALANCE CONTROL
      if (activeButtonType === "buy" && fromWallet.wb < total) {
        return DropdownAlert.show("info", getLang(language, "INFO"), getLang(language, "NO_BALANCE"));
      } else if (activeButtonType === "sell" && toWallet.wb < parseFloat(amount)) {
        return DropdownAlert.show("info", getLang(language, "INFO"), getLang(language, "NO_BALANCE"));
      }


      //
      // TODO CHECK DECS
      instance = {
        "CoinFrom": market.fs,
        "CoinTo": market.to,
        // "Amount": parseFloat(amount),
        "Amount": amount.toString().match(new RegExp("^-?\\d+(?:\.\\d{0," + (marketInfo.ToCoinDecimalPoints) + "})?"))[0],
        // "Total": 0,
        "OrderValue": parseFloat(price),
        "Direction": activeButtonType === "buy" ? 1 : 2,// buy-sell
        "StopAmount": 0,//stop
        "PriceRiseDrop": 0,//stop
      };
      path = "orders/new";
      // path = "orders/new";

    } else if (activeActionTab === "stop-limit") {
      if ((!total || parseFloat(total) <= 0) || (!price || parseFloat(price) <= 0) || (!amount || parseFloat(amount) <= 0)) {
        return DropdownAlert.show("info", getLang(language, "ERROR"), getLang(language, "PLEASE_FILL_ALL_BLANKS"));
      }

      const result = getLastTickerParent();
      if (!result.ask || !result.bid) {
        return;
      }
      const marketPrice = activeButtonType === "sell" ? result.bid : result.ask;


      instance = {
        "CoinFrom": market.fs,
        "CoinTo": market.to,
        "Amount": amount,
        "Total": 0,
        "OrderValue": price,
        "Direction": activeButtonType === "buy" ? 1 : 2,// buy-sell
        "StopAmount": stopPrice,//stop
        "PriceRiseDrop": stopPrice < marketPrice ? 1 : 2,//stop
      };
      path = "orders/stoploss/new";
    }


    if (path) {
      setValidInstance(instance);
      setValidPath(path);

      // return Alert.alert("handle process");

      const result = getLastTickerParent();
      if (!result.ask || !result.bid) {
        return;
      }
      const marketPrice = activeButtonType === "sell" ? result.bid : result.ask;

      const dontShowOrderDetails = LocalStorage.getItem("dontShowOrderDetails");
      if ((dontShowOrderDetails || modalApproved) && activeButtonType === "buy" && validInstance.OrderValue > marketPrice + (marketPrice * 0.1)) {
        return showAction();
      } else if ((dontShowOrderDetails || modalApproved) && activeButtonType === "sell" && validInstance.OrderValue < marketPrice - (marketPrice * 0.1)) {
        return showAction();
      } else if ((modalApproved || dontShowOrderDetails)) {
        setTimeout(() => handleStore(), 500);
      } else {
        setShowModal(true);
      }
    }
  };

  const handleApprove = () => {

    const result = getLastTickerParent();
    if (!result.ask || !result.bid) {
      return;
    }
    const marketPrice = activeButtonType === "sell" ? result.bid : result.ask;


    setModalApproved(true);
    setShowModal(false);
    setTimeout(() => {
      if (activeButtonType === "buy" && validInstance.OrderValue > marketPrice + (marketPrice * 0.1)) {
        return showAction(activeButtonType);
      } else if (activeButtonType === "sell" && validInstance.OrderValue < marketPrice - (marketPrice * 0.1)) {
        return showAction(activeButtonType);
      } else {
        handleStore();
      }
    }, 500);
  };
  const handleSetAgreementConfirmed = (val) => {
    if (val) {
      LocalStorage.setItem("dontShowOrderDetails", "1");
    } else {
      LocalStorage.removeItem("dontShowOrderDetails");
    }
    setAgreementConfirmed(!agreementConfirmed);
  };

  const handleStore = () => {
    if (!validPath || Object.keys(validInstance) <= 0) {
      return;
    }
    setModalApproved(false);
    marketServices.newOrder(validPath, validInstance).then((response) => {
      if (response && response.IsSuccess) {
        setModalApproved(false);
        setShowModal(false);
        // DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "YOUR_ORDER_HAS_BEEN_PLACED"));
      }
    });
  };

  const showAction = (activeButtonType = "buy") => {
    return ActionSheetComProvider.show({
      title: getLang(language, activeButtonType === "buy" ? "EXTRA_ORDER_BUY_DESCRIPTION" : "EXTRA_ORDER_SELL_DESCRIPTION"),
      options: [getLang(language, "PLACE_ORDER"), getLang(language, "CANCEL")],
      onAction: (index) => handleAction(index),
    });
  };

  const handleAction = (index) => {
    if (index === 0) {
      handleStore();
    } else {
      setModalApproved(false);
    }
  };

  const getProperValue = (key) => {

    switch (key) {
      case "ORDER_TYPE":
        return getLang(language, activeButtonType.toUpperCase() + "_NOUN");

      case "PRICE":
        const result = getLastTickerParent();
        if (!result.ask || !result.bid) {
          return;
        }
        const marketPrice = activeButtonType === "sell" ? result.bid : result.ask;

        return formatMoney(price || marketPrice, marketInfo.FromCoinDecimalPoints);

      // return validInstance.OrderValue;

      case "AMOUNT":
        return formatMoney(amount, marketInfo.ToCoinDecimalPoints);

      case "COMMISSION":


        return formatMoney(price * amount * commissionRate, fromWallet.dp);
      // return formattedNumber(parseFloat(price) * parseFloat(amount) * commissionRate, market.fs);

      case "TOTAL":
        return formatMoney(total, marketInfo.FromCoinDecimalPoints);

      // return total;
    }
  };

  const snap0 = !authenticated ? SCREEN_HEIGHT * .6 : isIphoneX ? SCREEN_HEIGHT * .75 : SCREEN_HEIGHT * .85;
  const snap1 = isIphoneX ? 80 : 70;

  return (
    <>
      <View style={styles(activeTheme).centeredView}>

        {
          showModal && <Modal
            hideModalContentWhileAnimating={true}
            useNativeDriver={true}
            animationType={"slide"}
            transparent={true}
            visible={true}
            onRequestClose={() => setShowModal(false)}>
            <View style={styles(activeTheme).centeredView}>
              <View style={styles(activeTheme).modalView}>
                <Text style={styles(activeTheme).modalText}>{getLang(language, "NEW_ORDER")}</Text>
                {
                  modalProps.map(prp => {
                    return (
                      <View style={styles(activeTheme).vv} key={prp.id}>
                        <Text style={styles(activeTheme).txt}>{getLang(language, prp.key)}</Text>
                        <Text style={styles(activeTheme).txt}>{getProperValue(prp.key)}</Text>
                      </View>
                    );
                  })
                }

                <CustomCheckbox
                  {...{
                    handleSetAgreementConfirmed,
                    agreementConfirmed,
                    title: getLang(language, "REMEMBER_MY_CHOICE"),
                  }}
                />


                <View style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                  marginTop: MARGIN_T,

                }}>
                  <CustomButton text={getLang(language, "CANCEL")} isSecondary={true}
                                onPress={() => {
                                  setModalApproved(false);
                                  setShowModal(false);
                                }}
                                style={styles(activeUserColors).button}
                                textStyles={styles(activeTheme).btnTxt}
                  />


                  <CustomButton text={getLang(language, "APPROVE")} isSecondary={false}
                                textStyles={styles(activeTheme).btnTxt}
                                onPress={handleApprove}
                                style={styles(activeUserColors).buttonApprove} />

                </View>

              </View>
            </View>

          </Modal>
        }


      </View>

      <BottomSheet
        onOpenEnd={() => setActiveIndex("top")}
        onCloseEnd={() => {
          setActiveIndex("initial");
          Keyboard.dismiss();
        }}
        enabledContentTapInteraction={false}
        renderHeader={renderHeader}
        ref={sheetRef}
        initialSnap={1}
        enabledInnerScrolling={false}
        snapPoints={[snap0, snap1]}
        renderContent={renderContent}
      />
    </>
  );
};

export default React.memo(AnimatedSheet);

const styles = (props) => StyleSheet.create({
  tabWrapper: {},
  header: {
    borderTopColor: props.borderGray,
    borderLeftColor: props.borderGray,
    borderRightColor: props.borderGray,
    borderTopWidth: 3,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    backgroundColor: props.backgroundApp,
    justifyContent: "center",
    height: isIphoneX ? 80 : 70,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadow: {
      // shadowColor: props.borderGray,
      // shadowOffset: {
      //   width: 0,
      //   height: 0,
      // },
      // shadowRadius: 2,
      // elevation: 2,
      // shadowOpacity: 1,
    },
  },
  headerIcon: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: props.backgroundApp,
    borderRadius: 20,
    paddingVertical: 35,
    paddingHorizontal: PADDING_H,
    alignItems: "center",
    shadow: {
      // shadowColor: props.borderGray,
      // shadowOffset: {
      //   width: 0,
      //   height: 0,
      // },
      // shadowRadius: 2,
      // elevation: 2,
      // shadowOpacity: 1,
    },
    borderWidth: 1,
    borderColor: props.borderGray,
    width: SCREEN_WIDTH - (PADDING_H * 2),
  },
  button: {
    width: "48%",
    backgroundColor: props.askText,
    borderRadius: 10,
  },
  buttonApprove: {
    width: "48%",
    backgroundColor: props.bidText,
    borderRadius: 10,
  },
  btnTxt: {
    fontSize: BIG_TITLE_FONTSIZE,
    color: props.buttonWhite,
    fontFamily: "CircularStd-Bold",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: props.appWhite,
    fontSize: BIG_TITLE_FONTSIZE + 2,
    fontFamily: "CircularStd-Bold",
  },

  vv: {
    flexDirection: "row", justifyContent: "space-between", width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: props.borderGray,
    paddingBottom: PADDING_H,
    marginBottom: PADDING_H,
  },
  txt: {
    color: props.appWhite,
    fontFamily: "CircularStd-Book",
    fontSize: BIG_TITLE_FONTSIZE,
  },
  icon: {
    width: 14,
    height: 14,
  },
});
