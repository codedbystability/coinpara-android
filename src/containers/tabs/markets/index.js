import * as React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import ListSort from "./sort";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { useDispatch, useSelector } from "react-redux";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import { LIST_ITEM_HEIGHT, NORMAL_FONTSIZE, PADDING_H } from "../../../../utils/dimensions";
import PureItem from "./item-pure";
import { getLang } from "../../../helpers/array-helper";
import AnimatedTab from "../../../components/animated-tab";
import { orderBy } from "lodash";
import LocalStorage from "../../../providers/LocalStorage";
import { useIsFocused } from "@react-navigation/native";
import CustomList from "../../../components/custom-list";
import TinyImage from "../../../tiny-image";
import Loading from "../../../components/loading";
import EditButton from "../../../components/edit-button";
import Swipeable from "react-native-swipeable";
import DropdownAlert from "../../../providers/DropdownAlert";
import marketServices from "../../../services/market-services";
import { setIsFavorite } from "../../../actions/market-actions";
import ModalProvider from "../../../providers/ModalProvider";
import { navigationRef } from "../../../providers/RootNavigation";
import MarketSelectDetail from "../../../components/market-select-detail";

let currentlyOpenSwipeable = null;
const itemToShow = 12;
const NORMAL_HEAD = [
  { id: 1, key: "ALL", title: "ALL" },
  {
    id: 3, key: "TRY", title: "TRY",
  },
  {
    id: 4, key: "USDT", title: "USDT",
  },
];
const AUTH_HEAD = [
  {
    id: 1,
    key: "ALL",
    title: "ALL",
  },
  {
    id: 2,
    key: "FAVORITE",
    title: "FAVORITE",
  },
  {
    id: 3,
    key: "TRY",
    title: "TRY",
  },
  {
    id: 4,
    key: "USDT",
    title: "USDT",
  },
];

