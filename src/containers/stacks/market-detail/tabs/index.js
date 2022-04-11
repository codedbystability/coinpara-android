import React, { useEffect, useState } from "react";
import MarketContent from "./market-content";
import NeedAuthentication from "../../../../components/need-authentication";
import { isIphoneX } from "../../../../../utils/devices";
import HistoryContentIndex from "./history";
import WalletContent from "./wallet-content";
import InfoContent from "./info-content";
import marketServices from "../../../../services/market-services";
import OrdersPure from "../../orders/index-pure";
import { useDispatch, useSelector } from "react-redux";
import { AppState, View } from "react-native";
import { orderBy } from "lodash";
import { setLatestTicker } from "../../../../actions/market-actions";
import { useIsFocused } from "@react-navigation/native";
// import { setupSignalRConnection, stopConnection } from "../../../../providers/CoreHubProvider";


const MarketDetailTabsIndex = (props) => {

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { activeTab, market, handleDetail, gd } = props;
  const { connection } = useSelector(state => state.globalReducer);
  const { authenticated } = useSelector(state => state.authenticationReducer);
  const [info, setInfo] = useState({});
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  const [historyArr, setHistoryArr] = useState([]);
  // const appState = useRef(AppState.currentState);


  useEffect(() => {
    if (isFocused) {
      if (connection && connection.connectionState === "Connected") {
        connectMarket();
      }
      getContent();

      // const subscription = AppState.addEventListener("change", nextAppState => {
      //   if (nextAppState === "active") {
      //     if (!user.UserGuid && !userToken) {
      //       // setupSignalRConnection(null, null);
      //     } else if (user.UserGuid && user) {
      //       // setupSignalRConnection(user.UserGuid, userToken);
      //     }
      //   } else {
      //     connection.stop();
      //   }
      // });

      return function cleanup() {
        if (connection) {
          tryToStopConnection();
        }
      };
    }
  }, [connection, isFocused, gd]);


  const tryToStopConnection = () => {
    connection.off("notifyOrderDashBoard");
    connection.off("notifyMarketHistory");
    connection.invoke("LeaveOrderHubLiteGroupAsync", market.gd)
      .then(() => console.log("LeaveOrderHubLiteGroupAsync - ", market.gd))
      .catch(err => console.log("COULD NOT LeaveOrderHubLiteGroupAsync - ", "=> ", market.gd, err));
  };
  const connectMarket = () => {

    connection.invoke("JoinOrderHubLiteGroupAsync", market.gd)
      .then(() => console.log("≠ JoinOrderHubLiteGroupAsync market-detail", market.gd))
      .catch(err => console.log("COULD NOT JoinOrderHubLiteGroupAsync -  ", err));


    connection.off("notifyOrderDashBoard");
    connection.on("notifyOrderDashBoard", (asks, bids) => {
      // console.log(" notifyOrderDashBoard - ", new Date());
      setAsks(asks);
      setBids(bids);
    });

    connection.off("notifyMarketHistory");
    connection.on("notifyMarketHistory", (histories) => {
      // console.log("notifyMarketHistory - historyArr - ", histories.length);
      // setLoading(false);
      dispatch(setLatestTicker(histories[0]));
      setHistoryArr(orderBy(histories, ["ts"], ["desc"]).slice(0, 30));
    });

    // MARKET DETAY GECMIS UPDATE
    connection.off("notifyMarketHistoryAdd");
    connection.on("notifyMarketHistoryAdd", (newHistories) => {
      // console.log("notifyMarketHistoryAdd - ", newHistories.length, "- ", new Date());
      dispatch(setLatestTicker(newHistories[0]));
      setHistoryArr(historyArr => [...newHistories, ...historyArr].slice(0, 30));
    });

  };

  const getDynamicContent = () => {


    switch (activeTab) {

      case "market":
        return <MarketContent
          asks1={asks}
          bids1={bids}
          fromPrecision={market.spp}
          toPrecision={market.svp}
          handleDetail={handleDetail}
          market={market}
        />;

      case "orders":
        return authenticated ?
          <OrdersPure
            from={market.fs}
            to={market.to}
            gd={market.gd}
          />
          : <NeedAuthentication
            isSmall={!isIphoneX}
            isMinimal={true}
            isFull={false} />;

      case "history":

        return <HistoryContentIndex
          tdp={market.tdp}
          fdp={market.fdp}
          history={historyArr}
        />;

      case "wallet":
        return authenticated ? <WalletContent
            market={market} /> :
          <NeedAuthentication
            isSmall={!isIphoneX}
            isMinimal={true}
            isFull={false} />;


      case "info":
        return <InfoContent
          info={info}
          market={market} />;


      default:
        return null;
    }
  };

  const getContent = () => {
    marketServices.marketDetail(market.gd).then((response) => {
      if (response && response.IsSuccess) {
        setInfo(response.Data);
      }
    });
  };


  return (
    <View style={{ flex: 1 }}>
      {
        getDynamicContent()
      }
    </View>
  );
};


export default React.memo(MarketDetailTabsIndex);

