import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import moment from "moment";
import { getLang } from "../../../helpers/array-helper";
import { BIG_TITLE_FONTSIZE, NORMAL_FONTSIZE, PADDING_H, PADDING_V, SCREEN_HEIGHT } from "../../../../utils/dimensions";
import { formatMoney } from "../../../helpers/math-helper";
import DynamicImage from "../../../components/dynamic-image";


const OrderCard = ({ order }) => {

  const { activeTheme, language } = useSelector(state => state.globalReducer);

  /*
  {
  "am": 3.91213527,
   "cf": "TRY",
   "ct": "1INCH",
  "di": 2, "eam": 76.66002414,
  "efe": 0.19165006,
  "egt": 76.8516742,
   "eov": 19.59544311,
   "fa": 0,
   "fdp": 3, "fe": 0.19154161,
   "gs": 0,
   "gt": 76.61664247,
   "mg": "43317a70-397e-4c88-addc-2c96baea5d35",
   "og": "30614658-50a8-49be-b93e-4fb3f2dbf529",
   "ov": 19.633315,
   "sa": 76.80818408,
   "tdp": 8,
   "ts": "2022-04-28T00:56:49.440Z",
   "ty": 1}
   */
  const type = order.di === 1 ? "BUY" : "SELL";
  // const status = order.st === 1 ? "PENDING" : order.st === 2 ? "APPROVED" : order.st === 3 ? "CANCELLED" : "ERROR";

  const fields = [
    { id: 1, title: "AMOUNT", value: formatMoney(order.am, 8) },
    { id: 2, title: "TYPE", value: getLang(language, type + "_NOUN") },
    {
      id: 3, title: "DATE", value: moment(order.ts).utc().format("YYYY-MM-DD HH:mm"),
    },
    { id: 4, title: "TRANSACTION_PAIR", value: order.ct + " / " + order.cf },
  ];

  return (
    <View style={styles(activeTheme).wrapper}>
      <View style={styles(activeTheme).container}>

        <View style={styles(activeTheme).box}>


          <DynamicImage market={order.ct} style={styles(activeTheme).img} />

        </View>


        <View style={[styles(activeTheme).desc]}>
          {
            fields.map(field => (
              <View
                key={field.id}
                style={styles(activeTheme).left}>

                <Text style={styles(activeTheme).title}>
                  {getLang(language, field.title)}
                </Text>

                <Text style={styles(activeTheme).txt}>
                  {field.value}
                </Text>
              </View>
            ))
          }


        </View>
      </View>


    </View>
  );
};

export default OrderCard;

const styles = (props) => StyleSheet.create({
  wrapper: {
    width: "100%",
    // paddingHorizontal: 20,
  },
  container: {
    width: "100%",
    height: SCREEN_HEIGHT / 8,
    marginVertical: 12,
    borderRadius: 20,
    backgroundColor: props.darkBackground,
    // shadowColor: "rgba(0, 0, 0, 0.25)",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowRadius: 10,
    // shadowOpacity: 1,
    flexDirection: "row",
  },
  box: {
    width: "20%",
    height: "100%",
    backgroundColor: props.borderGray,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    marginLeft: -5,
    width: 30,
    height: 30,
  },
  desc: {
    paddingHorizontal: PADDING_H,
    paddingVertical: PADDING_V / 2,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    width: "80%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  left: {
    width: "50%",
    height: "50%",
  },
  title: {
    fontFamily: "CircularStd-Bold",
    fontSize: BIG_TITLE_FONTSIZE + 2,
    color: props.secondaryText,

  },
  txt: {
    marginTop: 2,
    fontFamily: "CircularStd-Book",
    fontSize: NORMAL_FONTSIZE,
    color: props.appWhite,
  },
});
