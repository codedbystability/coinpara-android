import * as React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import { MemoizedOrderItem } from "./item";
import marketServices from "../../../services/market-services";
import { PADDING_BH, PADDING_H, PADDING_V, SCREEN_HEIGHT } from "../../../../utils/dimensions";
import DropdownAlert from "../../../providers/DropdownAlert";
import { getLang } from "../../../helpers/array-helper";
import { navigationRef } from "../../../providers/RootNavigation";
import Loading from "../../../components/loading";
import ActionSheetComProvider from "../../../providers/ActionSheetComProvider";
import AnimatedTab from "../../../components/animated-tab";
import TinyImage from "../../../tiny-image";
import FloatingAction from "../../../components/floating-action";
import CustomList from "../../../components/custom-list";
import EditButton from "../../../components/edit-button";
import OrdersFilter from "./filter";
import orderServices from "../../../services/order-services";
import EmptyContainer from "../../../components/empty-container";

const orderTypes = [
  { id: 1, key: 0, title: "OPEN_ORDERS", extra: "oLength", value: 0 },
  { id: 2, key: 1, title: "CLOSED_ORDERS", extra: "cLength", value: 1 },
];

class OrdersPure extends React.PureComponent {

  constructor(props) {
    super(props);
    this.actionRef = React.createRef();
    this.handleCancelAll = this.handleCancelAll.bind(this);
    this.showAction = this.showAction.bind(this);
    this.createTwoButtonAlert = this.createTwoButtonAlert.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onEditPressed = this.onEditPressed.bind(this);
    this.handleFilterForm = this.handleFilterForm.bind(this);
    this.handleShowFilter = this.handleShowFilter.bind(this);
    this.setFilterObj = this.setFilterObj.bind(this);
    this.awesomeChildListKeyExtractor = this.awesomeChildListKeyExtractor.bind(this);

    this.state = {
      selectedItem: {},
      activeType: 0,//open
      loading: true,
      openOrders: [],
      closedOrders: [],
      showFilterForm: false,

      page: 1,
      isFilter: false,
      isMore: false,
      filterData: [],
      filterObj: {},
    };
  }

  componentDidMount() {
    this.setState({
      openOrders: [],
      closedOrders: [],
    });
    this.connectOrderHub(this.props.gd, this.props.user.UserGuid);
  }

  componentWillUnmount() {
    const { connection } = this.props;

    connection.off("notifyOrdersLite");
    connection.off("notifyOrdersLiteAdd");
    connection.off("notifyOrdersLiteUpdate");
    connection.off("notifyOrdersLiteDelete");
  }

  connectOrderHub = (marketGuid, userGuid) => {
    const { connection } = this.props;

    // ORDER-HISTORY HUB
    connection.invoke("JoinOrderHistoryHubLiteGroupAsync", userGuid, marketGuid)
      .then(() => {
        console.log("JoinOrderHistoryHubLiteGroupAsync");
      })
      .catch(err => console.log("COULD NOT JoinOrderHistoryHubLiteGroupAsync - ", err));

    //ORDERS
    connection.on("notifyOrdersLite", (oOrders, cOrders) => {
      // console.log("notifyOrdersLite OPENS", oOrders.length, " ", cOrders.length);
      this.setState({ openOrders: oOrders || [], closedOrders: cOrders || [], loading: false });
    });

    connection.on("notifyOrdersLiteAdd", (oOrders, cOrders) => {
      // console.log("notifyOrdersLiteAdd oOrders - ", oOrders.length);
      // console.log("notifyOrdersLiteAdd cOrders  - ", cOrders.length);
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      this.setState(prevState => ({
        openOrders: oOrders && oOrders.length >= 1 ? [oOrders[0], ...prevState.openOrders] : prevState.openOrders,
        closedOrders: cOrders && cOrders.length >= 1 ? [cOrders[0], ...prevState.closedOrders] : prevState.closedOrders,
      }));
    });
    connection.on("notifyOrdersLiteUpdate", (oOrders, cOrders) => {
      // console.log("notifyOrdersUpdate - ", oOrders.length, " - ", cOrders.length);
    });
    connection.on("notifyOrdersLiteDelete", (oOrders, cOrders) => {
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      this.setState(prevState => ({
        "openOrders": prevState.openOrders.filter(itm => itm.og !== oOrders[0].og),
        "closedOrders": cOrders.length >= 1 ? [cOrders[0], ...prevState.closedOrders] : prevState.closedOrders,
      }));
    });


  };

  handleChangeOrderType = (orderType) => {

    if (this.state.isFilter) {
      // console.log(this.state.filterObj);
      this.setState({
        page: 1,
      }, () => {
        this.handleFilterForm({ ...this.state.filterObj, status: parseInt(orderType.value) === 0 ? "open" : "closed" });
      });
    } else {
      this.setState({
        activeType: orderType.value,
      });
    }

  };

