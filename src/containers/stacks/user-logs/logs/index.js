import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import userServices from "../../../../services/user-services";
import { PADDING_BV, PADDING_H } from "../../../../../utils/dimensions";
import UserLogItem from "./item";


const UserLogList = (props) => {
  const { activeTheme } = props;
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);


  useEffect(() => {
    if (page) {
      getLogs(page);
    }
  }, [page]);

  const getLogs = (page) => {
    userServices.getUserLogs(page).then((response) => {
      if (response && response.IsSuccess) {
        logs.length <= 0 ? setLogs(response.Data) : setLogs(logs => [...logs, ...response.Data]);
      }
    });
  };

  const onEndReached = () => setPage(page + 1);


  return (

    <FlatList
      contentContainerStyle={{
        paddingBottom: 80,
        paddingHorizontal: PADDING_H,
        paddingVertical: PADDING_BV,
      }}
      showsVerticalScrollIndicator={false}
      data={logs}
      renderItem={(item) => <UserLogItem
        activeTheme={activeTheme}
        item={item.item} />}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={onEndReached}
      onEndReachedThreshold={0}
    />
  );

};

export default UserLogList;
