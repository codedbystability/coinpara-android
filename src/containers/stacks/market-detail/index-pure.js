import React from "react";
import {
  BackHandler,
  InteractionManager,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from "react-native";
import { connect } from "react-redux";
import marketServices from "../../../services/market-services";
import { DIMENSIONS } from "../../../../utils/dimensions";
import {
  setIsFavorite,
  setLatestTicker,
  setSelectedMarketGuid,
} from "../../../actions/market-actions";
import Loading from "../../../components/page-components/loading";
import AnimatedSheet from "./components/animated-sheet";
import ChartHeader from "./components/chart-header";
import MarketDetailChart from "./components/chart";
import ChartIntervals from "./components/intervals";
import MarketDetailHeader from "./components/header";
import { navigationRef } from "../../../providers/RootNavigation";
import MarketDetailTabsIndex from "./tabs/index";
import Orientation from "react-native-orientation";
import AnimatedTab from "../../../components/page-components/animated-tab";
import { tabs } from "./constants";
import LocalStorage from "../../../providers/LocalStorage";
import IdleTimerManager from "react-native-idle-timer";
import ModalProvider from "../../../providers/ModalProvider";
import MarketSelectDetail from "../../../components/page-components/market-select-detail";
import HapticProvider from "../../../providers/HapticProvider";
import * as Animatable from "react-native-animatable";


class MarketDetailPure extends React.PureComponent {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.contentRef = React.createRef();

    this.handleDetail = this.handleDetail.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.handleHeaderAction = this.handleHeaderAction.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.setFullscreen = this.setFullscreen.bind(this);
    this.removeFav = this.removeFav.bind(this);
    this.addFav = this.addFav.bind(this);
    this.setActiveInterval = this.setActiveInterval.bind(this);
    this.setActiveChart = this.setActiveChart.bind(this);
    this.handleShowMarketList = this.handleShowMarketList.bind(this);
    this.state = {
      activeTab: "market",
      activeInterval: "60",
      activeChart: "candle",
      market: {},
      selectedOrder: {},
      marketInfo: {},
      selectedType: "",
      fullscreen: false,
      hidden: true,
      showOrderForm: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const { route, dispatch, marketsWithKey } = this.props;

    const storedInterval = LocalStorage.getItem("storedInterval");
    if (storedInterval && storedInterval !== this.state.activeInterval) {
      this.setState({ activeInterval: storedInterval });
    }

    setTimeout(() => {
      this.setState({ showOrderForm: true });
    }, 2000);

    if (route.params && route.params && route.params.parity) {
      const parity = route.params.parity;
      const from = parity.split("-")[0];
      const to = parity.split("-")[1];
      const marketKey = Object.keys(marketsWithKey).find(key => marketsWithKey[key].fs === from && marketsWithKey[key].to === to);
      const market = marketsWithKey[marketKey];
      if (market) {
        dispatch(setSelectedMarketGuid(market.gd));
        this.setState({ market });
        this.setMarketInformation(market);
      }
    } else {
      dispatch(setSelectedMarketGuid(route.params.gd));
      this.setState({ market: this.props.route.params });
      this.setMarketInformation(this.props.route.params);
    }


    if (LocalStorage.getItem("userIdle")) {
      IdleTimerManager.setIdleTimerDisabled(true);
    }
    InteractionManager.runAfterInteractions(() => this.setState({ hidden: false }));
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    let userIdle = LocalStorage.getItem("userIdle");
    if (userIdle) {
      IdleTimerManager.setIdleTimerDisabled(false);
    }

    dispatch(setSelectedMarketGuid(null));
    dispatch(setLatestTicker({}));


    this._isMounted = false;
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);

  }

  setMarketInformation(mrkt) {
    marketServices.getMarketInfo(mrkt.fs, mrkt.to).then((res) => {
      if (res && res.IsSuccess) {
        this.setState({ marketInfo: res.Data });
      }
    });
  };

  handleBackButton() {
    this.preventGoBack();
    return true;
  };

  handleChangeTab(item) {
    this.setState({ activeTab: item.key });
  }

  handleHeaderAction(type) {
    const { authenticated } = this.props;
    const { market } = this.state;
    if (type === "alert") {
      return navigationRef.current.navigate("CreateAlarm", {
        market,
      });
    } else if (type === "favorite") {
      if (!authenticated) {
        return
      }
      if (market.if) {
        return this.removeFav(market);
      }
      return this.addFav(market);
    }
  };

  removeFav(market) {
    marketServices.removeFavorite({ MarketGuid: market.gd }).then((response) => {
      if (response && response.IsSuccess) {
        this.props.dispatch(setIsFavorite(false, market.gd));
        this.setState(prevState => ({
          market: {
            ...prevState.market,
            if: false,
          },
        }));
      }
    });
  };

  addFav(market) {
    marketServices.addFavorite({ MarketGuid: market.gd }).then((response) => {
      if (response && response.IsSuccess) {
        this.props.dispatch(setIsFavorite(true, market.gd));
        this.setState(prevState => ({
          market: {
            ...prevState.market,
            if: true,
          },
        }));
      }
    });
  };

  handleDetail(order, type) {
    this.setState({
      selectedOrder: order,
      selectedType: type,
    });
  };

  preventGoBack() {
    navigationRef.current.canGoBack() && navigationRef.current.goBack();
  }

  setFullscreen() {
    if (!this.state.fullscreen) {
      Orientation.lockToLandscapeRight();
    } else {
      Orientation.lockToPortrait();
    }
    this.setState({ fullscreen: !this.state.fullscreen });
  }

  setActiveChart(chart) {
    this.setState({ activeChart: chart });
  }

  setActiveInterval(interval) {
    this.setState({ activeInterval: interval });
  }

  handleCoinSelected(item) {
    const { dispatch, marketsWithKey } = this.props;

    const marketKey = Object.keys(marketsWithKey).find(key => marketsWithKey[key].gd === item.gd);
    const market = marketsWithKey[marketKey];

    if (market) {
      dispatch(setSelectedMarketGuid(market.gd));
      this.setState({ market });
      this.setMarketInformation(market);
    }

    ModalProvider.hide();
  }

  handleShowMarketList() {
    HapticProvider.trigger();
    ModalProvider.show(() => <MarketSelectDetail handleSelect={(item) => this.handleCoinSelected(item)} />, true);
  }


  render() {
    const {
      market, activeTab, marketInfo,
      fullscreen, activeChart, activeInterval,
      selectedOrder, selectedType, hidden,
      showOrderForm,
    } = this.state;

    const { activeTheme } = this.props;

    const {
      handleHeaderAction, preventGoBack, handleChangeTab, handleShowMarketList,
      handleDetail, setFullscreen, setActiveChart, setActiveInterval,
    } = this;

    if (hidden || !market || Object.keys(market).length <= 0) {
      return <View style={{ height: "100%", backgroundColor: activeTheme.backgroundApp }}>
        <Loading />
      </View>;
    }

    if (fullscreen) {
      return <View style={{ height: "100%", backgroundColor: activeTheme.backgroundApp }}>
        <View style={[styles(activeTheme).chartWrapper, { height: "84%" }]}>
          <MarketDetailChart
            full={true}
            market={market}
            type={activeChart}
            interval={activeInterval}
          />
        </View>
        <ChartIntervals {...{
          fullscreen,
          setFullscreen,
          activeInterval,
          activeChart,
          activeTheme,
          setActiveChart,
          setActiveInterval,
        }} />
      </View>;
    }
    return (
      <View style={{ backgroundColor: activeTheme.backgroundApp, flex: 1 }}>
        <MarketDetailHeader{...{
          handleShowMarketList,
          handleHeaderAction,
          preventGoBack,
          market,
          ...this.props,
        }} />


        <View style={{ height: "40%", backgroundColor: activeTheme.darkBackground }}>

          <ChartHeader{...{
            precision: market.fdp,
            gd: market.gd,
          }} />

          <View style={styles(activeTheme).chartWrapper}>
            <MarketDetailChart
              market={market}
              type={activeChart}
              interval={activeInterval}
            />
          </View>

          <ChartIntervals {...{
            fullscreen,
            setFullscreen,
            activeInterval,
            activeChart,
            activeTheme,
            setActiveChart,
            setActiveInterval,
          }} />
        </View>


        <View style={{ paddingHorizontal: DIMENSIONS.PADDING_H, marginVertical: DIMENSIONS.PADDING_H }}>
          <AnimatedTab {...{
            filled: true,
            activeKey: activeTab,
            headers: tabs,
            width: "20%",
            onChange: handleChangeTab,
          }} />
        </View>

        <MarketDetailTabsIndex
          {...{
            ref: this.contentRef,
            activeTab,
            market,
            marketInfo,
            handleDetail,
          }} />

        {
          showOrderForm &&
          <KeyboardAvoidingView
            keyboardVerticalOffset={40}
            behavior={"padding"}>
            <Animatable.View easing={"ease"} animation={"fadeInUp"}>
              <AnimatedSheet
                {...{
                  market,
                  marketInfo,
                  selectedOrder,
                  selectedType,
                  getLastTickerParent: () => this.contentRef.current?.getLatestTicker(),
                }}
              />
            </Animatable.View>
          </KeyboardAvoidingView>
        }

      </View>
    );
  }
}


