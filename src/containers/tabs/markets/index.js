import * as React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import ListSort from "./sort";
import SearchInput from "../../../components/search-input";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { useSelector } from "react-redux";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import { LIST_ITEM_HEIGHT, PADDING_H } from "../../../../utils/dimensions";
import PureItem from "./item-pure";
import { getLang } from "../../../helpers/array-helper";
import AnimatedTab from "../../../components/animated-tab";
import { orderBy } from "lodash";
import InputAccessory from "../../../components/input-accessory";
import LocalStorage from "../../../providers/LocalStorage";
import { useIsFocused } from "@react-navigation/native";
import CustomList from "../../../components/custom-list";
import TinyImage from "../../../tiny-image";
import Loading from "../../../components/loading";

const itemToShow = 14;
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
  const listRef = useRef(null);

  const isFocused = useIsFocused();

  const [sortType, setSortType] = useState("pr");
  const [all, setAll] = useState([]);
  const [sortDirection, setSortDirection] = useState("desc");
  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const { authenticated } = useSelector(state => state.authenticationReducer);
  const { marketsWithKey, marketCount } = useSelector(state => state.marketReducer);
  const [allAvailable, setAllAvailable] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showTypes, setShowTypes] = useState(true);
  const [headers, setHeaders] = useState([]);
  const [activeType, setActiveType] = useState("TRY");
  const [showData, setShowData] = useState([]);
  const [localMarkets, setLocalMarkets] = useState([]);
  const [page, setPage] = useState(1);
  const [moreLoading, setMoreLoading] = useState(false);
  const [favSorted, setFavSorted] = useState(false);

  useEffect(() => {
    const myData = searchText ? allAvailable.filter(market => market.to.toUpperCase().includes(searchText)) : allAvailable;
    const listedData = sortType !== "" ? orderBy(myData, [sortType], [sortDirection]) : myData;

    // setData(listedData);
    setShowData(listedData.slice(0, itemToShow * page));
  }, [allAvailable, page, searchText, sortType, sortDirection]);

  // useEffect(() => {
  //   if (sortType && activeType === "FAVORITE") {
  //     setFavSorted(false);
  //   }
  // }, [sortType, sortDirection]);

  const [showLoading, setShowLoading] = useState(true);


  useEffect(() => {
    setAll(Object.values(marketsWithKey));
  }, [marketCount]);

  useEffect(() => {
    if (isFocused) {
      setShowLoading(true);
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

      setShowLoading(false);

    }
  }, [activeType, all]);

  useEffect(() => {
    setHeaders(authenticated ? AUTH_HEAD : NORMAL_HEAD);
  }, [authenticated]);

  useEffect(() => {
    if (isFocused) {
      let locals = LocalStorage.getArray("marketsLocal");
      locals = locals.map(item => {
        item.value = item.to;
        item.id = item.gd;
        return item;
      });
      setLocalMarkets(locals);
    }
  }, [isFocused]);

  useEffect(() => {
    return navigation.addListener("tabPress", (e) => listRef.current?.scrollToOffset({ animated: true, offset: 0 }));
  }, [navigation]);

  const onDeleteLocal = () => {
    LocalStorage.removeItem("marketsLocal");
    setLocalMarkets([]);
  };

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


  const onFocus = () => setShowTypes(false);

  const onBlur = () => setShowTypes(true);

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

  // if-gd-to-fs-in-vd-pr-fdp-tdp-cd-cp
  const marketItem = ({ item, index }) => <PureItem
    {
      ...{
        item,
        activeType,
        searchText,
        index,
      }
    }

  />;

  const keyExtractor = useCallback((item) => `$market-${item.gd}`, []);

  return (
    <>
      <TabNavigationHeader {...props} backAble={false} options={{ title: getLang(language, "MARKETS") }} />

      <View style={styles(activeTheme).wrapper}>

          <View style={styles(activeTheme).searchContainer}>
            {
              showTypes && <View style={{ width: "90%" }}>
                <AnimatedTab {...{
                  activeKey: activeType,
                  headers: headers,
                  width: headers.length === 4 ? "25%" : "33%",
                  filled: false,
                  onChange: item => setActiveType(item.key),
                }} />

              </View>
            }
            <SearchInput text={searchText} onBlur={onBlur} showTypes={showTypes}
                         onFocus={onFocus} onChange={setSearchText} />

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
              iconKey={"fav-empty"}
              data={showData}
              showFooter={moreLoading && !searchText}
              keyExtractor={keyExtractor}
              itemHeight={LIST_ITEM_HEIGHT}
              renderItem={marketItem}
              onEndReached={onEndReached}
              emptyMessage={getLang(language, activeType === "FAVORITE" ? "NO_FAV_FOUND" : "NO_MARKET_FOUND")}
            />
          }


        </>


        <InputAccessory
          tabBarShown={true}
          handleStep={null}
          isAddition={false}
          mailProviders={localMarkets}
          onPress={item => setSearchText(item)}
          onDelete={onDeleteLocal}
        />
      </View>


      {
        activeType === "FAVORITE" && <TouchableOpacity
          onPress={() => navigation.navigate("FavSort", {
            handleRefresh: handleRefresh,
          })}
          activeOpacity={.8}
          style={styles(activeTheme).butt}>

          <TinyImage parent={"rest/"} name={"fav-edit"} style={styles(activeTheme).icn} />


        </TouchableOpacity>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  passiveText: {
    color: "rgb(112,122,129)",
    letterSpacing: 0,
    fontFamily: "CircularStd-Medium",
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
});
