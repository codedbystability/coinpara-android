import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList, Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import NativeInput from "../native-input";
import DynamicImage from "../dynamic-image";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import LocalStorage from "../../../providers/LocalStorage";
import marketServices from "../../../services/market-services";
import { tradeTypes } from "./constants";
import ModalProvider from "../../../providers/ModalProvider";
import AnimatedTab from "../animated-tab";
import EmptyContainer from "../empty-container";
import DropdownAlert from "../../../providers/DropdownAlert";
import * as Animatable from "react-native-animatable";
import InputAccessory from "../input-accessory";
import TinyImage from "../../../tiny-image";


const MarketSelect = (props) => {
  const {
    handleSelect,
    initialActiveType,
    isTrending = true,
    isBoth = true,
    ifFilter = true,
    type = null,//deposit-withdraw
    shouldCheck = false,
    isAll = false,
  } = props;


  const [aCoinList, setCoinList] = useState([]);
  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const { coinList } = useSelector(state => state.marketReducer);
  const [history, setHistory] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("crypto");
  const [activeTransactionType, setActiveTransactionType] = useState("");

  useEffect(() => {
    if (initialActiveType) {
      setActiveType(initialActiveType);
    }
  }, [initialActiveType]);

  useEffect(() => {
    if (type) {
      setActiveTransactionType(type);
    }
  }, [type]);


  useEffect(() => {
    setSearchText("");
    checkForStores().then(r => null);


    if (coinList.length >= 1) {
      setCoinList(coinList.filter(itm => itm.code !== "TRY"));
    } else {
      marketServices.getListCoins(false).then((response) => {
        if (response && response.IsSuccess) {
          setCoinList(response.Data);
        }
      });
    }
  }, [coinList]);

  useEffect(() => {
    if (activeType === "crypto") {
      setCoins(aCoinList.filter(coin => coin.Code !== "TRY"));
      // setCoins(aCoinList);
      setLoading(false);
    } else {
      setCoins(aCoinList.filter(coin => ["TRY", "USD", "EUR", "GBP"].includes(coin.Code)));
      setLoading(false);
    }
  }, [activeType, aCoinList]);

  useEffect(() => {
    let myCoins = coins;
    if (isAll) {
      myCoins = [{
        id: 0,
        Code: "all",
        OriginalCode: "TRY",
        Name: "SHOW_ALL_WALLETS",

      }, ...coins];
    }

    setFilteredData(searchText ? myCoins.filter(item => item.Code.toLowerCase().includes(searchText.toLowerCase()) || item.Name.toLowerCase().includes(searchText.toLowerCase())) : myCoins);
  }, [searchText]);

  useEffect(() => {
    let myCoins = coins;
    if (isAll) {
      myCoins = [{
        id: 0,
        Code: "all",
        OriginalCode: "TRY",
        Name: "SHOW_ALL_WALLETS",

      }, ...coins];
    }
    setFilteredData(myCoins);
    setTrendingCoins(myCoins.filter(item => item.isTrending === true));
  }, [coins]);


  const handleTrendingSelect = (marketCode) => {
    const item = coins.find(item => item.Code.toLowerCase().includes(marketCode.Code.toLowerCase()));
    if (type === "deposit" && !item.AllowDeposit) {
      ModalProvider.hide();
      return DropdownAlert.show("error", getLang(language, "INFORMATION"), item.Code + " " + getLang(language, "IN_MAINTENANCE_DEPOSIT"));
    } else if (type === "withdraw" && !item.AllowWithDraw) {
      ModalProvider.hide();
      return DropdownAlert.show("error", getLang(language, "INFORMATION"), item.Code + " " + getLang(language, "IN_MAINTENANCE_DEPOSIT"));
    }
    if (item) {
      handleSelect(item, activeTransactionType);
    }
  };

  const handleHistorySelect = (market) => {

    const theItem = filteredData.find(localItem => localItem.Code === market.Code);
    if (type === "deposit" && !theItem.AllowDeposit) {
      ModalProvider.hide();
      return DropdownAlert.show("error", getLang(language, "INFORMATION"), theItem.Code + " " + getLang(language, "IN_MAINTENANCE_DEPOSIT"));
    } else if (type === "withdraw" && !theItem.AllowWithDraw) {
      ModalProvider.hide();
      return DropdownAlert.show("error", getLang(language, "INFORMATION"), theItem.Code + " " + getLang(language, "IN_MAINTENANCE_DEPOSIT"));
    }
    if (type === "deposit" && !theItem.AllowDeposit) {
      ModalProvider.hide();
      return DropdownAlert.show("error", getLang(language, "INFORMATION"), theItem.Code + " " + getLang(language, "IN_MAINTENANCE_DEPOSIT"));
    } else if (type === "withdraw" && !theItem.AllowWithDraw) {
      ModalProvider.hide();
      return DropdownAlert.show("error", getLang(language, "INFORMATION"), theItem.Code + " " + getLang(language, "IN_MAINTENANCE_DEPOSIT"));
    }

    if (theItem) {
      handleSelect(theItem, activeTransactionType);
    }
  };

  const handleItemSelect = (item) => {
    if (type === "deposit" && !item.AllowDeposit) {
      ModalProvider.hide();
      return DropdownAlert.show("error", getLang(language, "INFORMATION"), item.Code + " " + getLang(language, "IN_MAINTENANCE_DEPOSIT"));
    } else if (type === "withdraw" && !item.AllowWithDraw) {
      ModalProvider.hide();
      return DropdownAlert.show("error", getLang(language, "INFORMATION"), item.Code + " " + getLang(language, "IN_MAINTENANCE_DEPOSIT"));
    } else {
      if (searchText && searchText !== "") {
        handleLocalStorageForMarket(item);
      }

      if (type === "deposit" && !item.AllowDeposit) {
        ModalProvider.hide();
        return DropdownAlert.show("error", getLang(language, "INFORMATION"), item.Code + " " + getLang(language, "IN_MAINTENANCE_DEPOSIT"));
      } else if (type === "withdraw" && !item.AllowWithDraw) {
        ModalProvider.hide();
        return DropdownAlert.show("error", getLang(language, "INFORMATION"), item.Code + " " + getLang(language, "IN_MAINTENANCE_DEPOSIT"));
      }

      handleSelect(item, activeTransactionType);
    }
  };

  const handleLocalStorageForMarket = (item) => {

    const storedArray = LocalStorage.getArray("searchedMarkets");
    const exist = storedArray.find(localItem => localItem.Code === item.Code);
    if (!exist) {
      const validItem = [{
        Code: item.Code,
        Name: item.Name,
        CoinGuid: item.CoinGuid,
        AllowDeposit: item.AllowDeposit,
        AllowWithDraw: item.AllowWithDraw,
      }];
      const newArray = storedArray.concat(validItem); // [ 4, 3, 2, 1 ]
      LocalStorage.storeObject("searchedMarkets", newArray.slice(0, 10));
    }
  };

  const checkForStores = async (item) => {
    const storedArray = LocalStorage.getArray("searchedMarkets");
    setHistory(storedArray);
  };

  const handleDeleteHistory = () => {
    LocalStorage.removeItem("searchedMarkets");
    setHistory([]);
  };

  const awesomeChildListRenderItem = ({ item, index }) => {
    let maintenance = false;
    if (type === "deposit") {
      maintenance = shouldCheck && item.AllowDeposit !== true; // yatirim izin var
    } else if (type === "withdraw") {
      maintenance = shouldCheck && item.AllowWithDraw !== true; // cekim izin var
    }

    return (
      <View>
        <Pressable
          onPress={() => handleItemSelect(item)}
          style={styles(activeTheme).item}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            // width: "50%",
            marginRight: 12,
          }}>
            <DynamicImage market={item.OriginalCode} style={styles(activeTheme).image} />


            <View>
              <Text
                style={[styles(activeTheme).title, maintenance && styles(activeTheme).line]}>{item.Code === "all" ? getLang(language, "ALL") : item.Code}</Text>
              <Text
                style={[styles(activeTheme).text, maintenance && styles(activeTheme).line]}>{item.Name === "SHOW_ALL_WALLETS" ? getLang(language, "SHOW_ALL_WALLETS") : item.Name}</Text>
            </View>


            {
              maintenance && <View style={{
                // width: "60%",
                height: "40%",
                left: 0,
                top: 0,
                borderRadius: 4,
              }}>
                <View style={{
                  flexDirection: "row",
                }}>
                  <View style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: activeTheme.noRed,
                  }} />

                  <Text
                    style={[styles(activeTheme).mainT, { color: activeTheme.secondaryText }]}>{item.Code + " " + getLang(language, activeTransactionType === "deposit" ? "IN_MAINTENANCE_DEPOSIT" : "IN_MAINTENANCE_WITHDRAW")}</Text>
                </View>

                <View style={{
                  // paddingHorizontal: 8,
                  // paddingVertical: 4,
                  backgroundColor: "rgba(10,132,255,1)",
                  width: 80,
                  marginLeft: 6,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 16,
                }}>
                  <Text style={{
                    color: "#fff",
                    fontFamily: "CircularStd-Book",
                    fontSize: DIMENSIONS.NORMAL_FONTSIZE - 1,
                  }}>{getLang(language, "IN_MAINTENANCE")}</Text>


                </View>

              </View>
            }

          </View>


        </Pressable>
      </View>
    );
  };


  // const trendingCoins = coins.filter(item => item.isTrending === true);

  return (

    <>
      <View style={styles(activeTheme).wrapper}>
        <Text
          style={styles(activeTheme).typeText}>{activeTransactionType && getLang(language, activeTransactionType.toUpperCase())}</Text>

        <View style={styles(activeTheme).innerWrapper}>

          <NativeInput {...{
            autoCapitalize: "characters",
            searchText, setSearchText,
            placeholder: getLang(language, "SEARCH"),
          }} />

          {/* <Pressable onPress={() => ModalProvider.hide()} style={styles(activeTheme).iconWrapper}>
            <TinyImage parent={"rest/"} name={"cancel"} style={styles(activeTheme).icon} />
          </Pressable> */}
        </View>

        <View style={{ marginVertical: 12 }}>
          {
            activeType && ifFilter && isBoth &&
            <AnimatedTab {...{
              filled: false,
              activeKey: activeType,
              headers: tradeTypes,
              width: `50%`,
              onChange: (itm) => setActiveType(itm.key),
            }} />
          }
        </View>

        <Animatable.View animation={"fadeInRight"}>
          {
            isTrending && trendingCoins.length >= 1 && <View>
              <Text style={styles(activeTheme).title}>{getLang(language, "TRENDING")}</Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles(activeTheme).scrollView}>
                {
                  trendingCoins.map((item, i) => {
                    return (
                      <Pressable
                        onPress={() => handleTrendingSelect(item)}
                        key={`trending${i}`}
                        style={styles(activeTheme).smallItem}>
                        <Text style={styles(activeTheme).titleS}>{item.Code}</Text>
                      </Pressable>
                    );
                  })
                }
              </ScrollView>
            </View>
          }
        </Animatable.View>


        {
          activeType === "crypto" && history.length >= 1 &&
          <Animatable.View animation={"fadeInLeft"}>
            <View style={{ marginTop: DIMENSIONS.MARGIN_T }}>

              <View
                style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={styles(activeTheme).title}>{getLang(language, "HISTORY")}</Text>

                <Pressable onPress={handleDeleteHistory}>
                  <TinyImage parent={"rest/"} name={"trash"} style={styles(activeTheme).icon} />
                </Pressable>
              </View>

              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles(activeTheme).scrollView}>
                {
                  history.map((item, i) => {
                    return (
                      <Pressable
                        onPress={() => handleHistorySelect(item)}
                        key={`history${i}`}
                        style={styles(activeTheme).smallItem}>
                        <Text style={styles(activeTheme).titleS}>{item.Code}</Text>
                      </Pressable>
                    );
                  })
                }
              </ScrollView>
            </View>
          </Animatable.View>

        }

        {
          loading ?
            <ActivityIndicator style={styles(activeTheme).loading} /> : filteredData && filteredData.length >= 1 ?
              <Animatable.View style={styles(activeTheme).container}>
                <Animatable.View animation={"fadeInUp"}
                                 style={{
                                   flex: 1,
                                   marginVertical: DIMENSIONS.MARGIN_T,
                                 }}>

                  <Text style={[styles(activeTheme).title, {
                    paddingVertical: DIMENSIONS.PADDING_H,
                  }]}>
                    {getLang(language, "SEARCH_RESULTS")}
                  </Text>

                  <FlatList
                    contentContainerStyle={{
                      paddingBottom: 100,
                    }}
                    keyboardShouldPersistTaps={"handled"}
                    showsVerticalScrollIndicator={false}
                    data={filteredData}
                    renderItem={awesomeChildListRenderItem}
                    keyExtractor={(item, i) => i.toString()}
                  />
                </Animatable.View>
              </Animatable.View>
              : <View style={{ flex: 1, justifyContent: "center" }}>
                <EmptyContainer icon={"market-chart"} text={getLang(language, "NO_MARKET_FOUND")} />
              </View>
        }
      </View>


      <InputAccessory
        inputAccessoryViewID={"inputAccessoryViewIDNative"}
        mailProviders={[]}
        onPress={null}
      />
    </>
  );
};