function mapStateToProps(state) {
  return {
    marketsWithKey: state.marketReducer.marketsWithKey,
    user: state.authenticationReducer.user,
    authenticated: state.authenticationReducer.authenticated,
    activeTheme: state.globalReducer.activeTheme,
  };
}

const mapDispatchToProps = dispatch => ({
  dispatch,
});

const MarketDetailPure2 = connect(mapStateToProps, mapDispatchToProps)(React.memo(MarketDetailPure));
export default MarketDetailPure2;

const styles = (props) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: props.darckBackground,
  },
  chartContainer: {
    width: "100%",
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },

  contentContainer: {
    width: "100%",
  },
  scrollViewContainer: {
    paddingBottom: 120,
  },


  headerRightWrapper: {
    position: "absolute",
    right: 10,
    bottom: 0,
    alignItems: "center",
    justifyContent: "space-between",
    // borderRadius: 8,
    // paddingHorizontal: 6,
    flexDirection: "row",
    // width: 70,
    // paddingVertical: 4,
  },

  alert: {
    width: DIMENSIONS.NORMAL_IMAGE * 0.6,
    height: DIMENSIONS.NORMAL_IMAGE * 0.6,
    tintColor: props.appWhite,
  },
  chartWrapper: {
    width: "100%",
    height: "70%",
    backgroundColor: props.backgroundApp,
  },
});
