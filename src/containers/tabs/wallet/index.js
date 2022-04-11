import React, {useCallback, useEffect, useRef, useState} from "react";
import {Alert, FlatList, Pressable, RefreshControl, Text, View} from "react-native";
import {useSelector} from "react-redux";
import NeedAuthentication from "../../../components/need-authentication";
import WalletHeader from "./wallet-header";
import WalletActionTab from "./action-tab";
import MarketSelect from "../../../components/market-select";
import styles from "./styles";
import WalletListHeader from "./list-header";
import {navigationRef} from "../../../providers/RootNavigation";
import WalletTotal from "../../../components/wallet-total";
import ModalProvider from "../../../providers/ModalProvider";
import {selectSortByMarket} from "../../../selectors/wallet-selector";
import HapticProvider from "../../../providers/HapticProvider";
import {LIST_ITEM_HEIGHT, SCREEN_HEIGHT} from "../../../../utils/dimensions";
import {useIsFocused} from "@react-navigation/native";
import LocalStorage from "../../../providers/LocalStorage";
import {getLang} from "../../../helpers/array-helper";
import CustomList from "../../../components/custom-list";
import WalletBottomSheetItem from "./modalize-item";
import store from "../../../reducers/createReducers";
import PureItem from "../markets/item-pure";
import EmptyContainer from "../../../components/empty-container";
import PulseAnimation from "../../../components/pulse";

let hh = 0, itemToShow = 16;
const WalletScreen = (props) => {
    const scrollRef = useRef(null);
    const {activeTheme, language} = useSelector(state => state.globalReducer);
    const {authenticated} = useSelector(state => state.authenticationReducer);
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [selectedWallet, setSelectedWallet] = useState({});
    const [isLoadingCase, setIsLoadingCase] = useState(true)

    const [sortObj, setSortObj] = useState({
        type: "wb",
        direction: "desc",
    });
    const [activeSmallPrices, setActiveSmallPrices] = useState(false);
    const [dummyWallets, setDummyWallets] = useState([]);
    const [availableData, setAvailableData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [moreLoading, setMoreLoading] = useState(false);

    const sortedByMarket = useSelector(selectSortByMarket);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (authenticated && isFocused) {

            if (isLoadingCase) {
                setTimeout(() => {
                    setIsLoadingCase(false)
                }, 1000)
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
        />, false);
    };

    const handleRefreshing = () => setRefreshing(true);

    const handleAction = (action) => {
        if (action.key === "instant-trade") {
            return navigationRef.current.navigate("Trade");
        }
        const splitKey = action.key.split("-");
        if (action.key === "price-deposit" || action.key === "price-withdraw") {
            return navigationRef.current.navigate("Transfer", {
                wallet: dummyWallets.find(item => item.cd === "TRY"),
                transactionType: splitKey[1],
                coinType: "price",
            });
        }
        showModal(splitKey[1], "crypto");

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

    const handleActionTop = (type) => showModal(type, "crypto");

    const findDimension = (layout) => hh = layout.height;

    // const handleFocus = () => scrollRef.current?.scrollToOffset({ animated: true, offset: 0 });
    const handleFocus = () => scrollRef.current?.scrollTop();

    const handleSortAction = (type) => {
        HapticProvider.trigger();
        setSortObj({
            direction: sortObj.direction === "asc" ? "desc" : "asc",
            type,
        });
    };

    const renderWalletItem = ({item, index}) => {
        if (index === 0) {
            return (

                <WalletListHeader{...{
                    handleFocus,
                    handleSortAction,
                    handleSmallBalance,
                    searchText,
                    setSearchText,
                    sortObj,
                    activeSmallPrices,
                }} />
            );
        }
        return (
            <WalletBottomSheetItem
                key={index}
                handleDetail={handleDetailMarket}
                index={index}
                wallet={item}
            />
        );
    };

    const handleDetailMarket = (wallet, type) => {
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

    const showModalMarket = () => ModalProvider.show(() => renderModalContent(), false);

    const renderModalContent = () => {
        return (
            <View style={{flex: 1, backgroundColor: activeTheme.backgroundApp}}>
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
            contentContainerStyle={{paddingBottom: LIST_ITEM_HEIGHT}}
            showsVerticalScrollIndicator={false}
            data={initialMarkets.filter(market => market.fs === selectedWallet.cd || market.to === selectedWallet.cd)}
            renderItem={renderMarketItem}
            keyExtractor={marketExtractor}
        />);
    };

    const renderMarketItem = ({item, index}) => {
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
        return <NeedAuthentication scrollEnable={false} isFull={true}/>;
    }

    return (
        <View style={{flex: 1}}>
            <WalletHeader language={language} authenticated={true} props={props}/>


            <View style={styles(activeTheme).wrap3}>
                {
                    dummyWallets.length <= 0 && <>

                        {
                            isLoadingCase ? <View style={styles(activeTheme).loadL}>
                                <PulseAnimation/>
                            </View> : <View style={styles(activeTheme).load}>
                                <EmptyContainer icon={"empty-wallet"} text={getLang(language, "NO_WALLET_FOUND")}/>
                            </View>

                        }
                    </>

                }

                <CustomList
                    contentStyle={{
                        minHeight: SCREEN_HEIGHT,
                        backgroundColor: activeTheme.backgroundApp
                    }}
                    style={{backgroundColor: activeTheme.backgroundApp}}

                    ref={scrollRef}
                    hH={hh}
                    refreshControl={<RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={"#bdbdbd"}
                    />}
                    showFooter={moreLoading && !searchText}
                    stickyHeaderIndices={[1]}

                    ListHeaderComponent={
                        <View style={styles.absoluteHeader}
                              onLayout={(event) => findDimension(event.nativeEvent.layout)}>


                            <WalletTotal refreshing={refreshing} handleAction={handleActionTop} buttons={true}/>
                            <WalletActionTab handleAction={handleAction}/>

                        </View>
                    }
                    data={[0].concat(dummyWallets)}
                    keyExtractor={keyExtractor}
                    itemHeight={LIST_ITEM_HEIGHT}
                    renderItem={renderWalletItem}
                    onEndReached={onEndReached}
                />
            </View>
        </View>
    );
};

export default React.memo(WalletScreen);


