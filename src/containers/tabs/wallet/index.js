import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, Pressable, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import NeedAuthentication from "../../../components/page-components/need-authentication";
import WalletHeader from "./wallet-header";
import WalletActionTab from "./action-tab";
import MarketSelect from "../../../components/page-components/market-select";
import styles from "./styles";
import WalletListHeader from "./list-header";
import { navigationRef } from "../../../providers/RootNavigation";
import WalletTotal from "../../../components/page-components/wallet-total";
import ModalProvider from "../../../providers/ModalProvider";
import { getTRYMarket, selectSortByMarket } from "../../../selectors/wallet-selector";
import HapticProvider from "../../../providers/HapticProvider";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { useIsFocused } from "@react-navigation/native";
import LocalStorage from "../../../providers/LocalStorage";
import { getLang } from "../../../helpers/array-helper";
import CustomList from "../../../components/page-components/custom-list";
import WalletBottomSheetItem from "./modalize-item";
import store from "../../../reducers/createReducers";
import PureItem from "../markets/item-pure";
import EmptyContainer from "../../../components/page-components/empty-container";
import PulseAnimation from "../../../components/page-components/pulse";
import InputAccessory from "../../../components/page-components/input-accessory";
import Swipeable from "react-native-swipeable";
import TinyImage from "../../../tiny-image";
import DropdownAlert from "../../../providers/DropdownAlert";

let hh = 0, itemToShow = 16, currentlyOpenSwipeable = null, processing = false;