  handleCancelAll = () => {
    const { language } = this.props;
    marketServices.cancelMarketOrders(this.props.gd).then((response) => {
      if (response && response.IsSuccess) {
        this.setState({ openOrders: [] });
        return DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "ORDERS_CANCELLED_SUCCESSFULLY"));
      }
    });
  };

  handleCancel = () => {
    const { language } = this.props;
    const { selectedItem, openOrders } = this.state;
    marketServices.cancelOrder(selectedItem.og).then((response) => {
      if (response.IsSuccess) {
        this.setState({
          openOrders: openOrders.filter(itm => itm.og !== selectedItem.og),
        });
        DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "YOUR_ORDER_CANCELLED"));
      }
    });
  };

  onEndReached = () => {
    if (!this.state.isFilter || !this.state.isMore) {
      return false;
    }


    this.setState({
      page: this.state.page + 1,
    }, () => this.handleFilterForm(this.state.filterObj));
    // console.log("onEndReached");
    // console.log(this.state.page, "-", this.state.isFilter);
  };

  createTwoButtonAlert = (selectedItem) => {
    const { language } = this.props;
    this.setState({ selectedItem });
    setTimeout(() => ActionSheetComProvider.show({
      title: getLang(language, "DO_YOU_WANT_TO_CANCEL_ORDER"),
      options: [getLang(language, "CANCEL_ORDER"), getLang(language, "CANCEL")],
      onAction: (index) => this.handleCancelApprove(index),
    }), 300);
  };

  handleCancelApprove = (index) => {
    if (index !== 0) {
      return null;
    }
    //TODO UPDATE HERE !!!
    if (Object.keys(this.state.selectedItem).length <= 0) {
      Alert.alert("Hata Kodu: 1521");
    } else {
      this.handleCancel();
    }

  };

  showAction() {
    const { language } = this.props;
    ActionSheetComProvider.show({
      title: getLang(language, "CANCEL_ALL_DESC"),
      options: [getLang(language, "CANCEL_ORDER"), getLang(language, "CANCEL")],
      onAction: (index) => index === 0 ? this.handleCancelAll() : null,
    });
  }

  handleAllOrders = () => navigationRef.current.navigate("OrderStack", {});


  awesomeChildListKeyExtractor = (_, i) => `market-tabs-index-${i}`;

  onEditPressed = () => this.setState({ showFilterForm: !this.state.showFilterForm });

  setFilterObj = () => console.log("setFilterObj");

  handleShowFilter = () => console.log("handleShowFilter");

  handleFilterForm = (obj) => {
    if (obj.clean) {
      return this.setState({
        isFilter: false,
        filterData: [],
      });
    }

    this.setState({
      activeType: obj.status === "closed" ? 1 : 0,
      isFilter: true,
      isMore: false,
      filterObj: obj,
    });

    const { page, filterData } = this.state;
    const url = `https://apiv2.coinpara.com/api/orders/${obj.status}/search?RowLimit=20&MarketGuid=${obj.MarketGuid}&Direction=${obj.Direction}&ConditionType=${obj.ConditionType}&PageNumber=${page}&DateFrom=${obj.from}&DateTo=${obj.to}`;

    console.log(" url - ", url);

    orderServices.search(url).then((response) => {
      if (response.IsSuccess) {
        const mappedResponse = response.Data.Orders.map(rec => {
          return {
            "fdp": rec.FromDecimalPoints,
            "tdp": rec.ToDecimalPoints,
            "eov": rec.ExecutedOrderValue,
            "egt": rec.ExecutedGeneralTotal,
            "eam": rec.ExecutedAmount,
            "fa": rec.FloatingAmount,
            "am": rec.Amount,
            "ts": rec.TimeStamp,
            "cf": rec.CoinFromCode,
            "ct": rec.CoinToCode,
            "ov": rec.OrderValue,
            "di": rec.Direction,
            "ty": rec.Type,
            "og": rec.Guid,
            "mg": rec.MarketGuid,
            "fe": rec.CommissionFee,
            "gt": rec.GeneralTotal,
          };
        });

        this.setState({
          filterData: page <= 1 ? mappedResponse : [...filterData, ...mappedResponse],
          isFilter: true,
          isMore: response.Data.Total > page * 20,
        });
      }
    });

  };

  render() {
    const { from, to, activeTheme, activeThemeKey, language } = this.props;
    const { activeType, isFilter, filterData, loading, openOrders, closedOrders, showFilterForm } = this.state;

    if (loading) {
      return <Loading />;
    }

    return (
      <>

        <View style={styles(activeTheme).wrap}>

          <View style={styles(activeTheme).wrapper}>
            <View style={[styles(activeTheme).types, { width: from && to ? "90%" : "100%" }]}>
              <AnimatedTab {...{
                // oLength: openOrders.length,
                // cLength: closedOrders.length,
                activeKey: activeType,
                headers: orderTypes,
                width: `50%`,
                filled: true,
                onChange: this.handleChangeOrderType,
              }} />

            </View>
            {
              from && to && <TouchableOpacity
                onPress={this.handleAllOrders}
                activeOpacity={.8}
                style={styles(activeTheme).list}>
                <TinyImage parent={"rest/"} name={"list-order"} style={styles(activeTheme).icon} />
              </TouchableOpacity>
            }

          </View>

          <CustomList
            contentStyle={{
              paddingBottom: (from && to) ? 60 : 120,
            }}
            borderGray={activeTheme.borderGray}
            data={isFilter ? filterData : activeType === 0 ? openOrders : closedOrders}
            keyExtractor={this.awesomeChildListKeyExtractor}
            itemHeight={100}
            renderItem={({ item, index }) => <MemoizedOrderItem
              key={index}
              item={item}
              handleCancel={this.createTwoButtonAlert}
              cancelAble={activeType === 0}
            />}
            renderEmpty={() => {
              return (
                <View style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: PADDING_BH * 2,
                  minHeight: !(from && to) ? SCREEN_HEIGHT / 1.2 : null,
                }}>
                  <EmptyContainer icon={"empty-coins"}
                                  text={getLang(language, from && to ? "NO_ORDER_FOUND_IN_MARKET" : "NO_ORDER_FOUND")} />
                </View>
              );
            }}
            onEndReached={this.onEndReached}
            // emptyMessage={getLang(language, from && to ? "NO_ORDER_FOUND_IN_MARKET" : "NO_ORDER_FOUND")}
          />


          {
            !(from && to) && <>


              <EditButton onPress={this.onEditPressed} />
              <FloatingAction isButton={false} />

            </>
          }
        </View>


        <OrdersFilter {...{
          parity: "",
          showFilter: showFilterForm,
          setShowFilter: this.onEditPressed,
          activeTheme,
          activeThemeKey,
          language,
          setFilterObj: this.setFilterObj,
          handleShowFilter: this.onEditPressed,
          handleFilterForm: this.handleFilterForm,
        }} />

      </>

    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.authenticationReducer.authenticated,
    user: state.authenticationReducer.user,
    orderHistories: state.orderHistoryReducer.orderHistories,
    wallets: state.walletReducer.wallets,
    connection: state.globalReducer.connection,
    activeTheme: state.globalReducer.activeTheme,
    activeThemeKey: state.globalReducer.activeThemeKey,
    language: state.globalReducer.language,
  };
}