export default React.memo(MarketSelect, (props, nextProps) => {
  if (props.type === nextProps.type) {
    // don't re-render/update
    return true;
  }
});


const styles = (props) => StyleSheet.create({
  wrapper: {
    backgroundColor: props.backgroundApp,
    flex: 1,
    paddingTop: DIMENSIONS.PADDING_BH,
    paddingHorizontal: DIMENSIONS.PADDING_BH,
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
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    fontFamily: "CircularStd-Bold",
    color: props.appWhite,
  },

  titleS: {
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
    color: props.appWhite,
  },
  line: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    textDecorationColor: props.noRed,
  },
  text: {
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
    color: props.secondaryText,
  },
  mainT: {
    fontSize: DIMENSIONS.NORMAL_FONTSIZE - 2,
    fontFamily: "CircularStd-Book",
    color: props.secondaryText,
  },
  typeText: {
    fontFamily: "CircularStd-Bold",
    fontSize: DIMENSIONS.BIG_TITLE_FONTSIZE,
    color: props.appWhite,
    textAlign: "center",
    marginBottom: DIMENSIONS.MARGIN_T,
  },
  innerWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  iconWrapper: {
    width: "10%",
    height: DIMENSIONS.LIST_ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: DIMENSIONS.NORMAL_IMAGE,
    width: DIMENSIONS.NORMAL_IMAGE,
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
    width: 18,
    height: 18,
  },
});
