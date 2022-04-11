import React from "react";
import {  StyleSheet, Text, View } from "react-native";
import DynamicImage from "../dynamic-image";
import { formattedNumber } from "../../helpers/math-helper";
import { useSelector } from "react-redux";
import { BIG_TITLE_FONTSIZE, PADDING_H, PADDING_V, SCREEN_HEIGHT } from "../../../utils/dimensions";
import { getLang } from "../../helpers/array-helper";
import moment from "moment";


const InfoCardDetail = ({ transfer }) => {

  const { activeTheme, language } = useSelector(state => state.globalReducer);

  const type = transfer.td === 1 ? "DEPOSIT" : "WITHDRAW";
  const status = transfer.st === 1 ? "PENDING" : transfer.st === 2 ? "APPROVED" : transfer.st === 3 ? "CANCELLED" : "ERROR";

  const fields = [
    { id: 1, title: type + "_NOUN", value: formattedNumber(transfer.am, transfer.cd) },
    { id: 2, title: "TYPE", value: getLang(language, status) },
    {
      id: 3, title: "DATE", value: moment(transfer.ts).utc().format("YYYY-MM-DD HH:mm"),
    },
    { id: 4, title: "CURRENCY", value: transfer.cd + " / " + transfer.tt },
  ];

  return (
    <View style={styles(activeTheme).wrapper}>
      <View style={styles(activeTheme).container}>

        <View style={styles(activeTheme).box}>


          <DynamicImage market={transfer.cd} style={styles(activeTheme).img} />

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

export default InfoCardDetail;

const styles = (props) => StyleSheet.create({
  wrapper: {
    width: "100%",
    // paddingHorizontal: 20,
  },
  container: {
    width: "100%",
    height: SCREEN_HEIGHT / 6,
    marginVertical: 20,
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
    paddingVertical: PADDING_V,
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
    marginTop: 5,
    fontFamily: "CircularStd-Book",
    fontSize: 14,
    color: props.appWhite,

  },
});
