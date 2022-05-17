import React, { useEffect, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { View } from "react-native";
import TransactionDescriptions from "../transaction-descriptions";
import InfoCardDetail from "../../../components/info-card-detail";
import Loading from "../../../components/loading";
import Clipboard from "@react-native-community/clipboard";
import { useSelector } from "react-redux";
import DropdownAlert from "../../../providers/DropdownAlert";
import { getLang } from "../../../helpers/array-helper";
import { formatMoney, formattedNumber } from "../../../helpers/math-helper";
import moment from "moment";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import { PADDING_H } from "../../../../utils/dimensions";
import FloatingAction from "../../../components/floating-action";


const TransactionDetail = (props) => {

  const { language } = useSelector(state => state.globalReducer);
  const [transfer, setTransfer] = useState({});

  useEffect(() => {
    setTransfer(props.route.params.transfer);
  }, [props]);

  const handleCopyTg = (transfer) => {
    DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "TRANSACTION_ID_COPIED"));
    Clipboard.setString(transfer.tg);
  };

  if (!transfer || !transfer.CoinCode) {
    return <Loading />;
  }

  return (
    <>
      <TabNavigationHeader
        {...props}
        backAble={true}
        isBack={true}
        options={{ title: getLang(language, "TRANSACTION_DETAIL") }}
      />
      <View style={{ flex: 1, paddingHorizontal: PADDING_H }}>

        <InfoCardDetail transfer={transfer} />

        <TransactionDescriptions
          icon={false}
          descriptions={
            [
              {
                id: 1,
                title: transfer.Direction === 1 ? "DEPOSIT_NOUN" : "WITHDRAW_NOUN",
                text: formatMoney(transfer.Amount, 2),
                isLan: true,
              },
              {
                id: 2,
                title: "DATE",
                text: moment(transfer.Timestamp).utc().format("YYYY-MM-DD HH:mm:ss"),
                isLan: true,
              },
              { id: 3, title: "TRANSACTION_ID", text: transfer.TransferGuid, isLan: true, icon: "copy" },
            ]}
          transfer={transfer} handleCopyTg={handleCopyTg} />

      </View>

      <FloatingAction />

    </>

  );

};

const TransactionDetailScreen = styledHigherOrderComponents(React.memo(TransactionDetail));
export default TransactionDetailScreen;
