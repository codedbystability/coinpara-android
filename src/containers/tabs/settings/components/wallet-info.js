import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { formatMoney, formattedNumber } from "../../../../helpers/math-helper";
import {
  MARGIN_T,
  PADDING_V,
} from "../../../../../utils/dimensions";
import { getLang } from "../../../../helpers/array-helper";
import { useSelector } from "react-redux";
import { getTRYMarket } from "../../../../selectors/wallet-selector";
import marketServices from "../../../../services/market-services";
import userServices from "../../../../services/user-services";


const WalletInfo = () => {

  const { activeTheme, fontSizes, language } = useSelector(state => state.globalReducer);

  const [approvedAccount, setApprovedAccount] = useState(false);
  const [btcCommission, setBtcComission] = useState({
    MakerCommission: 0,
    TakerCommission: 0,
  });

  const { btcTryGd } = useSelector(state => state.marketReducer);

  useEffect(() => {
    if (btcTryGd) {
      marketServices.getMarketCommissions(btcTryGd).then((response) => {
        if (response.IsSuccess) {
          setBtcComission(response.Data);
        }
      });

      userServices.getApproval().then(response => {
        if (response && response.Data) {
          setApprovedAccount(response.Data.AdminApproval);
        }
      });
    }
  }, [btcTryGd]);

  const tryWallet = useSelector(getTRYMarket);

  // const getDailyLimit = () => {
  //   if (approvedAccount) {
  //     return tryWallet.lk - tryWallet.ds;
  //   } else {
  //     return tryWallet.li - tryWallet.ds;
  //   }
  // };

  const getMonthlyLimit = () => {
    if (approvedAccount) {
      return formatMoney(tryWallet.lm - tryWallet.ms, 4);
    } else {
      return formatMoney(tryWallet.lj - tryWallet.ms, 4);
    }
  };

  if (!tryWallet || Object.keys(tryWallet).length <= 0) {
    return <View style={{
      height: 120,
      backgroundColor: activeTheme.darkBacgkround,
      alignItems: "center",
      justifyContent: "center",
    }}>
      <ActivityIndicator color={activeTheme.appWhite} />
    </View>;
  }

  return (
    <View style={[styles(activeTheme).container, styles(activeTheme).shadow]}>

      <View style={styles(activeTheme).itemWrapper}>
        <View style={styles(activeTheme).itemFirstWrapper}>
          <Text
            numberOfLines={1}
            style={styles(activeTheme, fontSizes).name}>{formattedNumber(tryWallet.ms, "TRY")} ₺</Text>
          <Text
            numberOfLines={1}
            style={styles(activeTheme, fontSizes).email}>{getLang(language, "MONTHLY_SPENT_AMOUNT")}</Text>

        </View>

        <View style={styles(activeTheme).itemSecondWrapper}>
          <Text
            numberOfLines={1}
            style={styles(activeTheme, fontSizes).name}>{formattedNumber(approvedAccount ? tryWallet.lm : tryWallet.lj, "TRY")} ₺</Text>
          <Text
            numberOfLines={1}
            style={styles(activeTheme, fontSizes).email}>{getLang(language, "MONTHLY_WITHDRAW_LIMIT")}</Text>
        </View>

      </View>

      <View style={[styles(activeTheme).itemWrapper, { marginTop: 15 }]}>
        <View style={styles(activeTheme).itemFirstWrapper}>
          <Text
            numberOfLines={1}
            style={styles(activeTheme, fontSizes).name}>%
            {formattedNumber(btcCommission.MakerCommission, "TRY")} /
            %{formattedNumber(btcCommission.TakerCommission, "TRY")}</Text>
          <Text
            numberOfLines={1}
            style={styles(activeTheme, fontSizes).email}>{getLang(language, "COMMISSION_RATE_M_T")}</Text>
        </View>

        <View style={styles(activeTheme).itemSecondWrapper}>
          <Text
            numberOfLines={1}
            style={styles(activeTheme, fontSizes).name}>{
            getMonthlyLimit()
          } ₺
          </Text>
          <Text
            numberOfLines={1}
            style={styles(activeTheme, fontSizes).email}>{getLang(language, "MONTHLY_REMAINING_LIMIT")}</Text>
        </View>

      </View>

    </View>
  );

};


export default React.memo(WalletInfo);

const styles = (props, fontSizes) => StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: "center",
    paddingVertical: PADDING_V,
    marginTop: MARGIN_T,
    backgroundColor: props.darkBackground,
    borderWidth: 1,
    borderColor: props.borderGray,
    marginBottom: MARGIN_T
  },

  shadow: {},
  itemWrapper: {
    width: "100%",
    flexDirection: "row",
  },

  itemFirstWrapper: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "50%",
  },

  itemSecondWrapper: {
    justifyContent: "center",
    alignItems: "flex-end",
    width: "50%",
  },

  name: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.NORMAL_FONTSIZE,
    color: props.appWhite,
  },
  email: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.NORMAL_FONTSIZE,
    color: props.actionColor,
    marginTop: 5,
  },
});
