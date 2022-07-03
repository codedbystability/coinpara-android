import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { DIMENSIONS } from "../../../../../../utils/dimensions";
import EmptyContainer from "../../../../../components/page-components/empty-container";
import moment from "moment";
import { formatMoney } from "../../../../../helpers/math-helper";
import { useSelector } from "react-redux";

const HistoryContent = ({ history, fdp, tdp }) => {

  const { activeTheme, activeUserColors } = useSelector(state => state.globalReducer);
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
            color: item.di === 1 ? activeUserColors.yesGreen : activeUserColors.noRed,
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
              // fontSize: DIMENSIONS.NORMAL_FONTSIZE - 1,
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
              paddingBottom: 60,
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
    fontSize: DIMENSIONS.TITLE_FONTSIZE - 1,
    color: props.appWhite,
    paddingHorizontal: 6,
  },

  priceText: {
    fontFamily: "CircularStd-Book",
    color: props.appWhite,
    fontSize: DIMENSIONS.NORMAL_FONTSIZE,
  },


});

