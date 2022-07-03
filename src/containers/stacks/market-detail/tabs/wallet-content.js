import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { DIMENSIONS } from "../../../../../utils/dimensions";
import Loading from "../../../../components/page-components/loading";
import { getLang } from "../../../../helpers/array-helper";
import { navigationRef } from "../../../../providers/RootNavigation";
import { formatMoney } from "../../../../helpers/math-helper";

const titles = [
  { id: 1, key: "symbol", title: "SYMBOL" },
  { id: 2, key: "balance", title: "BALANCE" },
  { id: 3, key: "operations", title: "WALLET" },
];

const WalletContent = (props) => {

  const { market } = props;
  const wallets = useSelector(state => state.walletReducer.wallets);
  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const [validWallets, setValidWallets] = useState([]);

  const handleNavigation = (type, wallet) => navigationRef.current.navigate("Transfer", {
    wallet,
    transactionType: type,
    coinType: ["TRY", "EUR", "USD"].includes(wallet.cd) ? "price" : "crypto",
  });

  useEffect(() => {
    if (market.to && wallets && wallets.length >= 1) {
      // setValidWallets(wallets.filter(item => item.am > 0));
      setValidWallets(wallets.filter(item => item.cd === market.fs || item.cd === market.to));
    }
  }, [wallets, market]);

  if (!market || Object.keys(market).length <= 0) {
    return <Loading />;
  }


  return (
    <ScrollView contentContainerStyle={{
      paddingVertical: DIMENSIONS.PADDING_V,
      paddingHorizontal: DIMENSIONS.PADDING_H,
    }}>

      <View style={styles(activeTheme).titleContainer}>
        {
          titles.map((title, key) => <Text key={title.id}
                                           style={[styles(activeTheme).title, {
                                             textAlign: key === 0 ? "left" : key === 2 ? "center" : "right",
                                             width: key === 2 ? "50%" : "25%",
                                           }]}>{getLang(language, title.title)}</Text>)
        }
      </View>

      <View style={styles(activeTheme).contentWrapper}>

        {
          validWallets.map(wallet => {

            return (
              <View
                key={wallet.gd}
                style={{
                  flexDirection: "row",
                  height: 30,
                  marginBottom: 5,
                  alignItems: "center",
                }}>
                <Text
                  style={[styles(activeTheme).priceText, {
                    textAlign: "left",
                    fontFamily: "CircularStd-Bold",
                    paddingLeft: 10,
                    color: activeTheme.appWhite,
                  }]}>{wallet.cd}</Text>
                <Text style={[styles(activeTheme).priceText, {
                  textAlign: "right", width: "35%", color: activeTheme.appWhite,
                }]}>{formatMoney(wallet.wb, wallet.dp)}</Text>
                <View style={styles(activeTheme).buttonContainer}>
                  <Pressable
                    onPress={() => handleNavigation("deposit", wallet)}
                    style={[styles(activeTheme).buttonWrapper, { backgroundColor: activeTheme.actionColor }]}>
                    <Text
                      style={styles(activeTheme).text}>{getLang(language, "DEPOSIT")}</Text>
                  </Pressable>


                  <Pressable
                    onPress={() => handleNavigation("withdraw", wallet)}
                    style={[styles(activeTheme).buttonWrapper, { backgroundColor: activeTheme.secondaryText }]}>
                    <Text
                      style={[styles(activeTheme).text, { color: activeTheme.buttonWhite }]}>{getLang(language, "WITHDRAW")}</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        }


      </View>

    </ScrollView>

  );

};


export default WalletContent;

const styles = (props) => StyleSheet.create({
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    borderBottomColor: props.borderGray,
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
  contentWrapper: {
    width: "100%",
  },
  title: {
    textAlign: "left",
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.TITLE_FONTSIZE - 1,
    color: props.appWhite,
    paddingHorizontal: 6,
  },

  priceText: {
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    color: "#ffffff",
    width: "15%",
  },

  text: {
    fontFamily: "CircularStd-Bold",
    fontSize: DIMENSIONS.NORMAL_FONTSIZE - 1,
    textAlign: "center",
    color: "#ffffff",
  },

  buttonWrapper: {
    // width: "48%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    width: "40%",
    paddingVertical: DIMENSIONS.PADDING_V / 2,
  },

  buttonContainer: {
    width: "55%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },


});
