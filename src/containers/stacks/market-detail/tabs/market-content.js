import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { DIMENSIONS } from "../../../../../utils/dimensions";
import Loading from "../../../../components/page-components/loading";
import EmptyContainer from "../../../../components/page-components/empty-container";
import OrdersTabHeader from "./orders-tab-header";
import { useSelector } from "react-redux";
import { formatMoney } from "../../../../helpers/math-helper";
import { isIphoneX } from "../../../../../utils/devices";

const MAX_ITEM_COUNT = 25;
const bidArr = [];
const FULL_WIDTH = parseInt(DIMENSIONS.SCREEN_WIDTH / 2 - DIMENSIONS.PADDING_H);

const MarketContent = ({ bids1, asks1, market, toPrecision, fromPrecision, handleDetail }) => {

  const { activeUserColors, activeTheme } = useSelector(state => state.globalReducer);
  const [loading, setLoading] = useState(true);
  const [bids2, setBids2] = useState([]);
  const [asks2, setAsks2] = useState([]);

  useEffect(() => {
    handleSetData(bids1, asks1);
  }, [bids1]);

  useEffect(() => {
    return function cleanup() {
      handleResetOrderStates();
    };
  }, []);

  const handleResetOrderStates = () => {
    setLoading(false);
    setBids2([]);
    setAsks2([]);
  };

  const sortOrder = (items = [], isBid = true) => {
    if (isBid)
      return items.sort((a, b) => parseFloat(a.bov) > parseFloat(b.bov) ? -1 : parseFloat(a.bov) < parseFloat(b.bov) ? 1 : 0).slice(0, MAX_ITEM_COUNT);
    return items.sort((a, b) => parseFloat(a.bov) > parseFloat(b.bov) ? 1 : parseFloat(a.bov) < parseFloat(b.bov) ? -1 : 0).slice(0, MAX_ITEM_COUNT);
  };

  const handleSetData = (bid1, ask1) => {
    setBids2(bid1);
    setAsks2(ask1);
    setLoading(bid1.length <= 0);
    // if (bidsPer.length <= 0) {
    //   setBidsPer(bid1.map(bb => new Animated.Value(parseInt(bb["pc"]))));
    // setAsksPer(ask1.map(bb => new Animated.Value(parseInt(bb["pc"]))));
    // }
  };

  const awesomeChildListRenderItemAsk = ({ item, index }) => {
    const newVal = parseInt(FULL_WIDTH * parseInt(item.pc) / 100);

    return (
      <Pressable
        onPress={() => handleDetail(item, "ask")}
        style={styles(activeUserColors).rightItemContainer} key={item.toString()}>
        <View style={[styles(activeUserColors).askBg, {
          width: newVal,
        }]} />


        <View style={[styles(activeUserColors).itemWrapper]}>
          <Text numberOfLines={1}
                style={styles(activeUserColors).askPrice}>
            {
              // formattedNumber(item.ov, "", 4)
              formatMoney(item.ov, fromPrecision)

            }
          </Text>
        </View>

        <View style={{ justifyContent: "flex-end" }}>
          <Text numberOfLines={1}
                style={[styles(activeTheme).text, { textAlign: "right" }]}>
            {/*{*/}
            {/*  item.fa*/}
            {/*}*/}

            {
              // formattedNumber(item.fa, market.fa, toPrecision)
              formatMoney(item.fa, toPrecision)
            }
          </Text>
        </View>
      </Pressable>

    );
  };

  const awesomeChildListRenderItemBid = ({ item, index }) => {
    // const { market, activeUserColors, handleDetail, precision } = this.props;
    const newVal = parseInt(FULL_WIDTH * parseInt(item.pc) / 100);

    // Animated.timing(bidsPer[index], {
    //   toValue: newVal,
    //   duration: 200,
    //   // easing: Easing.ease,   // <-- or any easing function
    //   useNativeDriver: false,   // <-- need to set false to prevent yellow box warning
    // }).start();

    return (
      <Pressable
        ref={ref => bidArr[index] = ref}
        onPress={() => handleDetail(item, "bid")}
        style={styles(activeUserColors).rightItemContainer} key={item.toString()}>

        <View style={[styles(activeUserColors).bidBg, {
          width: newVal,
        }]} />
        <View style={{ justifyContent: "flex-end" }}>
          <Text numberOfLines={1} style={[styles(activeTheme).text]}>
            {
              // formattedNumber(item.fa, market.fs, toPrecision)
              formatMoney(item.fa, toPrecision)
            }
          </Text>
        </View>

        <View style={[styles(activeUserColors).itemWrapper]}>

          <Text numberOfLines={1}
                adjustsFontSizeToFit={true}
                style={[styles(activeUserColors).bidPrice, { textAlign: "right" }]}>
            {
              formatMoney(item.ov, fromPrecision)
            }
          </Text>
        </View>
      </Pressable>
    );
  };

  const awesomeChildListKeyExtractorBid = (item, i) => `awesome-bid-key-${i}`;

  const awesomeChildListKeyExtractorAsk = (item, i) => `awesome-ask-key-${i}`;


  return (
    <View style={styles(activeUserColors).wrapper}>

      <OrdersTabHeader toSym={market.fs} />

      <View style={styles(activeUserColors).contentWrapper}>

        <View style={{ width: "50%" }}>
          {
            loading ? <ActivityIndicator color={activeUserColors.bidText} /> :
              bids2.length >= 1 ?
                <FlatList
                  showsVerticalScrollIndicator={false}
                  renderItem={awesomeChildListRenderItemBid}
                  keyExtractor={awesomeChildListKeyExtractorBid}
                  data={bids2}
                  contentContainerStyle={styles(activeUserColors).flatList}
                  ListFooterComponent={bids2.length <= 0 && <Loading />}
                />
                :
                <EmptyContainer text={""} />
          }


        </View>

        <View style={{ width: "50%" }}>

          {
            loading ? <ActivityIndicator color={activeUserColors.bidText} /> :
              asks2.length >= 1 ?
                <FlatList
                  showsVerticalScrollIndicator={false}
                  renderItem={awesomeChildListRenderItemAsk}
                  keyExtractor={awesomeChildListKeyExtractorAsk}
                  contentContainerStyle={styles(activeUserColors).flatList}
                  ListFooterComponent={asks2.length <= 0 && <Loading />}
                  data={asks2}
                />
                :
                <EmptyContainer text={""} />
          }

        </View>

      </View>

    </View>

  );
};