const Market = (props) => {
  const { navigation } = props;
  const flatListRef = useRef(null);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const [sortType, setSortType] = useState("pr");
  const [all, setAll] = useState([]);
  const [sortDirection, setSortDirection] = useState("desc");
  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const { authenticated } = useSelector(state => state.authenticationReducer);
  const { marketsWithKey, marketCount, coinList } = useSelector(state => state.marketReducer);
  const [allAvailable, setAllAvailable] = useState([]);
  // const [searchText, setSearchText] = useState("");
  // const [showTypes, setShowTypes] = useState(true);
  const [headers, setHeaders] = useState([]);
  const [activeType, setActiveType] = useState("TRY");
  const [showData, setShowData] = useState([]);
  // const [localMarkets, setLocalMarkets] = useState([]);
  const [page, setPage] = useState(1);
  const [moreLoading, setMoreLoading] = useState(false);
  const [favSorted, setFavSorted] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [loadings, setLoadings] = useState([]);

  useEffect(() => {
    const myData = allAvailable;
    const listedData = sortType !== "" ? orderBy(myData, [sortType], [sortDirection]) : myData;
    setShowData(listedData.slice(0, itemToShow * page));
  }, [allAvailable, page, sortType, sortDirection]);


  useEffect(() => {
    setAll(Object.values(marketsWithKey));
  }, [marketCount]);


  useEffect(() => {
    if (isFocused) {
      if (showLoading) {
        setTimeout(() => {
          setShowLoading(false);
        }, 500);
      }
      if (activeType === "TRY" || activeType === "USDT") {
        const dd = all.filter(itm => itm.fs === activeType);
        setAllAvailable(dd);
      } else if (activeType === "FAVORITE") {
        handleRefresh();
      } else {
        setAllAvailable(all);
      }

    }
  }, [activeType, all]);

  useEffect(() => {
    flatListRef.current?.scrollTop();
    setPage(1);
  }, [activeType]);

  useEffect(() => {
    setHeaders(authenticated ? AUTH_HEAD : NORMAL_HEAD);
  }, [authenticated]);

  // useEffect(() => {
  //   if (isFocused) {
  //     let locals = LocalStorage.getArray("marketsLocal");
  //
  //     if (locals && locals.length >= 1) {
  //       locals = locals.map(item => {
  //         item.value = item.to;
  //         item.id = item.gd;
  //         return item;
  //       });
  //     } else {
  //
  //
  //       let allCoins;
  //
  //       if (coinList.length >= 1) {
  //         allCoins = coinList.filter(itm => itm.isTrending === true && itm.Code !== "TRY");
  //       } else {
  //         marketServices.getListCoins(false).then((response) => {
  //           if (response && response.IsSuccess) {
  //             allCoins = response.Data.filter(itm => itm.isTrending === true && itm.Code !== "TRY");
  //           }
  //         });
  //       }
  //       const slicedTrendings = allCoins.slice(0, 5);
  //
  //       locals = slicedTrendings.map(item => {
  //         item.value = item.Code;
  //         item.id = item.CoinGuid;
  //         return item;
  //       });
  //     }
  //     setLocalMarkets(locals);
  //   }
  // }, [isFocused]);

  useEffect(() => {
    return navigation.addListener("tabPress", (e) => flatListRef.current?.scrollTop());
  }, [navigation]);

  // const onDeleteLocal = () => {
  //   LocalStorage.removeItem("marketsLocal");
  //   setLocalMarkets([]);
  // };

  const handleRefresh = () => {
    const FavSort = LocalStorage.getObject("FavSort");
    const dd = all.filter(itm => itm.if === true);
    if ((sortType === "" || !favSorted) && FavSort && FavSort.length >= 1) {
      const firstFiltered = [];
      const matched = dd.filter(item => FavSort.includes(item.gd));
      for (const marketItemGD of FavSort) {
        const foundItem = matched.find(filtered => filtered.gd === marketItemGD);
        if (foundItem) {
          firstFiltered.push(foundItem);
        }
      }
      const nonMatched = dd.filter(item => !FavSort.includes(item.gd));
      setAllAvailable([...firstFiltered, ...nonMatched]);
      setFavSorted(true);
      setSortType("");
    } else {
      setAllAvailable(dd);
    }
  };


  // const onFocus = () => setShowTypes(false);

  // const onBlur = () => setShowTypes(true);

  const onEndReached = () => {
    if (allAvailable.length <= showData.length) {
      setMoreLoading(false);
      return;
    }
    setMoreLoading(true);
    setTimeout(() => {
      setPage(page + 1);
      setMoreLoading(false);
    }, 1500);
  };


  const onOpen = (event, gestureState, swipeable) => {
    if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
      currentlyOpenSwipeable.recenter();
    }
    currentlyOpenSwipeable = swipeable;
  };
  const onClose = () => currentlyOpenSwipeable = null;

  const [scrollEnabled, handleScroll] = useState(true);

  const handleFav = (item, index) => {
    // const { authenticated, item, language, dispatch } = this.props;

    if (!authenticated) {
      return DropdownAlert.show("error", getLang(language, "ERROR"), getLang(language, "PLEASE_SIGNIN_OR_CREATE_ACCOUNT"));
    }
    setLoadings([...loadings, index]);


    if (item.if) {
      setTimeout(() => {
        setLoadings(loadings.filter(itm => itm !== index));
        marketServices.removeFavorite({ MarketGuid: item.gd }).then((response) => {
          if (response && response.IsSuccess) {
            dispatch(setIsFavorite(false, item.gd));
          }
        });
      }, 500);
    } else {
      marketServices.addFavorite({ MarketGuid: item.gd }).then((response) => {
        if (response && response.IsSuccess) {
          dispatch(setIsFavorite(true, item.gd));
          setTimeout(() => {
            setLoadings(loadings.filter(itm => itm !== index));
          }, 500);
        }
      });
    }


  };

  const handleCoinSelected = (market) => {
    ModalProvider.hide();
    navigationRef.current.navigate("MarketDetail", { ...market });
  };

  const handleMarketSelect = () => {
    ModalProvider.show(() => <MarketSelectDetail
      shouldFocus={true}
      handleSelect={handleCoinSelected} />, true);
  };


  // if-gd-to-fs-in-vd-pr-fdp-tdp-cd-cp
  const marketItem = ({ item, index }) => <Swipeable
    onSwipeStart={() => handleScroll(false)}
    onSwipeRelease={() => handleScroll(true)}
    rightButtonWidth={60}
    rightButtons={[
      <TouchableOpacity
        onPress={() => handleFav(item, index)}
        style={styles(activeTheme).rR}>
        {
          loadings.includes(index) ?
            <ActivityIndicator style={styles(activeTheme).icon} color={activeTheme.appWhite} /> :
            <TinyImage parent={"rest/"} name={item.if ? "fav-active" : "fav"} style={styles(activeTheme).icon} />
        }
      </TouchableOpacity>,
    ]}
    onRightButtonsOpenRelease={onOpen}
    onRightButtonsCloseRelease={onClose}
  >
    <PureItem
      {
        ...{
          item,
          activeType,
          // searchText,
          index,
        }
      }

    />
  </Swipeable>;

  const keyExtractor = useCallback((item) => `$market-${item.gd}`, []);

  return (
    <>
      <TabNavigationHeader {...props}
                           backAble={true}
                           isBack={false}
                           options={{ title: getLang(language, "MARKETS") }} />

      <View style={styles(activeTheme).wrapper}>


        <View style={styles(activeTheme).searchContainer2}>
          <AnimatedTab {...{
            activeKey: activeType,
            headers: headers,
            width: headers.length === 4 ? "25%" : "33%",
            filled: false,
            onChange: item => setActiveType(item.key),
          }} />

        </View>

        <View style={{ paddingHorizontal: PADDING_H }}>
          {/*<View style={styles(activeTheme).searchContainer}>*/}
          {/*  <View style={styles(activeTheme).searchIcon}>*/}
          {/*    <TinyImage parent={"rest/"} name={"search"} style={styles(activeTheme).icon} />*/}
          {/*  </View>*/}

          {/*<TextInput*/}
          {/*  keyboardAppearance={"dark"}*/}
          {/*  style={styles(activeTheme).input}*/}
          {/*  value={searchText}*/}
          {/*  onChangeText={(text) => (setSearchText(text.toUpperCase()))}*/}
          {/*  placeholder={getLang(language, "SEARCH")}*/}
          {/*  autoFocus={false}*/}
          {/*  autoCorrect={false}*/}
          {/*  autoComplete={"off"}*/}
          {/*  autoCapitalize={"characters"}*/}
          {/*  keyboardType={"email-address"}*/}
          {/*  placeholderTextColor={activeTheme.secondaryText}*/}
          {/*/>*/}


          <Pressable
            onPress={handleMarketSelect}
            style={styles(activeTheme).inputV}>
            <View style={styles(activeTheme).searchIcon}>
              <TinyImage parent={"rest/"} name={"search"} style={styles(activeTheme).icon2} />
            </View>
            <Text style={styles(activeTheme).txt}>
              {getLang(language, "SEARCH")}
            </Text>
          </Pressable>


          {/*{*/}
          {/*  searchText ?*/}
          {/*    <Pressable onPress={() => setSearchText("")}>*/}
          {/*      <View style={styles(activeTheme).searchIcon}>*/}
          {/*        <TinyImage parent={"rest/"} name={"dismiss"} style={styles(activeTheme).icon2} />*/}
          {/*      </View>*/}
          {/*    </Pressable> : null*/}
          {/*}*/}

          {/*</View>*/}
        </View>

        <>
          <ListSort
            {...{
              sortType,
              setSortType,
              sortDirection,
              setSortDirection,
            }}
          />


          {
            showLoading ? <Loading /> : <CustomList
              scrollEnabled={currentlyOpenSwipeable === null}
              borderGray={activeTheme.borderGray}
              hH={1}
              ref={flatListRef}
              iconKey={"fav-empty"}
              data={showData}
              showFooter={moreLoading}
              keyExtractor={keyExtractor}
              itemHeight={LIST_ITEM_HEIGHT}
              renderItem={marketItem}
              onEndReached={onEndReached}
              emptyMessage={getLang(language, activeType === "FAVORITE" ? "NO_FAV_FOUND" : "NO_MARKET_FOUND")}
            />
          }


        </>

      </View>


      {
        activeType === "FAVORITE" && <EditButton
          onPress={() => navigation.navigate("FavSort", {
            handleRefresh,
          })}
        />
      }

    </>

  );
};

