import * as React from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import { MemoizedOrderItem } from "./item";
import marketServices from "../../../services/market-services";
import EmptyContainer from "../../../components/empty-container";
import { PADDING_H, PADDING_V, SCREEN_WIDTH } from "../../../../utils/dimensions";
import DropdownAlert from "../../../providers/DropdownAlert";
import { getLang } from "../../../helpers/array-helper";
import { navigationRef } from "../../../providers/RootNavigation";
import Loading from "../../../components/loading";
import ActionSheetComProvider from "../../../providers/ActionSheetComProvider";
import AnimatedTab from "../../../components/animated-tab";
import TinyImage from "../../../tiny-image";

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

    this.state = {
      selectedItem: {},
      activeType: 0,
      loading: true,
      openOrders: [],
      closedOrders: [],
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
      this.setState({ openOrders: oOrders ? oOrders : [], closedOrders: cOrders ? cOrders : [], loading: false });
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

  handleChangeOrderType = (orderType) => this.setState({ activeType: orderType.value });

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
      }
      DropdownAlert.show(response.IsSuccess ? "success" : "error", getLang(language, response.IsSuccess ? "SUCCESS" : "ERROR"), getLang(language, response.IsSuccess ? "YOUR_ORDER_CANCELLED" : "AN_UNKNOWN_ERROR_OCCURED"));
    });
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
    if (Object.keys(this.state.selectedItem).length <= 0) {
      // this.handleCancelAll();
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

  handleAllOrders = () => navigationRef.current.navigate("Orders");

  renderOpenOrders() {

    const { openOrders } = this.state;

    // console.log(openOrders[0]);
    const { activeTheme, language, from, to } = this.props;

    return (
      openOrders.length >= 1 ? <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles(activeTheme).scroll}>

        {openOrders.map((history, i) => {
          return (
            <MemoizedOrderItem
              key={i}
              item={history}
              handleCancel={this.createTwoButtonAlert}
              cancelAble={true}
            />
          );
        })}

      </ScrollView> : <View style={{
        width: SCREEN_WIDTH - (PADDING_H * 2),
        paddingTop: from && to ? 0 : SCREEN_WIDTH / 2,
      }}>
        <EmptyContainer icon={"empty-orders"} text={getLang(language, "NO_ORDER_FOUND")} />
      </View>

    );
  };

  renderClosedOrders = () => {
    const { closedOrders } = this.state;
    const { activeTheme, language, from, to } = this.props;
    return (
      closedOrders && closedOrders.length >= 1 ? <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles(activeTheme).scroll}>

        {closedOrders.map((history, i) => {
          return (
            <MemoizedOrderItem
              key={i}
              item={history}
              handleCancel={this.createTwoButtonAlert}
              cancelAble={false}
            />
          );
        })}

      </ScrollView> : <View style={{
        width: SCREEN_WIDTH - (PADDING_H * 2),
        paddingTop: from && to ? 0 : SCREEN_WIDTH / 2,
      }}>
        <EmptyContainer icon={"empty-orders"} text={getLang(language, "NO_ORDER_FOUND")} />
      </View>
    );
  };

  render() {
    const { from, to, activeTheme } = this.props;
    const { activeType, loading, openOrders, closedOrders } = this.state;

    if (loading) {
      return <Loading />;
    }

    return (
      <View style={{
        paddingVertical: PADDING_V,
        paddingHorizontal: PADDING_H,
        flex: 1,
      }}>

        <View style={styles(activeTheme).wrapper}>
          <View style={[styles(activeTheme).types, { width: from && to ? "90%" : "100%" }]}>
            <AnimatedTab {...{
              oLength: openOrders.length,
              cLength: closedOrders.length,
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


        {
          activeType === 0 ? this.renderOpenOrders() : this.renderClosedOrders()
        }
      </View>
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
    language: state.globalReducer.language,
  };
}

export default connect(mapStateToProps, null)(React.memo(OrdersPure));


const styles = (props) => StyleSheet.create({
  wrapper: {
    // padding: 20,
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
    paddingBottom: 100,
  },
  icon: {
    width: 22,
    height: 22,
  },
});
