import React, { useEffect, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { PADDING_H } from "../../../../utils/dimensions";
import WalletHistoryListHeader from "../../../components/wallet-history-list/header";
import { activitiesHeaders, depositHeaders, logHeaders } from "../wallet-history/constants";
import UserLogList from "./logs";
import UserTransferList from "./transfers";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import { getLang } from "../../../helpers/array-helper";
import AnimatedTab from "../../../components/animated-tab";

const headers = [
  { id: 1, key: "user", title: "USER_ACTIVITIES" },
  { id: 2, key: "account", title: "ACCOUNT_ACTIVITIES" },
];

const UserLogs = (props) => {
  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const [activeHeaderKey, setActiveHeaderKey] = useState("user");

  const handleSetHeader = (header) => setActiveHeaderKey(header.key);


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

      <View style={{
        flex: 1,
      }}>
        <View style={{ padding: PADDING_H }}>
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

        {
          activeHeaderKey === "user" ? <UserLogList language={language} activeTheme={activeTheme} /> :
            <UserTransferList language={language} activeTheme={activeTheme} />
        }

      </View>
    </>

  );

};

const UserLogsScreen = styledHigherOrderComponents(UserLogs);
export default UserLogsScreen;