const WalletScreen = (props) => {
  const flatListRef = useRef(null);
  const { activeTheme, fontSizes, language } = useSelector(state => state.globalReducer);
  const { authenticated } = useSelector(state => state.authenticationReducer);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [selectedWallet, setSelectedWallet] = useState({});
  const [isLoadingCase, setIsLoadingCase] = useState(true);
  const [sortObj, setSortObj] = useState({
    type: "wb",
    direction: "desc",
  });
  const [activeSmallPrices, setActiveSmallPrices] = useState(false);
  const [dummyWallets, setDummyWallets] = useState([]);
  const [availableData, setAvailableData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [localWallets, setLocalWallets] = useState([]);

  const [leftActionActivated, setLeftActionActivated] = useState(false);
  const [toggle, setToggle] = useState(false);

  const sortedByMarket = useSelector(selectSortByMarket);
  const tryWallet = useSelector(getTRYMarket);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (authenticated && isFocused) {
      let locals = LocalStorage.getArray("walletsLocal");
      locals = locals.map(item => {
        return item;
      });
      setLocalWallets(locals);

      if (isLoadingCase) {
        setTimeout(() => {
          setIsLoadingCase(false);
        }, 1000);
      }
    }
  }, [isFocused, authenticated]);

  useEffect(() => {
    let items = getProperItems(sortedByMarket, sortObj), data;
    if (activeSmallPrices) {
      items = items.filter(itm => parseFloat(itm.am) > 0);
    }
    if (searchText) {
      setAvailableData(items.filter(item => item.cd.includes(searchText)));
    } else {
      setAvailableData(items);
    }
  }, [sortedByMarket, searchText, sortObj, activeSmallPrices]);

  useEffect(() => {
    setDummyWallets(availableData.slice(0, itemToShow * page));
  }, [availableData, page]);

  useEffect(() => {
    if (refreshing) {
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }
  }, [refreshing]);

  useEffect(() => {
    if (refreshing) {
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }
  }, [refreshing]);

  useEffect(() => {
    if (selectedWallet && selectedWallet.cd) {
      showModalMarket();
    }
  }, [selectedWallet]);

  const handleRefresh = () => {
    setRefreshing(true);
  };

  const onEndReached = () => {
    if (availableData.length <= dummyWallets.length) {
      setMoreLoading(false);
      return;
    }
    setMoreLoading(true);
    setTimeout(() => {
      setPage(page + 1);
      setMoreLoading(false);
    }, 1000);
  };

  const getProperItems = (items, obj) => obj.direction === "asc" ? items[obj.type] : items[obj.type].slice().reverse();

  const showModal = (transactionType, coinType) => {
    ModalProvider.show(() => <MarketSelect
      isBoth={false}
      type={transactionType}
      initialActiveType={coinType}
      setActiveType={() => null}
      isTrending={true}
      handleSelect={handleCoinSelected}
      shouldCheck={true}
    />, true);
  };

  const handleRefreshing = () => setRefreshing(true);

  const handleAction = (action) => {
    HapticProvider.trigger();

    if (action.key === "instant-trade") {
      return navigationRef.current.navigate("TradeStack");
    }
    const splitKey = action.key.split("-");
    if (action.key === "price-deposit" || action.key === "price-withdraw") {
      return navigationRef.current.navigate("Transfer", {
        wallet: tryWallet,
        transactionType: splitKey[1],
        coinType: "price",
      });
    }
    showModal(splitKey[1], "crypto");

  };

  const handleWalletAction = (wallet, type = "deposit") => {

    HapticProvider.trigger();
    //TODO CHECK STATE
    if (type === "deposit" && !wallet.da) {
      return DropdownAlert.show("info", getLang(language, "INFORMATION"), wallet.cd + " " + getLang(language, "IN_MAINTENANCE_DEPOSIT"));
    } else if (type === "withdraw" && !wallet.wa) {
      return DropdownAlert.show("info", getLang(language, "INFORMATION"), wallet.cd + " " + getLang(language, "IN_MAINTENANCE_WITHDRAW"));
    }

    handleDetailMarket(wallet, type);
  };

  const handleCoinSelected = (theCoin, tType) => {
    ModalProvider.hide();

    setTimeout(() => {
      let items = getProperItems(sortedByMarket, sortObj);
      const theWallet = items.find(item => item.gd === theCoin.CoinGuid);
      if (!theWallet) {
        return Alert.alert("not found");
      }
      return navigationRef.current.navigate("Transfer", {
        wallet: theWallet,
        transactionType: tType,
        coinType: ["TRY", "EUR", "USD"].includes(theWallet.cd) ? "price" : "crypto",
      });
    }, 250);
  };

  const handleSmallBalance = () => setActiveSmallPrices(!activeSmallPrices);

  const handleActionTop = (type) => {
    HapticProvider.trigger();
    showModal(type, "crypto");
  };

  const findDimension = (layout) => hh = layout.height;

  // const handleFocus = () => flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  const handleFocus = () => flatListRef.current?.scrollTop();

  const onDeleteLocals = () => {
    LocalStorage.removeItem("walletsLocal");
    setLocalWallets([]);
  };

  const handleSortAction = (type) => {
    HapticProvider.trigger();
    setSortObj({
      direction: sortObj.direction === "asc" ? "desc" : "asc",
      type,
    });
  };

  const [scrollEnabled, handleScroll] = useState(true);


  const handleLeftAction = (item, val) => {
    setLeftActionActivated(true);

    if (!processing) {
      processing = true;
      currentlyOpenSwipeable?.recenter();


      setTimeout(() => {
        navigationRef.current.navigate("WalletHistory", {
          wallet: item.cd,
          coinId: item.ci,
        });
      }, 500);
    }
  };

  const onOpen = (event, gestureState, swipeable) => {
    if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
      currentlyOpenSwipeable.recenter();
    }
    currentlyOpenSwipeable = swipeable;
  };

  const onClose = () => currentlyOpenSwipeable = null;

  const renderWalletItem = ({ item, index }) => {
    if (index === 0) {
      return (
        <WalletListHeader{...{
          handleFocus,
          localWallets,
          onDeleteLocals,
          handleSortAction,
          handleSmallBalance,
          searchText,
          setSearchText,
          sortObj,
          activeSmallPrices,
        }} />
      );
    }

    const isDepositAllowed = item.da === true;
    const isWithdrawAllowed = item.wa === true;

    return (


      <Swipeable
        style={{
          backgroundColor: "transparent",
        }}
        onSwipeStart={() => handleScroll(false)}
        onSwipeRelease={() => handleScroll(true)}
        leftActionActivationDistance={DIMENSIONS.SCREEN_WIDTH / 2}
        leftContent={(
          <View style={[styles(activeTheme).left, {
            backgroundColor: leftActionActivated ? activeTheme.actionColor : activeTheme.inActiveListBg,
          }]}>
            {leftActionActivated ?
              <View style={{ flexDirection: "row" }}>
                <TinyImage parent={"rest/"} name={"tick-active"}
                           style={styles(activeTheme).icon} />
              </View>
              :
              <View style={{ flexDirection: "row" }}>

                <Text style={{
                  fontSize: DIMENSIONS.NORMAL_FONTSIZE,
                  color: activeTheme.appWhite,
                  fontFamily: "CircularStd-Book",
                  marginRight: 10,
                }}>{getLang(language, "OBSERVE_HISTORY")}</Text>
                <TinyImage parent={"settings/"} name={"eye-list"}
                           style={styles(activeTheme).icon} />
              </View>
            }
          </View>
        )}
        onLeftActionActivate={() => handleLeftAction(item, true)}
        onLeftActionDeactivate={() => setLeftActionActivated(false)}
        onLeftActionComplete={() => setToggle(!toggle)}
        rightButtonWidth={80}
        rightButtons={[
          <TouchableOpacity
            onPress={() => handleWalletAction(item, "deposit")}
            style={[styles(activeTheme).actionCon, {
              backgroundColor: activeTheme.yesGreen,
            }]}>
            {
              !isDepositAllowed && <View style={styles(activeTheme).mainI}>
                <TinyImage parent={"rest/"} name={"maintenance"} style={[styles(activeTheme).icon, {
                  marginLeft: "8%",
                }]} />
              </View>
            }
            <TinyImage parent={"rest/"} name={"wallet-down"} style={[styles(activeTheme).icon, {
              marginLeft: "8%",
            }]} />

            <Text style={[styles(activeTheme).actionText, !isDepositAllowed && {
              color: activeTheme.secondaryText,
            }]}>{getLang(language, isDepositAllowed ? "DEPOSIT" : "IN_MAINTENANCE")}</Text>


          </TouchableOpacity>,


          <TouchableOpacity style={[styles(activeTheme).actionCon, {
            backgroundColor: isWithdrawAllowed ? activeTheme.noRed : activeTheme.inActiveListBg,
          }]}
                            onPress={() => handleWalletAction(item, "withdraw")}
                            activeOpacity={.8}
          >
            <TinyImage parent={"rest/"} name={"wallet-up"} style={[styles(activeTheme).icon, {
              marginLeft: "8%",
            }]} />
            <Text
              style={styles(activeTheme, fontSizes).actionText}>{getLang(language, isWithdrawAllowed ? "WITHDRAW" : "IN_MAINTENANCE")}</Text>
          </TouchableOpacity>,


          <TouchableOpacity
            style={[styles(activeTheme).actionCon, {
              backgroundColor: "#003B73",
            }]}
            onPress={() => handleWalletAction(item, "detail")}
            activeOpacity={.8}
          >

            <TinyImage parent={"rest/"} name={"market-chart"} style={[styles(activeTheme).icon, {
              marginLeft: "8%",
            }]} />

            <Text style={[styles(activeTheme, fontSizes).actionText]}>{getLang(language, "MARKET")}</Text>
          </TouchableOpacity>,
        ]}
        onRightButtonsOpenRelease={onOpen}
        onRightButtonsCloseRelease={onClose}
      >

        <WalletBottomSheetItem
          handleDetail={handleDetailMarket}
          key={index}
          index={index}
          wallet={item}
        />

      </Swipeable>

    );
  };

  const handleDetailMarket = (wallet, type) => {

    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter();
    }


    if (searchText) {
      const storedArray = LocalStorage.getArray("walletsLocal");
      const exist = storedArray.find(localItem => localItem.value === wallet.cd);
      if (!exist) {
        const newItem = {
          value: wallet.cd,
          id: wallet.gd,
        };
        const newArray = [newItem].concat(storedArray);
        LocalStorage.storeObject("walletsLocal", newArray.slice(0, 10));
      }
    }
    if (type === "detail") {
      if (wallet.cd === selectedWallet.cd) {
        return showModalMarket();
      } else {
        setSelectedWallet(wallet);
      }
    } else {
      return navigationRef.current.navigate("Transfer", {
        wallet,
        transactionType: type,
        coinType: ["TRY", "EUR", "USD", "GBP"].includes(wallet.cd) ? "price" : "crypto",
      });
    }
  };

  const showModalMarket = () => ModalProvider.show(() => renderModalContent(), true);

  const renderModalContent = () => {
    return (
      <View style={{ flex: 1, backgroundColor: activeTheme.backgroundApp }}>
        {
          renderMarketHeader()
        }

        {
          renderMarketContent()
        }
      </View>
    );
  };

  const renderMarketHeader = () => {
    return (
      <View style={styles(activeTheme).head}>

        <Text style={styles(activeTheme).headTitle}>
          {getLang(language, "PAIR_LIST")}
        </Text>


        <Pressable onPress={() => ModalProvider.hide()}>
          <Text style={styles(activeTheme).headTitle}>
            {getLang(language, "CANCEL")}
          </Text>
        </Pressable>


      </View>
    );
  };

  const renderMarketContent = () => {
    const states = store.getState();
    const initialMarkets = states["marketReducer"]["initialMarkets"];


    return (<FlatList
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
      data={initialMarkets.filter(market => market.fs === selectedWallet.cd || market.to === selectedWallet.cd)}
      renderItem={renderMarketItem}
      keyExtractor={marketExtractor}
    />);
  };

  const renderMarketItem = ({ item, index }) => {
    return (
      <PureItem
        handleCallback={() => ModalProvider.hide()}
        item={item}
        index={index}
        modalShown={true}
        swipeAble={false}
      />
    );
  };


  const marketExtractor = useCallback((item, index) => `market-index-${index}`, []);

  const keyExtractor = useCallback((item) => `wallet-${item.gd}`, []);

  if (!authenticated) {
    return <NeedAuthentication scrollEnable={false} isFull={true} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <WalletHeader language={language} authenticated={true} props={props} />


      <View style={styles(activeTheme).wrap3}>
        {
          dummyWallets.length <= 0 && <>

            {
              isLoadingCase ? <View style={styles(activeTheme).loadL}>
                <PulseAnimation />
              </View> : <View style={styles(activeTheme).load}>
                <EmptyContainer icon={"empty-wallet"} text={getLang(language, "NO_WALLET_FOUND")} />
              </View>

            }
          </>

        }

        <CustomList
          scrollEnabled={currentlyOpenSwipeable === null}
          borderGray={activeTheme.borderGray}
          contentStyle={{
            minHeight: DIMENSIONS.SCREEN_HEIGHT,
            backgroundColor: activeTheme.backgroundApp,
          }}
          style={{ backgroundColor: activeTheme.backgroundApp }}

          ref={flatListRef}
          hH={hh}
          refreshControl={<RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={"#bdbdbd"}
          />}
          showFooter={moreLoading && !searchText}
          stickyHeaderIndices={[1]}
          ListHeaderComponent={
            <View style={styles.absoluteHeader} onLayout={(event) => findDimension(event.nativeEvent.layout)}>
              <WalletTotal refreshing={refreshing} handleAction={handleActionTop} buttons={true} />
              <WalletActionTab handleAction={handleAction} />
            </View>
          }
          data={[0].concat(dummyWallets)}
          keyExtractor={keyExtractor}
          itemHeight={DIMENSIONS.LIST_ITEM_HEIGHT}
          renderItem={renderWalletItem}
          onEndReached={onEndReached}
        />
      </View>


      <InputAccessory
        tabBarShown={true}
        isAddition={false}
        stepAble={false}
        mailProviders={localWallets}
        isDelete={localWallets.length >= 1}
        onDelete={onDeleteLocals}
        onPress={setSearchText}
      />
    </View>
  );
};

export default React.memo(WalletScreen);


