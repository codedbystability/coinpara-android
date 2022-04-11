import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { NORMAL_FONTSIZE, PADDING_H, PADDING_V, TITLE_FONTSIZE } from "../../../../../../utils/dimensions";
import EmptyContainer from "../../../../../components/empty-container";
import moment from "moment";
import { formatMoney, formattedNumber } from "../../../../../helpers/math-helper";
import { useSelector } from "react-redux";

const HistoryContent = ({ history, fdp, tdp }) => {

  const { activeTheme } = useSelector(state => state.globalReducer);
  const awesomeChildListRenderItem =
    ({ item }) => {

      return (
        <View
          style={{ flexDirection: "row", height: 30, width: "100%", backgroundColor: "transparent" }}>
          <Text
            numberOfLines={1}
            style={[styles(activeTheme).priceText, {
              textAlign: "left",
              width: "25%",
            }]}>{formatMoney(item.ov, fdp)}</Text>
          <Text style={[styles(activeTheme).priceText, {
            width: "25%",
            textAlign: "right",
            color: item.di === 1 ? activeTheme.yesGreen : activeTheme.noRed,
          }]}>{formatMoney(item.am, tdp)}</Text>
          <Text
            numberOfLines={1}
            style={[styles(activeTheme).priceText, {
              textAlign: "right",
              width: "25%",
            }]}>{formatMoney(item.gt, fdp)}</Text>
          <Text
            style={[styles(activeTheme).priceText, {
              textAlign: "right",
              width: "25%",
              // fontSize: NORMAL_FONTSIZE - 1,
              color: activeTheme.secondaryText,
            }]}>{
            // moment(stillUtc).local().format("HH:mm:ss")
            moment.utc(item.ts).format("HH:mm:ss")

          }</Text>
        </View>
      );
    };

  const awesomeChildListKeyExtractor = (item, i) => `history-item-${i}`;


  // const { history } = this.props;

  // console.log(history.length);
  return (
    <View style={{ flex: 1 }}>
      {
        history.length >= 1 ?
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              backgroundColor: "transparent",
              paddingBottom: PADDING_V * 2,
            }}
            renderItem={awesomeChildListRenderItem}
            keyExtractor={awesomeChildListKeyExtractor}
            data={history}
          />
          : <EmptyContainer text={""} />
      }
    </View>
  );


};


export default HistoryContent;

const styles = (props) => StyleSheet.create({
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    borderBottomColor: props.borderGray,
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
  contentWrapper: {},
  title: {
    width: "25%", textAlign: "left",
    fontFamily: "CircularStd-Bold",
    fontSize: TITLE_FONTSIZE - 1,
    color: props.appWhite,
    paddingHorizontal: 6,
  },

  priceText: {
    fontFamily: "CircularStd-Book",
    color: props.appWhite,
    fontSize: NORMAL_FONTSIZE,
  },


});

