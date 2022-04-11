import React, { useEffect, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import InfoCard from "../../../components/info-card";
import CustomButton from "../../../components/button";
import { useSelector } from "react-redux";
import transferServices from "../../../services/transfer-services";
import EmptyContainer from "../../../components/empty-container";
import WalletHistoryListHeader from "../../../components/wallet-history-list/header";
import { depositHeaders, historyTypes, withdrawHeaders } from "./constants";
import { PADDING_H, SCREEN_WIDTH } from "../../../../utils/dimensions";
import { getLang } from "../../../helpers/array-helper";
import DropdownAlert from "../../../providers/DropdownAlert";
import RenderTransferDepositItem from "../../../components/wallet-history-list/deposit-item";
import RenderTransferWithdrawItem from "../../../components/wallet-history-list/withdraw-item";
import { navigationRef } from "../../../providers/RootNavigation";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import SwipeAbleItem from "../../../components/swipe-list/components/item";
import AnimatedTab from "../../../components/animated-tab";
import PlLoading from "../../pl-loading";
import ActionSheetComProvider from "../../../providers/ActionSheetComProvider";
import { orderBy } from "lodash";


const WalletHistory = (props) => {
  const { activeTheme, language, connection } = useSelector(state => state.globalReducer);
  const { wallets } = useSelector(state => state.walletReducer);
  const { user } = useSelector(state => state.authenticationReducer);

  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [itemTransfers, setItemTransfers] = useState(null);
  const [activeHistory, setActiveHistory] = useState("deposit");
  const [withdraws, setWithdraws] = useState(null);
  const [deposits, setDeposits] = useState(null);
  const [selectedTransfer, setSelectedTransfer] = useState({});

  useEffect(() => {
    if (connection && user.UserGuid) {
      // TRANSFER HUB
      connection.invoke("JoinTransferHubLiteGroupAsync", user.UserGuid)
        .then(() => console.log("≠COREHUB- TRANSFER !"))
        .catch(err => console.log("≠COREHUB- TRANSFER ! - ", err));

      //TRANSFERS
      connection.on("notifyUserTransferDashBoard", (withdraws, deposits) => {
        // console.log("notifyUserTransferDashBoard - ", withdraws.length, deposits.length);

        setWithdraws(orderBy(withdraws, ["ts"], ["desc"]));
        setDeposits(orderBy(deposits, ["ts"], ["desc"]));
      });

      connection.on("notifyUserTransferDashBoardUpdate", (withdraws, deposits) => {
        // console.log("notifyUserTransferDashBoardUpdate - ", withdraws.length, " -> ", deposits.length);
      });


      return function cleanup() {
        console.log("cleanup transfer hub");
        connection.off("notifyUserTransferDashBoard");
        connection.off("notifyUserTransferDashBoardUpdate");

        if (user.UserGuid) {
          connection.invoke("LeaveTransferHubLiteGroupAsync", user.UserGuid)
            .then(() => console.log("LEFT TRANSFER HUB"))
            .catch((e) => console.log("COULNT NOT LEAVE TRANSFER HUB - ", e));
        }
      };

    }
  }, [connection, user]);

  useEffect(() => {
    if (itemTransfers) {
      setLoading(false);
    }
  }, [itemTransfers]);

  useEffect(() => {
    if (activeHistory && withdraws && deposits) {
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
    if (selectedTransfer && selectedTransfer.tg && selectedTransfer.st === 1) {
      ActionSheetComProvider.show({
        title: getLang(language, selectedTransfer.di === 1 ? "DO_YOU_WANT_TO_CANCEL_DEPOSIT_TRANSFER" : "DO_YOU_WANT_TO_CANCEL_WITHDRAW_TRANSFER"),
        options: [getLang(language, "CANCEL_TRANSFER"), getLang(language, "CANCEL")],
        onAction: (index) => handleCancelService(index),
      });
    }
  }, [selectedTransfer]);

  const handleDepositWithdraw = (type) => navigationRef.current.navigate("Transfer", {
    wallet,
    transactionType: type,
    coinType: ["TRY", "EUR", "USD"].includes(wallet.cd) ? "price" : "crypto",
  });

  const handleCancelApprove = (transfer) => {
    if (!transfer || transfer.st !== 1) {
      return;
    }
    setSelectedTransfer(transfer);
  };

  const handleCancelService = (index) => {
    if (index !== 0)
      return;

    transferServices.cancelTransfer(selectedTransfer.tg).then((response) => {
      if (response.IsSuccess) {
        return DropdownAlert.show("success", getLang(language, "SUCCESS"), response.ErrorMessage);
      }
    });
  };

  const handleChangeTradeType = (item) => setActiveHistory(item.key);

  return (
    <>
      <TabNavigationHeader {...props} backAble={true} options={{ title: getLang(language, "HISTORY") }} />

      <View style={styles(activeTheme).container}>


        <View style={styles(activeTheme).wrapper}>

          {
            loading ? <PlLoading height={120} /> : wallet &&
              <InfoCard handleButton={(type) => handleDepositWithdraw(type)} showButtons={true} wallet={wallet} />

          }

          {
            !loading && <View style={{ paddingVertical: 20 }}>
              <AnimatedTab {...{
                activeKey: activeHistory,
                headers: historyTypes,
                width: `${100 / historyTypes.length}%`,
                onChange: handleChangeTradeType,
              }} />
            </View>
          }


          {
            loading ? <ActivityIndicator color={activeTheme.secondaryText} /> :
              itemTransfers.length <= 0 ? <View style={{
                  width: SCREEN_WIDTH - (PADDING_H * 2),
                  paddingTop: SCREEN_WIDTH / 1.5,
                }}>
                  <EmptyContainer icon={"empty-wallet"} text={""} />
                </View> :
                <>
                  <WalletHistoryListHeader{...{
                    activeTheme,
                    language,
                    headers: activeHistory === "deposit" ? depositHeaders : withdrawHeaders,
                  }} />

                  <FlatList
                    contentContainerStyle={styles(activeTheme).flat}
                    showsVerticalScrollIndicator={false}
                    data={itemTransfers}
                    renderItem={({ item, index }) => {
                      const isWaiting = item.st === 1;
                      const isDeposit = item.di === 1;

                      return isWaiting ? <SwipeAbleItem {...{ item }} Layout={() => isDeposit ?
                          <RenderTransferDepositItem{...{ item }} /> :
                          <RenderTransferWithdrawItem{...{ item }} />}
                                                        onSwipe={() => handleCancelApprove(item)}
                        /> :
                        isDeposit ?
                          <RenderTransferDepositItem{...{ item }} /> :
                          <RenderTransferWithdrawItem{...{ item }} />;
                    }}
                    keyExtractor={item => item.tg}
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


    </>

  );
};

const WalletHistoryScreen = styledHigherOrderComponents(WalletHistory);
export default WalletHistoryScreen;


const styles = (props) => StyleSheet.create({
  container: { flex: 1 },

  wrapper: {
    flex: 1,
    paddingHorizontal: PADDING_H,
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
  flat: { paddingVertical: 20, paddingBottom: 80 },
});
