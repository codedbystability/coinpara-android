import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import transferServices from "../../../../services/transfer-services";
import TransferItem from "./item";
import { PADDING_BV, PADDING_H } from "../../../../../utils/dimensions";


const UserTransferList = (props) => {
  const { activeTheme,language } = props;
  const [transfers, setTransfers] = useState([]);
  const [page, setPage] = useState(1);


  useEffect(() => {
    if (page) {
      getTransfers(page);
    }
  }, [page]);

  const getTransfers = (page) => {
    transferServices.getUserTransfers(page).then((response) => {
      if (response && response.IsSuccess) {
        transfers.length <= 0 ? setTransfers(response.Data) : setTransfers(transfers => [...transfers, ...response.Data]);
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
      onEndReached={onEndReached}
      onEndReachedThreshold={0}
      showsVerticalScrollIndicator={false}
      data={transfers}
      renderItem={(item) =>
        <TransferItem {...{
          language,
          item: item.item,
          activeTheme,
        }} />
      }
      keyExtractor={(i, index) => index.toString()}
    />
  );

};

export default UserTransferList;
