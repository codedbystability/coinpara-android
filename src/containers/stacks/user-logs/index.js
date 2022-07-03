import React, { useEffect, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { DIMENSIONS } from "../../../../utils/dimensions";
import WalletHistoryListHeader from "../../../components/page-components/wallet-history-list/header";
import { activitiesHeaders, logHeaders } from "../wallet-history/constants";
import TabNavigationHeader from "../../../components/page-components/tab-navigation-header";
import { getLang } from "../../../helpers/array-helper";
import AnimatedTab from "../../../components/page-components/animated-tab";
import FloatingAction from "../../../components/page-components/floating-action";
import userServices from "../../../services/user-services";
import CustomList from "../../../components/page-components/custom-list";
import transferServices from "../../../services/transfer-services";
import UserLogItem from "./log-item";
import TransferItem from "./transfer-item";

const headers = [
  { id: 1, key: "user", title: "USER_ACTIVITIES" },
  { id: 2, key: "account", title: "ACCOUNT_ACTIVITIES" },
];

const UserLogs = (props) => {
  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const [activeHeaderKey, setActiveHeaderKey] = useState("user");

  const [logs, setLogs] = useState([]);
  const [noMoreLog, setNoMoreLog] = useState(false);
  const [noMoreTransfer, setNoMoreTransfer] = useState(false);
  const [page, setPage] = useState(1);
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    if (activeHeaderKey) {
      setPage(1);
    }
  }, [activeHeaderKey]);


  useEffect(() => {
    if ((activeHeaderKey === "user" || logs.length <= 0) && !noMoreLog) {
      getLogs(page);
    }

    if ((activeHeaderKey === "account" || logs.length <= 0) && !noMoreTransfer) {
      getTransfers(page);
    }
  }, [page]);


  const getLogs = (page) => {
    userServices.getUserLogs(page).then((response) => {
      if (response && response.IsSuccess) {
        if (response.Data.length <= 0) {
          setNoMoreLog(true);
        } else {
          logs.length <= 0 ? setLogs(response.Data) : setLogs(logs => [...logs, ...response.Data]);
        }
      }
    });
  };

  const getTransfers = (page) => {
    transferServices.getUserTransfers(page).then((response) => {
      if (response && response.IsSuccess) {
        if (response.Data.length <= 0) {
          setNoMoreTransfer(true);
        } else {
          transfers.length <= 0 ? setTransfers(response.Data) : setTransfers(transfers => [...transfers, ...response.Data]);
        }
      }
    });
  };

  const onEndReached = () => setPage(page + 1);


  const handleSetHeader = (header) => setActiveHeaderKey(header.key);

  const renderItem = (({ item }) => {
    return (
      activeHeaderKey === "user" ? <UserLogItem
        activeTheme={activeTheme}
        item={item} /> : <TransferItem {...{
        language,
        item: item,
        activeTheme,
      }} />
    );
  });

  return (
    <>
      <TabNavigationHeader
        {...props}
        backAble={true}
        options={{
          presentation: "modal",
          title: getLang(language, "ACTIVITIES"),
        }}
      />
      <CustomList
        contentStyle={{
          paddingHorizontal: DIMENSIONS.PADDING_H,
          paddingBottom: 100,
        }}
        ListHeaderComponent={
          <View style={{ paddingVertical: DIMENSIONS.PADDING_H, backgroundColor: activeTheme.backgroundApp }}>
            <AnimatedTab {...{
              activeKey: activeHeaderKey,
              headers: headers,
              width: `${100 / headers.length}%`,
              onChange: handleSetHeader,
            }} />

            <WalletHistoryListHeader
              activeTheme={activeTheme}
              headers={activeHeaderKey === "user" ? logHeaders : activitiesHeaders} />
          </View>
        }
        onEndReached={onEndReached}
        stickyHeaderIndices={[0]}
        borderGray={"transparent"}
        data={activeHeaderKey === "user" ? logs : transfers}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        itemHeight={DIMENSIONS.LIST_ITEM_HEIGHT * 2}
        iconKey={"empty-orders"}
        emptyMessage={getLang(language, activeHeaderKey === "user" ? "NO_USER_ACTIVITIES_FOUND" : "NO_SUPPORT_REQUEST_FOUND")}

      />


      <FloatingAction />
    </>

  );

};

const UserLogsScreen = styledHigherOrderComponents(UserLogs);
export default UserLogsScreen;