export default connect(mapStateToProps, null)(React.memo(OrdersPure));


const styles = (props) => StyleSheet.create({
  wrap: {
    // paddingVertical: PADDING_V,
    paddingHorizontal: PADDING_H,
    flex: 1,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    height: 50,
  },
  types: {
    height: "100%",
    justifyContent: "center",
  },
  list: {
    width: "10%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    paddingBottom: 60,
  },
  icon: {
    width: 22,
    height: 22,
  },
});


// renderOpenOrders() {
//
//   const { openOrders } = this.state;
//
//   // console.log(openOrders[0]);
//   const { activeTheme, language, from, to } = this.props;
//
//   return (
//     openOrders.length >= 1 ? <ScrollView
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={styles(activeTheme).scroll}>
//
//       {openOrders.map((history, i) => {
//         return (
//           <MemoizedOrderItem
//             key={i}
//             item={history}
//             handleCancel={this.createTwoButtonAlert}
//             cancelAble={true}
//           />
//         );
//       })}
//
//     </ScrollView> : <View style={{
//       width: SCREEN_WIDTH - (PADDING_H * 2),
//       paddingTop: from && to ? 0 : SCREEN_WIDTH / 2,
//     }}>
//       <EmptyContainer icon={"empty-orders"} text={getLang(language, "NO_ORDER_FOUND")} />
//     </View>
//
//   );
// };

// renderClosedOrders = () => {
//   const { closedOrders } = this.state;
//   const { activeTheme, language, from, to } = this.props;
//   return (
//     closedOrders && closedOrders.length >= 1 ? <ScrollView
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={styles(activeTheme).scroll}>
//
//       {closedOrders.map((history, i) => {
//         return (
//           <MemoizedOrderItem
//             key={i}
//             item={history}
//             handleCancel={this.createTwoButtonAlert}
//             cancelAble={false}
//           />
//         );
//       })}
//
//     </ScrollView> : <View style={{
//       width: SCREEN_WIDTH - (PADDING_H * 2),
//       paddingTop: from && to ? 0 : SCREEN_WIDTH / 2,
//     }}>
//       <EmptyContainer icon={"empty-orders"} text={getLang(language, "NO_ORDER_FOUND")} />
//     </View>
//   );
// };
