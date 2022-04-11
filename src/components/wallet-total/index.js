import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles";
import { navigationRef } from "../../providers/RootNavigation";
import { formatMoney } from "../../helpers/math-helper";
import { getLang } from "../../helpers/array-helper";
import { setShowBalance } from "../../actions/wallet-actions";
import PlLoading from "../../containers/pl-loading";
import { useIsFocused } from "@react-navigation/native";
import TinyImage from "../../tiny-image";

const WalletTotal = ({ buttons = false, handleAction = null, refreshing = false }) => {

  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const { language, activeTheme,fontSizes } = useSelector(state => state.globalReducer);
  const { user } = useSelector(state => state.authenticationReducer);

  const { marketsWithKey, btcTryGd } = useSelector(state => state.marketReducer);
  const { isBalanceHidden, wallets } = useSelector(state => state.walletReducer);
  const [estimatedBTC, setEstimatedBTC] = useState(null);
  const [estimatedTRY, setEstimatedTRY] = useState(null);

  useEffect(() => {
    if (isFocused && wallets.length >= 1 && btcTryGd && marketsWithKey[btcTryGd]) {
      handleCalculateEstimated();
    }
  }, [refreshing, wallets, isFocused]);

  const handleCalculateEstimated = () => {
    const btcPrice = marketsWithKey[btcTryGd].pr;
    let totalEstimatedTRY = 0;
    let totalEstimatedBTC = 0;

    wallets.forEach(function(wallet) {
      wallet.EstimatedTRY = 0;
      wallet.EstimatedBTC = 0;
      if (wallet.cd === "TRY") {
        wallet.EstimatedBTC = wallet.am / btcPrice;
        wallet.EstimatedTRY += wallet.am;
        totalEstimatedTRY += wallet.am;
        totalEstimatedBTC += wallet.am / btcPrice;
      } else {
        const marketKey = Object.keys(marketsWithKey).find(key => marketsWithKey[key].fs === "TRY" && marketsWithKey[key].to === wallet.cd);
        const marketItem = marketsWithKey[marketKey];
        const coinPrice = marketItem.pr;
        if (wallet.cd === "BTC") {
          wallet.EstimatedBTC = wallet.am;
          totalEstimatedBTC += wallet.am;

          wallet.EstimatedTRY = wallet.am * btcPrice;
          totalEstimatedTRY += wallet.am * btcPrice;
        } else {
          const estimatedTryTotal = wallet.am * coinPrice;
          wallet.EstimatedTRY = estimatedTryTotal;
          totalEstimatedTRY += estimatedTryTotal;

          wallet.EstimatedBTC = estimatedTryTotal / btcPrice;
          totalEstimatedBTC += estimatedTryTotal / btcPrice;
        }
      }
      return wallet;
    });
    setEstimatedBTC(totalEstimatedBTC);
    setEstimatedTRY(totalEstimatedTRY);
  };

  const handleNavigation = (type) => navigationRef.current.navigate(type);

  const getHiddenText = (total) => {
    let hiddenText = "";
    for (let i = 0; i < total + 4; i++) {
      hiddenText += "*";
    }
    return hiddenText;
  };

  const show = estimatedBTC !== null && estimatedTRY !== null;

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
            style={{ height: "70%", justifyContent: "space-around" }}
            onPress={() => dispatch(setShowBalance(!isBalanceHidden))}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {
                show ?
                  <Text style={[styles(activeTheme,fontSizes).amount, { marginTop: isBalanceHidden ? 4 : 0 }]}>
                    {isBalanceHidden ? getHiddenText(10) : "≈ " + formatMoney(estimatedTRY, 4) + " ₺"}
                  </Text> : <ActivityIndicator size={"small"} style={{ alignSelf: "flex-start" }} />
              }

              {
                show && <TinyImage parent={"rest/"} name={!isBalanceHidden ? "eye" : "eye-close"}
                                   style={styles(activeTheme).eye} />
              }


            </View>

            {
              show ? <Text style={[styles(activeTheme,fontSizes).smallText, { marginTop: 6, color: activeTheme.secondaryText }]}>
                {
                  isBalanceHidden ? getHiddenText(8) : "≈ " + formatMoney(estimatedBTC, 8) + " ₿"
                }
              </Text> : <ActivityIndicator size={"small"} style={styles(activeTheme).ind} />
            }

          </Pressable>

          {
            buttons ? <View style={styles(activeTheme).bttns}>
              <Pressable onPress={() => handleAction("deposit")}
                         style={styles(activeTheme).tl}>
                <Text
                  style={[styles(activeTheme,fontSizes).tlText, { color: activeTheme.buttonWhite }]}>{getLang(language, "DEPOSIT")}</Text>
              </Pressable>

              <Pressable
                onPress={() => handleAction("withdraw")}
                style={styles(activeTheme).usd}>
                <Text style={styles(activeTheme,fontSizes).tlText}>{getLang(language, "WITHDRAW")}</Text>
              </Pressable>
            </View> : <Pressable
              onPress={() => handleNavigation("Wallet")}
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