const MarketsScreen = styledHigherOrderComponents(Market);

export default MarketsScreen;

const styles = props => StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  searchContainer2: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: PADDING_H,
    paddingVertical: PADDING_H,
  },
  passiveText: {
    color: "rgb(112,122,129)",
    letterSpacing: 0,
    fontFamily: "CircularStd-Book",
  },
  butt: {
    height: 40,
    width: 40,
    borderRadius: 20,
    position: "absolute",
    right: PADDING_H * 2,
    bottom: PADDING_H * 2,
    alignItems: "center",
    justifyContent: "center",
    padding: PADDING_H,
    backgroundColor: props.darkBackground,
    borderWidth: 1,
    borderColor: props.appWhite,
  },
  icn: {
    width: 16,
    height: 16,
  },
  searchContainer: {
    height: 40,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: props.darkBackground,
    marginBottom: 10,
  },
  input: {
    height: "100%",
    backgroundColor: props.darkBackground,
    borderRadius: 8,
    paddingHorizontal: 0,
    paddingVertical: 8,
    flex: 1,
    color: "#8a96a6",
    alignSelf: "stretch",
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
  },
  inputV: {
    height: 36,
    backgroundColor: props.darkBackground,
    borderRadius: 8,
    paddingHorizontal: PADDING_H / 2,
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
  },

  searchIcon: { paddingHorizontal: 10 },
  txt: {
    fontFamily: "CircularStd-Book",
    fontSize: NORMAL_FONTSIZE,
    color: props.appWhite,
  },
  dismissButtonContainer: {
    // padding: 5,
    position: "absolute",
    right: 5,
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  icon: {
    width: 18,
    height: 18,
  },
  icon2: {
    width: 14,
    height: 14,
  },
  rR: {
    justifyContent: "center",
    height: LIST_ITEM_HEIGHT,
    paddingLeft: 20,
    backgroundColor: "transparent",
  },
});
