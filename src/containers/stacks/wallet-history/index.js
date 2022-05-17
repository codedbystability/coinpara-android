import React, { useEffect, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { StyleSheet, View } from "react-native";
import InfoCard from "../../../components/info-card";
import CustomButton from "../../../components/button";
import { useSelector } from "react-redux";
import transferServices from "../../../services/transfer-services";
import EmptyContainer from "../../../components/empty-container";
import WalletHistoryListHeader from "../../../components/wallet-history-list/header";
import { historyTypes, withdrawHeaders } from "./constants";
import { LIST_ITEM_HEIGHT, PADDING_H, SCREEN_WIDTH } from "../../../../utils/dimensions";
import { getLang } from "../../../helpers/array-helper";
import RenderTransferWithdrawItem from "../../../components/wallet-history-list/withdraw-item";
import { navigationRef } from "../../../providers/RootNavigation";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import AnimatedTab from "../../../components/animated-tab";
import EditButton from "../../../components/edit-button";
import WalletHistoryFilter from "./filter";
import CustomList from "../../../components/custom-list";
import moment from "moment";
import FloatingAction from "../../../components/floating-action";


const WalletHistory = (props) => {
  const { activeTheme, activeThemeKey, language } = useSelector(state => state.globalReducer);
  const { wallets } = useSelector(state => state.walletReducer);

  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [itemTransfers, setItemTransfers] = useState([]);
  const [activeHistory, setActiveHistory] = useState("deposit");
  const [withdraws, setWithdraws] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(null);
  const [noMore, setNoMore] = useState(false);
  const [filterObj, setFilterObj] = useState({});

  useEffect(() => {
    if (props && props.route.params
      && props.route.params.wallet
      && props.route.params.coinId
      && typeof props.route.params.wallet === "string") {


    }
  }, [props.route]);

  useEffect(() => {
    if (itemTransfers) {
      setLoading(false);
    }
  }, [itemTransfers]);

  useEffect(() => {
    if (activeHistory) {
      setPage(1);
      setNoMore(false);
      setFilterObj({
        ...filterObj,
        type: activeHistory === "deposit" ? "1" : "-1",
        to: moment().format("YYYY-MM-DD"),
        from: moment().subtract(3, "months").format("YYYY-MM-DD"),
        status: "",
        coinId: props.route.params && props.route.params.wallet && props.route.params.coinId || "",
      });
    }
  }, [activeHistory]);

  useEffect(() => {
    if (activeHistory) {
      if (activeHistory === "deposit") {
        setItemTransfers(wallet ? deposits.filter(transfer => transfer.cd === wallet.cd) : deposits);
      } else if (activeHistory === "withdraw") {
        setItemTransfers(wallet ? withdraws.filter(transfer => transfer.cd === wallet.cd) : withdraws);
      }
    }
  }, [wallet, activeHistory, withdraws, deposits]);

  useEffect(() => {
    if (props.route && props.route.params && props.route.params.gd && wallets.length >= 1) {
      setWallet(wallets.find(wall => wall.gd === props.route.params.gd));
    }
  }, [wallets, props.route]);

  useEffect(() => {
    setTimeout(() => {
      if (page && filterObj && filterObj.type) {
        setActiveHistory(filterObj.type === "1" ? "deposit" : "withdraw");
        handleFilter(filterObj, page === 1);
      }
    }, 500);
  }, [page, filterObj]);


  const handleDepositWithdraw = (type) => navigationRef.current.navigate("Transfer", {
    wallet,
    transactionType: type,
    coinType: ["TRY", "EUR", "USD"].includes(wallet.cd) ? "price" : "crypto",
  });


  const handleChangeTradeType = (item) => setActiveHistory(item.key);

  const handleShowFilter = () => setShowFilter(!showFilter);


  const handleFilterForm = (obj) => {
    console.log(obj);
    setPage(1);
    setFilterObj(obj);
  };

  const handleFilter = (obj, isNew = false) => {
    setShowFilter(false);
    const myUrl = `https://apiv2.coinpara.com/api/transfers/search?RowLimit=20&PageNumber=${page}&coinId=${obj.coinId}&StatusList=${obj.status}&DirectionList=${obj.type}&DateFrom=${obj.from}&DateTo=${obj.to}`;

    transferServices.search(myUrl).then((response) => {
      if (response.IsSuccess) {
        if (!response.Data || response.Data.length <= 0) {
          if (obj.type === "1") {
            setDeposits(isNew ? response.Data : [...deposits, ...response.Data]);
          } else {
            setWithdraws(isNew ? response.Data : [...withdraws, ...response.Data]);
          }
          return setNoMore(true);
        }

        if (obj.type === "1") {
          setDeposits(isNew ? response.Data : [...deposits, ...response.Data]);
        } else {
          setWithdraws(isNew ? response.Data : [...withdraws, ...response.Data]);
        }
      }
    });

  };

  const onEndReached = () => {
    if (noMore) {
      return;
    }
    setPage(page + 1);
  };

  return (
    <>
      <TabNavigationHeader {...props}
                           backAble={true}
                           isBack={true}
                           options={{ title: getLang(language, "HISTORY") }} />

      <View style={styles(activeTheme).container}>


        <View style={styles(activeTheme).wrapper}>

          {
            wallet &&
            <InfoCard handleButton={(type) => handleDepositWithdraw(type)} showButtons={true} wallet={wallet} />

          }

          {
            !loading && <View style={{
              paddingVertical: 20, paddingHorizontal: PADDING_H,
            }}>
              <AnimatedTab {...{
                activeKey: activeHistory,
                headers: historyTypes,
                width: `${100 / historyTypes.length}%`,
                onChange: handleChangeTradeType,
                filled: true,
              }} />
            </View>
          }


          {
            itemTransfers.length <= 0 ? <View style={{
                paddingTop: SCREEN_WIDTH / 2,
              }}>
                <EmptyContainer icon={"empty-wallet"} text={getLang(language, "NO_DATA_FOUND")} />
              </View> :
              <>
                <WalletHistoryListHeader{...{
                  activeTheme,
                  language,
                  headers: withdrawHeaders,
                }} />


                <CustomList
                  scrollEnabled
                  borderGray={activeTheme.borderGray}
                  contentStyle={styles(activeTheme).flat}
                  style={{ backgroundColor: activeTheme.backgroundApp }}
                  data={itemTransfers}
                  keyExtractor={item => item.TransferGuid}
                  itemHeight={LIST_ITEM_HEIGHT}
                  renderItem={({ item, index }) => <RenderTransferWithdrawItem{...{ item, index }} />}
                  onEndReached={onEndReached}
                />
              </>


          }

        </View>

        {
          wallet && <View style={styles(activeTheme).buttonWrapper}>

            <View style={styles(activeTheme).content}>

              <CustomButton
                text={getLang(language, "DEPOSIT")}
                filled={true}
                onPress={() => handleDepositWithdraw("deposit")}
                style={{ backgroundColor: activeTheme.yesGreen }} />
            </View>


            <View style={styles(activeTheme).content}>
              <CustomButton
                text={getLang(language, "WITHDRAW")}
                filled={true}
                onPress={() => handleDepositWithdraw("withdraw")}
                style={{ backgroundColor: activeTheme.noRed }}
              />
            </View>


          </View>
        }
      </View>


      <WalletHistoryFilter {...{
        parity: props.route.params && props.route.params.wallet && props.route.params.wallet || "",
        showFilter,
        setShowFilter,
        activeTheme,
        activeThemeKey,
        setFilterObj,
        language,
        handleShowFilter,
        handleFilterForm,
      }} />


      <FloatingAction />


      <EditButton onPress={handleShowFilter} />

    </>

  );
};

const WalletHistoryScreen = styledHigherOrderComponents(WalletHistory);
export default WalletHistoryScreen;


const styles = (props) => StyleSheet.create({
  container: { flex: 1 },

  wrapper: {
    flex: 1,
  },
  buttonWrapper: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  content: {
    width: "50%",
    height: "100%",
  },

  del: {
    backgroundColor: props.noRed,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  txt: {
    fontFamily: "CircularStd-Bold",
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
  },
  flat: {
    paddingVertical: 20,
    paddingBottom: 80,


  },
});