export default React.memo(MarketContent);
const styles = (props) => StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingVertical: DIMENSIONS.PADDING_V,
    paddingHorizontal: DIMENSIONS.PADDING_H,
  },
  priceText: {
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
  },
  amountText: {
    fontFamily: "CircularStd-Book",
    fontSize: 13,
    textAlign: "center",
    color: "#00b257",
    flexShrink: 1,
  },
  redText: {
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    textAlign: "center",
    color: "#fd4850",
  },

  itemContainer: {
    width: "100%",
    flexDirection: "row",
    height: 30,
  },
  leftItemContainer: {
    width: "50%",
    // height: "100%",
    flexDirection: "row",
    height: 30,
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: 6,
    // paddingVertical: 5,
  },
  sideWrapper: {
    width: "50%",
  },
  rightItemContainer: {
    width: "100%",
    height: isIphoneX ? 30 : 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: .4,
  },

  itemWrapper: {
    height: "100%",
    minWidth: "50%",
    justifyContent: "center",
  },


  itemWrapper2: {
    height: "100%",
    minWidth: "50%",
    justifyContent: "center",
    alignItems: "flex-end",
  },

  askBg: {
    left: 0,
    position: "absolute",
    top: 0,
    height: "100%",
    backgroundColor: props.askBg,
  },

  bidBg: {
    right: 0,
    position: "absolute",
    top: 0,
    backgroundColor: props.bidBg,
    height: "100%",
  },
  askPrice: {
    color: props.askText,
    textAlign: "left",
    paddingLeft: 2,
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
  },
  bidPrice: {
    color: props.bidText,
    textAlign: "left",
    paddingRight: 2,
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
  },
  text: {
    color: props.appWhite,
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.NORMAL_FONTSIZE - 1,
  },
  flatList: {
    paddingBottom: 60,
    width: "100%",
  },
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    borderBottomColor: props.borderGray,
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
  contentWrapper: {
    // width: "100%",
    flexDirection: "row",
    flex: 1,
  },

});
