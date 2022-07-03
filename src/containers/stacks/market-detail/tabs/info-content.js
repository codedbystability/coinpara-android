import React, { Fragment } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import DynamicImage from "../../../../components/page-components/dynamic-image";
import { DIMENSIONS } from "../../../../../utils/dimensions";
import { useSelector } from "react-redux";
import { getLang } from "../../../../helpers/array-helper";
import { items, secondItems, thirdItems } from "./constants";
import { formattedNumber } from "../../../../helpers/math-helper";


const InfoContent = (props) => {

  const { market, info } = props;
  const { activeTheme, language } = useSelector(state => state.globalReducer);


  const renderItem = (item, index) => {
    return (
      <View key={index}
            style={styles(activeTheme).item}>
        <View style={styles(activeTheme).itemInner}>
          <Text style={[styles.priceText, styles(activeTheme).itemTitle]}>{getLang(language, item.title)}</Text>

          {
            item.is24 && <View style={styles(activeTheme).marker}>
              <Text style={styles(activeTheme).marketText}>{item.is24}</Text>
            </View>
          }
        </View>

        <View style={styles(activeTheme).itemRight}>
          <Text
            style={[styles.priceText, styles(activeTheme).price]}>
            {
              item.is24 ? "%" + info[item.key].toFixed(4) : formattedNumber(info[item.key], "USD", 3, true)
            }
          </Text>
        </View>

      </View>
    );
  };


  const allItems = [
    { id: 1, items: items },
    { id: 2, items: secondItems },
    { id: 3, items: thirdItems },
  ];

  return (
    <View style={styles(activeTheme).container}>

      <View style={styles(activeTheme).wrapper}>

        <DynamicImage market={market.to} style={{ marginRight: 10, width: 30, height: 30 }} />
        <View>

          <Text style={styles(activeTheme).bigTitle}>
            <Text>{info.Symbol}  </Text>
            {getLang(language, "STATISTICS")}
          </Text>
          <Text style={styles(activeTheme).txt}>
            {info.FullName}
          </Text>
        </View>


      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 60, minHeight: 500 }}
        showsVerticalScrollIndicator={false}
      >

        {
          allItems.map(theItem => (
            <Fragment key={theItem.id}>
              {/*<View style={{ marginTop: 16 }}>*/}
              {/*</View>*/}
              {
                theItem.items.map((item, index) => renderItem(item, index))
              }
            </Fragment>
          ))
        }


      </ScrollView>


    </View>

  );

};


export default InfoContent;

const styles = (props) => StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: DIMENSIONS.PADDING_V,
    paddingHorizontal: DIMENSIONS.PADDING_H,
  },
  wrapper: {
    paddingBottom: DIMENSIONS.PADDING_H,
    flexDirection: "row", alignItems: "center",
  },
  bigTitle: { fontFamily: "CircularStd-Bold", fontSize: 18, color: props.appWhite },
  txt: { fontFamily: "CircularStd-Book", fontSize: 16, color: props.secondaryText },
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    borderBottomColor: "rgba(255,255,255,.2)",
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
  contentWrapper: {
    // width: "100%",
    // paddingBottom:160
  },
  title: {
    width: "25%", textAlign: "left",
    fontFamily: "CircularStd-Book",
    fontSize: 13,
    color: "#707a81",
    paddingHorizontal: 6,
  },

  priceText: {
    fontFamily: "CircularStd-Book",
    fontSize: 13,
    color: "#ffffff",
  },

  section: {
    fontFamily: "CircularStd-Bold",
    fontSize: DIMENSIONS.BIG_TITLE_FONTSIZE,
    letterSpacing: 0.93,
    color: props.appWhite,
  },

  item: {
    flexDirection: "row",
    width: "100%",
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: props.borderGray,
    paddingVertical: 12,
    borderRadius: 1,
  },
  itemInner: {
    width: "50%",
    alignItems: "center",
    flexDirection: "row",
  },
  itemTitle: {
    textAlign: "left",
    color: props.secondaryText,
    marginRight: 6,
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    fontFamily: "CircularStd-Bold",
  },
  marker: {
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: props.actionColor,
    alignItems: "center",
    justifyContent: "center",
  },
  marketText: {
    fontFamily: "Helvetica",
    fontSize: DIMENSIONS.NORMAL_FONTSIZE - 1,
    color: "#fff",
  },
  itemRight: {
    width: "50%",
    justifyContent: "center",
  },
  price: {
    textAlign: "right",
    color: props.appWhite,
    fontSize: DIMENSIONS.NORMAL_FONTSIZE,
  },

});

