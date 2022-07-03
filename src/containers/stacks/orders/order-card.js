import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import moment from "moment";
import { getLang } from "../../../helpers/array-helper";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { formatMoney } from "../../../helpers/math-helper";
import DynamicImage from "../../../components/page-components/dynamic-image";


const OrderCard = ({ order }) => {

  const { activeTheme, language } = useSelector(state => state.globalReducer);

  const type = order.di === 1 ? "BUY" : "SELL";

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

export default React.memo(OrderCard);

const styles = (props) => StyleSheet.create({
  wrapper: {
    width: "100%",
    // paddingHorizontal: 20,
  },
  container: {
    width: "100%",
    height: DIMENSIONS.SCREEN_HEIGHT / 8,
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
    paddingHorizontal: DIMENSIONS.PADDING_H,
    paddingVertical: DIMENSIONS.PADDING_V / 2,
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
    fontSize: DIMENSIONS.BIG_TITLE_FONTSIZE + 2,
    color: props.secondaryText,

  },
  txt: {
    marginTop: 2,
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.NORMAL_FONTSIZE,
    color: props.appWhite,
  },
});
