import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NORMAL_FONTSIZE, TITLE_FONTSIZE } from "../../../../utils/dimensions";
import { formatMoney } from "../../../helpers/math-helper";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import moment from "moment";
import { navigationRef } from "../../../providers/RootNavigation";

const OrderItem = ({ item, cancelAble, handleCancel = null }) => {
  // TODO width + type / 0-1
  const { activeTheme, fontSizes, language } = useSelector(state => state.globalReducer);
  const itemWidth = parseInt((item.fa * 100) / item.am);

  const handleNavigation = () => {
    navigationRef.current.navigate("OrderDetail", {
      order: item,
    });
  };
  return (
    <Pressable
      onPress={handleNavigation}
      key={item.ts}
      style={styles(activeTheme).container}>

      <View style={styles(activeTheme).wrapper}>
        <View style={styles(activeTheme).inner}>

          <View style={styles(activeTheme).inner2}>
            <View style={styles(activeTheme).content}>
              <Text style={[styles(activeTheme, fontSizes).title, { width: "30%" }]}>{item.cf}/{item.ct}</Text>
              <Text style={[styles(activeTheme, fontSizes).priceTitle, { width: "30%" }]}>
                <Text style={styles(activeTheme, fontSizes).description}>{getLang(language, "PRICE")}: </Text>
                {formatMoney(item.ov, item.fdp)}
              </Text>
              <Text style={[styles(activeTheme, fontSizes).description, {
                width: "35%",
                textAlign: "right",
              }]}>{
                moment.utc(item.ts).format("YYYY-MM-DD HH:mm:ss")

              }</Text>

            </View>

            <View style={{
              flexDirection: "row",
            }}>
              <Text style={[styles(activeTheme, fontSizes).priceTitle]}>
                <Text style={styles(activeTheme, fontSizes).description}>{getLang(language, "AMOUNT")}: </Text>
                {/*{item.fa}*/}
                {formatMoney(item.fa, item.tdp)}
              </Text>
              <Text style={styles(activeTheme, fontSizes).description}>
                <Text style={styles(activeTheme, fontSizes).description}> / </Text>
                {formatMoney(item.am, item.tdp)}
              </Text>
            </View>
          </View>

        </View>

        <View style={{ width: "100%", marginTop: 5 }}>

          <View style={styles(activeTheme).limitWrap}>


            <Text
              style={[styles(activeTheme, fontSizes).positive, { color: item.di === 1 ? activeTheme.changeGreen : activeTheme.changeRed }]}>
              {
                item.ty === 1 ? getLang(language, "MARKET_ORDER") :
                  getLang(language, item.di === 1 ? "BUY_LIMIT" : "SELL_LIMIT")
              }

              {
                item.ty !== 1 && <Text>
                  %{itemWidth}
                </Text>
              }

            </Text>

            <View style={{
              alignItems: "center",
              justifyContent: "center",
            }}>
              {
                cancelAble && <Pressable onPress={() => handleCancel(item)} style={styles(activeTheme).cancelContainer}>
                  <Text style={styles(activeTheme, fontSizes).cancelTitle}>
                    {getLang(language, "CANCEL")}
                  </Text>
                </Pressable>

              }
            </View>
          </View>


          <View style={styles(activeTheme).bg}>
            <View style={[styles(activeTheme).redColor, {
              width: `${itemWidth}%`,
              backgroundColor: item.di === 1 ? activeTheme.changeGreen : activeTheme.changeRed,
            }]} />
          </View>
        </View>

      </View>

    </Pressable>


  );
};

export const MemoizedOrderItem = React.memo(OrderItem);


const styles = (props, fontSizes) => StyleSheet.create({

  container: {
    width: "100%",
    height: 100,
    flexDirection: "row",
    // paddingHorizontal: 20,
    // borderBottomWidth: 1,
    // backgroundColor:'red',
    marginVertical: 5,
  },
  wrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inner2: {
    // alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  content: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  title: {
    color: props.appWhite,
    fontSize: fontSizes?.TITLE_FONTSIZE,
    fontFamily: "CircularStd-Bold",
  },
  priceTitle: {
    color: props.appWhite,
    fontSize: fontSizes?.NORMAL_FONTSIZE,
    fontFamily: "CircularStd-Book",
  },
  cancelTitle: {
    color: props.appWhite,
    fontSize: fontSizes?.NORMAL_FONTSIZE,
    fontFamily: "CircularStd-Book",
  },
  description: {
    color: props.secondaryText,
    fontSize: fontSizes?.NORMAL_FONTSIZE,
    fontFamily: "CircularStd-Book",
  },
  middleWrapper: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    width: "35%",
  },
  rightWrapper: {
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    // backgroundColor: "red",
    width: "40%",
  },

  negative: {
    color: props.changeRed, //   for red
    fontSize: fontSizes?.TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",

  },
  positive: {
    fontSize: fontSizes?.TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
  },

  redColor: {
    height: "100%",
    borderRadius: 5,
  },
  greenColor: {
    height: "100%",
    borderRadius: 5,
  },
  cancelContainer: {
    position: "absolute",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderColor: props.secondaryText,
    borderWidth: 1,
    borderRadius: 10,
    right: 0,
    bottom: 0,
  },
  bg: {
    backgroundColor: props.borderGray,
    width: "100%",
    height: 6,
    borderRadius: 5,
    marginTop: 5,
  },
  limitWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
