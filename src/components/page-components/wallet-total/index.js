import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles";
import { navigationRef } from "../../../providers/RootNavigation";
import { formatMoney } from "../../../helpers/math-helper";
import { getLang } from "../../../helpers/array-helper";
import { setShowBalance } from "../../../actions/wallet-actions";
import PlLoading from "../../../containers/pl-loading";
import { useIsFocused } from "@react-navigation/native";
import TinyImage from "../../../tiny-image";
import { DIMENSIONS } from "../../../../utils/dimensions";
import NImage from "../image/index.tsx.js";
import ActionSheetComProvider from "../../../providers/ActionSheetComProvider";
import LocalStorage from "../../../providers/LocalStorage";

const WalletTotal = ({ buttons = false, handleAction = null, refreshing = false }) => {

  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const { language, activeTheme, fontSizes } = useSelector(state => state.globalReducer);
  const { user } = useSelector(state => state.authenticationReducer);

  const { marketsWithKey, btcTryGd, usdtTryGd } = useSelector(state => state.marketReducer);
  const { isBalanceHidden, wallets } = useSelector(state => state.walletReducer);
  const [estimatedBTC, setEstimatedBTC] = useState(null);
  const [estimatedUSDT, setEstimatedUSDT] = useState(null);
  const [estimatedTRY, setEstimatedTRY] = useState(null);

  useEffect(() => {
    if (isFocused) {
      const selected = LocalStorage.getItem("activeCurrency");
      if (selected) {
        setActiveCurrency(selected);
      }
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused && wallets.length >= 1 && btcTryGd && marketsWithKey[btcTryGd]) {
      handleCalculateEstimated();
    }
  }, [refreshing, wallets, isFocused]);

  const handleCalculateEstimated = () => {
    const btcPrice = marketsWithKey[btcTryGd].pr;
    const usdtPrice = marketsWithKey[usdtTryGd].pr;
    let totalEstimatedTRY = 0;
    let totalEstimatedBTC = 0;
    let totalEstimatedUSDT = 0;

    wallets.forEach(function(wallet) {
      wallet.EstimatedTRY = 0;
      wallet.EstimatedBTC = 0;
      wallet.EstimatedUSDT = 0;
      if (wallet.cd === "TRY") {

        wallet.EstimatedBTC = wallet.am / btcPrice;
        totalEstimatedBTC += wallet.am / btcPrice;

        wallet.EstimatedUSDT = wallet.am / usdtPrice;
        totalEstimatedUSDT += wallet.am / usdtPrice;

        wallet.EstimatedTRY += wallet.am;
        totalEstimatedTRY += wallet.am;

      } else if (wallet.cd === "USDT") {

        const estimatedTryTotal = wallet.am * usdtPrice;

        wallet.EstimatedBTC = estimatedTryTotal / btcPrice;
        totalEstimatedBTC += estimatedTryTotal / btcPrice;

        wallet.EstimatedTRY += estimatedTryTotal;
        totalEstimatedTRY += estimatedTryTotal;

        wallet.EstimatedUSDT += wallet.am;
        totalEstimatedUSDT += wallet.am;

      } else {

        const marketKey = Object.keys(marketsWithKey).find(key => marketsWithKey[key].fs === "TRY" && marketsWithKey[key].to === wallet.cd);
        const marketItem = marketsWithKey[marketKey];
        if (marketItem) {

          const coinPrice = marketItem.pr;

          if (wallet.cd === "BTC") {
            const estimatedTryTotalBTC = wallet.am * coinPrice;

            wallet.EstimatedBTC = wallet.am;
            totalEstimatedBTC += wallet.am;

            wallet.EstimatedTRY = wallet.am * btcPrice;
            totalEstimatedTRY += wallet.am * btcPrice;

            wallet.EstimatedUSDT = estimatedTryTotalBTC / usdtPrice;
            totalEstimatedUSDT += estimatedTryTotalBTC / usdtPrice;
          } else {
            const estimatedTryTotal = wallet.am * coinPrice;


            wallet.EstimatedTRY = estimatedTryTotal;
            totalEstimatedTRY += estimatedTryTotal;

            wallet.EstimatedBTC = estimatedTryTotal / btcPrice;
            totalEstimatedBTC += estimatedTryTotal / btcPrice;

            wallet.EstimatedUSDT = estimatedTryTotal / usdtPrice;
            totalEstimatedUSDT += estimatedTryTotal / usdtPrice;
          }
        }

      }
      return wallet;
    });
    setEstimatedBTC(totalEstimatedBTC);
    setEstimatedTRY(totalEstimatedTRY);
    setEstimatedUSDT(totalEstimatedUSDT);
  };

  const handleNavigation = (type) => navigationRef.current.navigate(type);

  const getHiddenText = (total) => {
    let hiddenText = "";
    for (let i = 0; i < total + 4; i++) {
      hiddenText += "*";
    }
    return hiddenText;
  };

  const [activeCurrency, setActiveCurrency] = useState("BTC");

  const handleApprove = (index) => {
    if (index === 0) {
      //TRY SELECTED
      setActiveCurrency("BTC");
      LocalStorage.setItem("activeCurrency", "BTC");
    } else if (index === 1) {
      // USDT SELECTED
      setActiveCurrency("USDT");
      LocalStorage.setItem("activeCurrency", "USDT");

    }
  };

  const handleSelectCurrency = () => {
    ActionSheetComProvider.show({
      title: getLang(language, "CHOOSE_CURRENCY_TO_OBSERVE"),
      options: ["BTC", "USDT", getLang(language, "CANCEL")],
      onAction: (index) => handleApprove(index),
      oldActive: activeCurrency === "BTC" ? 0 : 1,
    });
  };

  const show = estimatedBTC !== null && estimatedTRY !== null && estimatedUSDT !== null;

  if (wallets.length <= 0 || Object.keys(user).length <= 0) {
    return <PlLoading height={80} />;
  }

  return (
    <View
      style={[styles(activeTheme).wrapper]}>

      <View style={[styles(activeTheme).infoTab, styles(activeTheme).shadow]}>

        <View
          style={styles(activeTheme).infoTabContainer}>

          <Pressable
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
            }}
            onPress={() => dispatch(setShowBalance(!isBalanceHidden))}
          >
            <View style={{
              marginRight: 12,
              height: "100%",
            }}>
              {
                !show && <ActivityIndicator size={"small"} color={"#94AADD"} />
              }


              {
                show &&
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: DIMENSIONS.PADDING_H / 2,
                }}>
                  <Text style={[styles(activeTheme, fontSizes).amount, {}]}>

                    {isBalanceHidden ? getHiddenText(10) : "≈ " + formatMoney(estimatedTRY, 4)}

                  </Text>


                  {
                    !isBalanceHidden && <Text style={[styles(activeTheme, fontSizes).amount, {
                      fontSize: fontSizes.BIG_TITLE_FONTSIZE - 4,
                      paddingLeft: 2,
                      alignSelf: "flex-end",
                      paddingBottom: 2,
                    }]}>
                      TRY
                    </Text>
                  }


                  <Pressable
                    onPress={() => dispatch(setShowBalance(!isBalanceHidden))}
                    style={{
                      paddingHorizontal: DIMENSIONS.PADDING_H,
                      paddingTop: 1,
                    }}>

                    <NImage
                      useFastImage={true}
                      source={{ uri: `https://images.coinpara.com/files/mobile-assets/eye-${isBalanceHidden ? "close" : "open"}.png` }}
                      resizeMode={"contain"}
                      style={[styles(activeTheme).eye]} />
                  </Pressable>


                </View>

              }


              {
                show && <Pressable
                  onPress={handleSelectCurrency}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 4,
                  }}>

                  <Text style={[styles(activeTheme, fontSizes).smallText2, { marginRight: DIMENSIONS.PADDING_H, color: "#94AADD" }]}>
                    {isBalanceHidden ? getHiddenText(10)
                      : "≈ " + formatMoney(activeCurrency === "BTC" ? estimatedBTC : estimatedUSDT, activeCurrency === "BTC" ? 8 : 4)}

                    {
                      !isBalanceHidden ? "  " + getLang(language, "ESTIMATED") + "  (" + activeCurrency + ")" : null
                    }
                  </Text>


                  {
                    !isBalanceHidden && <TinyImage parent={"rest/"} name={"c-down"} style={styles(activeTheme).eye2} />

                  }
                </Pressable>

              }

            </View>

          </Pressable>


          {
            buttons ? <View style={styles(activeTheme).bttns}>
              <Pressable onPress={() => handleAction("withdraw")}
                         style={styles(activeTheme).tl}>
                <Text
                  style={[styles(activeTheme, fontSizes).tlText, { color: "#fff" }]}>{getLang(language, "WITHDRAW")}</Text>
              </Pressable>

              <Pressable
                onPress={() => handleAction("deposit")}
                style={styles(activeTheme).usd}>
                <Text style={styles(activeTheme, fontSizes).tlText}>
                  {getLang(language, "DEPOSIT")}</Text>
              </Pressable>
            </View> : <Pressable
              onPress={() => handleNavigation("WalletStack")}
              style={styles(activeTheme).arr}>
              <TinyImage parent={"rest/"} name={"wallet-total"}
                         style={styles(activeTheme).icn} />
            </Pressable>
          }

        </View>

      </View>

    </View>

  );
};


export default React.memo(WalletTotal);
