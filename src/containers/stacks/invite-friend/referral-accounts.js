import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BIG_TITLE_FONTSIZE, PADDING_BV, PADDING_H } from "../../../../utils/dimensions";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import TinyImage from "../../../tiny-image";

const items = [
  {
    id: 1,
    key: "base-commission",
    title: "BASE_COMMISSIONS_RATE",
    value: "%20",
    image: "stack",
  },
  {
    id: 2,
    image: "cup",
    key: "you-earned", title: "YOU_EARNED", value: "0",
  },
  {
    id: 3,
    image: "friends",
    key: "friends", title: "TOTAL_NUMBER_OF_FRIENDS", value: "0",
  },
  {
    id: 4, image: "rank",
    key: "ranking", title: "YOUR_RANK", value: "0",
  },
];
const ReferralAccounts = (props) => {

  const { activeTheme, language } = useSelector(state => state.globalReducer);


  return (

    <View style={styles(activeTheme).wrapper}>
      <Text style={styles(activeTheme).title}>{getLang(language, "YOUR_REFERRAL_ACCOUNT")}</Text>

      <View style={styles(activeTheme).container}>


        {
          items.map(item => (
            <View
              key={item.id}
              style={styles(activeTheme).gradient}
            >

              <View style={{
                position: "absolute",
                top: "14%",
                right: 5,
              }}>
                <TinyImage parent={"ref/"} name={item.image} style={styles(activeTheme).img} />
              </View>

              <Text style={styles(activeTheme).valueText}>
                {item.value}
              </Text>


              <Text style={styles(activeTheme).desc}>{getLang(language, item.title)}</Text>


            </View>

          ))
        }


      </View>
    </View>

  );

};

export default ReferralAccounts;

const styles = (props) => StyleSheet.create({

  wrapper: {
    paddingHorizontal: PADDING_H,
  },
  title: {
    fontFamily: "CircularStd-Book",
    fontSize: BIG_TITLE_FONTSIZE + 6,
    letterSpacing: 0,
    color: props.appWhite,
  },
  container: {
    paddingTop: PADDING_BV,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gradient: {
    borderRadius: 8,
    height: 80,
    width: "48%",
    padding: PADDING_H,
    justifyContent: "space-around",
    marginBottom: 10,
    backgroundColor: props.darkBackground,
  },
  valueText: {
    color: props.appWhite,
    fontSize: BIG_TITLE_FONTSIZE + 4,
    fontFamily: "CircularStd-Bold",
  },

  desc: {
    fontSize: BIG_TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
    color: props.secondaryText,
  },
  img: {
    width: 22,
    height: 22,
  },
});
