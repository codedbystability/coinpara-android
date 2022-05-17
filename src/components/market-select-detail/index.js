import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import NativeInput from "../native-input";
import DynamicImage from "../dynamic-image";
import {
  BIG_TITLE_FONTSIZE, LIST_ITEM_HEIGHT, LIST_MARGIN_T,
  MARGIN_T,
  NORMAL_IMAGE,
  PADDING_BH,
  PADDING_H,
  TITLE_FONTSIZE,
} from "../../../utils/dimensions";
import { useSelector } from "react-redux";
import { getLang } from "../../helpers/array-helper";
import marketServices from "../../services/market-services";
import EmptyContainer from "../empty-container";
import AnimatedTab from "../../components/animated-tab";

const NORMAL_HEAD = [
  {
    id: 3, key: "TRY", title: "TRY",
  },
  {
    id: 4, key: "USDT", title: "USDT",
  },
];
const AUTH_HEAD = [

  {
    id: 3,
    key: "TRY",
    title: "TRY",
  },
  {
    id: 2,
    key: "FAVORITE",
    title: "FAVORITE",
  },
  {
    id: 4,
    key: "USDT",
    title: "USDT",
  },
];

const MarketSelectDetail = (props) => {
  const {
    handleSelect,
    shouldFocus = false,
  } = props;

  const [coinList, setCoinList] = useState([]);
  const { activeTheme, language, marketDetailList } = useSelector(state => state.globalReducer);
  const { authenticated } = useSelector(state => state.authenticationReducer);
  const { initialMarkets } = useSelector(state => state.marketReducer);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("TRY");
  const [headers, setHeaders] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (shouldFocus) {

    }
  }, [shouldFocus]);

  useEffect(() => {
    setHeaders(authenticated ? AUTH_HEAD : NORMAL_HEAD);
    if (authenticated) {
      const favs = initialMarkets.filter(market => market.if === true).map(a => a.gd);
      setFavorites(favs);
    }
  }, [authenticated]);

  useEffect(() => {
    setSearchText("");
    if (marketDetailList.length <= 0) {
      marketServices.getCoins(false).then((response) => {
        if (response && response.IsSuccess) {
          setCoinList(response.Data);
        }
      });
    } else {
      setCoinList(marketDetailList);
    }
  }, [marketDetailList]);

  useEffect(() => {
    setCoins(coinList);
    setLoading(false);
  }, [coinList]);


  useEffect(() => {
    let typeCoins;

    if (activeType === "TRY" || activeType === "USDT") {
      typeCoins = coins.filter(coin => coin.fs === activeType);
    } else {
      typeCoins = coins.filter(item => favorites.includes(item.gd));
    }

    if (searchText) {
      setFilteredData(searchText ? typeCoins.filter(item => item.fs.toLowerCase().includes(searchText.toLowerCase()) || item.to.toLowerCase().includes(searchText.toLowerCase())) : typeCoins);
    } else {
      setFilteredData(typeCoins);
    }
  }, [coins, searchText, activeType]);

  const awesomeChildListRenderItem = ({ item }) => {
    return (
      <Pressable
        onPress={() => handleSelect(item)}
        style={styles(activeTheme).item}>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
        }}>

          <DynamicImage market={item.to} style={styles(activeTheme).image} />

          <View style={{ width: "60%" }}>
            <Text style={[styles(activeTheme).title]}>{item.to}</Text>
            <Text style={[styles(activeTheme).text]}>{item.sk}</Text>
          </View>

        </View>

      </Pressable>
    );
  };


  return (

    <>
      <View style={styles(activeTheme).wrapper}>

        <View style={styles(activeTheme).innerWrapper}>


          <AnimatedTab {...{
            activeKey: activeType,
            headers: headers,
            width: parseInt(100 / headers.length),
            filled: true,
            onChange: item => setActiveType(item.key),
          }} />

          <View style={{
            width: "100%",
            height: PADDING_H,
          }} />

          <NativeInput {...{
            autoFocus: shouldFocus,
            autoCapitalize: "characters",
            searchText,
            setSearchText,
            placeholder: getLang(language, "SEARCH"),
          }} />

        </View>


        {
          loading ? <ActivityIndicator style={styles(activeTheme).loading} /> : coins && coins.length >= 1 ?
            <View style={styles(activeTheme).container}>
              <View
                style={{
                  flex: 1,
                  marginVertical: MARGIN_T,
                }}>

                <Text style={[styles(activeTheme).title, {
                  paddingVertical: PADDING_H,
                }]}>
                  {getLang(language, "SEARCH_RESULTS")}
                </Text>

                <FlatList
                  contentContainerStyle={{
                    paddingBottom: 120,
                  }}
                  keyboardShouldPersistTaps={"handled"}
                  showsVerticalScrollIndicator={false}
                  data={filteredData}
                  renderItem={awesomeChildListRenderItem}
                  keyExtractor={(item, i) => i.toString()}
                />
              </View>
            </View>
            : <EmptyContainer text={getLang(language, "NO_DATA_FOUND")} />
        }
      </View>

    </>
  );
};

export default React.memo(MarketSelectDetail);

const styles = (props) => StyleSheet.create({
  wrapper: {
    backgroundColor: props.backgroundApp,
    flex: 1,
    paddingTop: PADDING_BH,
    paddingHorizontal: PADDING_BH,
  },
  container: {
    flex: 1,
    backgroundColor: props.backgroundApp,
  },
  item: {
    borderColor: props.borderGray,
    borderBottomWidth: .3,
    borderRadius: 12,
    // paddingHorizontal: 20,
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: TITLE_FONTSIZE,
    fontFamily: "CircularStd-Bold",
    color: props.appWhite,
  },

  titleS: {
    fontSize: TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
    color: props.appWhite,
  },
  line: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    textDecorationColor: props.noRed,
  },
  text: {
    fontSize: TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
    color: props.secondaryText,
  },
  mainT: {
    fontSize: TITLE_FONTSIZE - 2,
    fontFamily: "CircularStd-Book",
    color: props.secondaryText,
  },
  typeText: {
    fontFamily: "CircularStd-Bold",
    fontSize: BIG_TITLE_FONTSIZE,
    color: props.appWhite,
    textAlign: "center",
    marginBottom: LIST_MARGIN_T,
  },
  innerWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: "10%",
    height: LIST_ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: NORMAL_IMAGE,
    width: NORMAL_IMAGE,
    marginRight: 16,
  },
  scrollView: {
    flexDirection: "row",
    marginTop: 8,
  },
  smallItem: {
    borderWidth: .8,
    borderColor: props.borderGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  main: {
    color: props.appWhite,
  },
  icon: {
    width: 16,
    height: 16,
  },
});
