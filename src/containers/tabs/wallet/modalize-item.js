import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import DynamicImage from "../../../components/dynamic-image";
import {
  BIG_TITLE_FONTSIZE,
  LIST_ITEM_HEIGHT, NORMAL_FONTSIZE,
  NORMAL_IMAGE, PADDING_H,
} from "../../../../utils/dimensions";
import { formatMoney, formattedNumber, nFormatter } from "../../../helpers/math-helper";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import DropdownAlert from "../../../providers/DropdownAlert";
import HapticProvider from "../../../providers/HapticProvider";

const WalletBottomSheetItem = (props) => {
  const { wallet, handleDetail, index } = props;
  const { activeTheme, fontSizes, language } = useSelector(state => state.globalReducer);
  const { isBalanceHidden } = useSelector(state => state.walletReducer);


  const handleAction = (type = "deposit") => {

    HapticProvider.trigger();
    //TODO CHECK STATE
    if (type === "deposit" && !wallet.da) {
      return DropdownAlert.show("info", getLang(language, "INFORMATION"), wallet.cd + " " + getLang(language, "IN_MAINTENANCE_DEPOSIT"));
    }

    handleDetail(wallet, type);
  };

  const getHiddenText = (total) => {
    let hiddenText = "";
    for (let i = 0; i < total + 2; i++) {
      hiddenText += "*";
    }
    return hiddenText;
  };


  if (Object.keys(wallet).length <= 0)
    return;
  return (

    <Pressable onPress={() => handleAction("deposit")}
               style={[styles(activeTheme).itemContainer, {
                 backgroundColor: index % 2 === 1 ? activeTheme.darkBackground : activeTheme.backgroundApp,
               }]}>
      <View style={{ flexDirection: "row", width: "100%", height: "100%" }}>
        <View style={styles(activeTheme).itemLeftContainer}>

          <DynamicImage style={styles(activeTheme).image} market={wallet.cd} />

          <View>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={styles(activeTheme, fontSizes).marketTitle}>
              {wallet.cd}
            </Text>

            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={styles(activeTheme, fontSizes).marketDesc}>
              {wallet.nm}
            </Text>
          </View>
        </View>
        <View style={[styles(activeTheme).centerContainer, { alignItems: "flex-end" }]}>
          <Text style={[styles(activeTheme, fontSizes).price, { fontSize: BIG_TITLE_FONTSIZE }]}>
            {
              isBalanceHidden ? getHiddenText(formattedNumber(wallet.wb, wallet.cd).length) : `${formatMoney(wallet.wb, wallet.dp)}`
            }
          </Text>

          <Text style={[styles(activeTheme, fontSizes).price, { color: activeTheme.secondaryText }]}>
            {
              isBalanceHidden ? getHiddenText(formattedNumber(wallet.am, wallet.cd).length) : `${formatMoney(wallet.am, wallet.dp)}`
            }
          </Text>
        </View>

        <View style={styles(activeTheme).rightContainer}>
          <Text style={[styles(activeTheme, fontSizes).price, {}]}>
            {
              isBalanceHidden ? getHiddenText(nFormatter(wallet.EstimatedTRY, 2).length) + "  ₺" : ` ≈  ${wallet.EstimatedTRY ? formatMoney(wallet.EstimatedTRY, 4) : "0.00"} ₺`
            }
          </Text>


          <Text style={[styles(activeTheme, fontSizes).price, {
            color: activeTheme.secondaryText,
          }]}>
            {
              isBalanceHidden ? getHiddenText(nFormatter(wallet.EstimatedUSDT, 2).length) + "  $" : ` ≈  ${wallet.EstimatedUSDT ? formatMoney(wallet.EstimatedUSDT, 4) : "0.00"} $`
            }
          </Text>


          <Text style={[styles(activeTheme, fontSizes).price, {
            color: activeTheme.inActiveListBg,
          }]}>
            {
              isBalanceHidden ? getHiddenText(8) + " ₿" : ` ≈ ${wallet.EstimatedBTC ? formatMoney(wallet.EstimatedBTC, 8) : "0.00"} ₿`
            }
          </Text>


        </View>
      </View>
    </Pressable>

  );
};

export default React.memo(WalletBottomSheetItem);


const styles = (props, fontSizes) => StyleSheet.create({

  itemContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: LIST_ITEM_HEIGHT,
    paddingHorizontal: PADDING_H,
  },
  itemLeftContainer: {
    width: "20%",
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: NORMAL_IMAGE,
    height: NORMAL_IMAGE,
    marginRight: 12,
  },
  marketTitle: {
    textAlign: "left",
    fontFamily: "CircularStd-Bold",
    fontSize: fontSizes?.BIG_TITLE_FONTSIZE,
    color: props.appWhite,

  },
  marketDesc: {
    textAlign: "left",
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.SUBTITLE_FONTSIZE,
    color: props.secondaryText,
  },
  centerContainer: {
    width: "40%",
    height: "100%",
    textAlign: "right",
    alignItems: "center",
    justifyContent: "center",

  },
  price: {
    textAlign: "right",
    fontFamily: "CircularStd-Bold",
    fontSize: fontSizes?.SUBTITLE_FONTSIZE - 1,
    color: props.appWhite,

  },

  rightContainer: {
    width: "40%",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: PADDING_H,

  },

  separator: {
    color: props.secondaryText,
    height: "4%",
    lineHeight: 10,
  },

  container: {
    flex: 1,
    paddingTop: 20,
  },
  listItem: {
    height: 75,
    alignItems: "center",
    justifyContent: "center",
  },
  leftSwipeItem: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 20,
  },
  rightSwipeItem: {
    justifyContent: "center",
    height: 50,
    width: 50,
  },

  rightWrap: {
    width: 210,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  buttonWrap: {
    width: "33%",
    height: LIST_ITEM_HEIGHT,
    backgroundColor: props.yesGreen,
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  actionText: {
    fontFamily: "CircularStd-Book",
    color: props.buttonWhite,
    fontSize: fontSizes?.NORMAL_FONTSIZE,
  },
  icon: {
    width: 18,
    height: 18,
  },
});


