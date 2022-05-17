import React, { useEffect, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { ScrollView, Text, View } from "react-native";
import TransactionDescriptions from "../transaction-descriptions";
import Loading from "../../../components/loading";
import Clipboard from "@react-native-community/clipboard";
import { useSelector } from "react-redux";
import DropdownAlert from "../../../providers/DropdownAlert";
import { getLang } from "../../../helpers/array-helper";
import { formatMoney } from "../../../helpers/math-helper";
import moment from "moment";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import { BIG_TITLE_FONTSIZE, PADDING_H, TITLE_FONTSIZE } from "../../../../utils/dimensions";
import FloatingAction from "../../../components/floating-action";
import OrderCard from "../orders/order-card";
import TinyImage from "../../../tiny-image";


const OrderDetail = (props) => {

  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const [order, setOrder] = useState({});
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    // console.log("props.route.params.order - ", props.route.params.order);
    const ord = props.route.params.order;

    const percent = parseInt((ord.am - ord.fa) / ord.am * 100);
    setPercentage(percent);
    setOrder(ord);

  }, [props.route.params]);

  const handleCopyTg = (transfer) => {
    DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "TRANSACTION_ID_COPIED"));
    Clipboard.setString(transfer.tg);
  };


  if (!order || Object.keys(order).length <= 1) {
    return <Loading />;
  }

  return (
    <>
      <TabNavigationHeader
        {...props}
        backAble={true}
        isBack={true}
        options={{ title: getLang(language, "ORDER_DETAIL") }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, paddingHorizontal: PADDING_H }}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >

        <OrderCard order={order} />

        <View style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}>
          <TinyImage parent={"rest/"} name={order.fa <= 0 ? "tick-active" : "tick"} style={{
            width: 18,
            height: 18,
            marginRight: 8,
          }} />


          <Text style={{
            fontSize: TITLE_FONTSIZE,
            color: order.fa <= 0 ? activeTheme.changeGreen : activeTheme.secondaryText,
            fontFamily: "CircularStd-Book",
          }}>
            {getLang(language, order.fa <= 0 ? "FILLED" : "PARTIAL")} (% {percentage})
          </Text>
        </View>

        <TransactionDescriptions
          icon={false}
          descriptions={
            [

              {
                id: 1,
                title: "TYPE",
                text: getLang(language, order.ty === 0 ? "LIMIT_ORDER" : order.ty === 1 ? "MARKET_ORDER" : "STOP_ORDER") + " / " + getLang(language, order.di === 1 ? "BUY_NOUN" : "SELL_NOUN"),
                isLan: true,
              },
              {
                id: 4,
                title: "TRANSACTION_PAIR",
                text: order.ct + " / " + order.cf,
                isLan: true,
              },
              {
                id: 2,
                title: "DATE",
                text: moment(order.ts).utc().format("YYYY-MM-DD HH:mm:ss"),
                isLan: true,
              },
              { id: 3, title: "TRANSACTION_ID", text: order.og, isLan: true, icon: "copy" },
            ]}
          handleCopyTg={handleCopyTg} />


        <View>

          <Text style={{
            fontSize: BIG_TITLE_FONTSIZE,
            color: activeTheme.actionColor,
            marginTop: 36,
          }}>{getLang(language, "TRADE_DETAIL")}</Text>

          <TransactionDescriptions
            icon={false}
            descriptions={
              [
                {
                  id: 10,
                  title: "AMOUNT",
                  text: formatMoney(order.am, 8) + " " + order.ct,
                  isLan: true,
                },

                {
                  id: 11,
                  title: "FILLED_AMOUNT",
                  text: formatMoney(order.am - order.fa, 8) + " / " + formatMoney(order.am, 8),
                  isLan: true,
                },
                {
                  id: 0,
                  title: "PRICE",
                  text: formatMoney(order.eov, 8) + " " + order.cf,
                  isLan: true,
                },
                {
                  id: 1,
                  title: "FEE",
                  text: formatMoney(order.fe, 8) + " " + order.ct,
                  isLan: true,
                },

                {
                  id: 2,
                  title: "GENERAL_TOTAL",
                  text: formatMoney(order.egt, 8) + " " + order.cf,
                  isLan: true,
                },

              ]}
            handleCopyTg={handleCopyTg} />

        </View>


      </ScrollView>

      <FloatingAction />

    </>
  );

};

const TransactionDetailScreen = styledHigherOrderComponents(React.memo(OrderDetail));
export default TransactionDetailScreen;
