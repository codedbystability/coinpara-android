import React from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import PureItem from "../markets/item-pure";
import HomepageHeaders from "./components/headers";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { tabs } from "./constant";
import AnimatedTab from "../../../components/page-components/animated-tab";
import VersionModal from "../../../components/page-components/version-modal";
import TabNavigationHeader from "../../../components/page-components/tab-navigation-header";
import { getLang } from "../../../helpers/array-helper";
import TinyImage from "../../../tiny-image";
import { navigationRef } from "../../../providers/RootNavigation";
import ModalProvider from "../../../providers/ModalProvider";
import MarketSelectDetail from "../../../components/page-components/market-select-detail";
import CustomList from "../../../components/page-components/custom-list";


class Homepage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleMarketSelect = this.handleMarketSelect.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.getHeader = this.getHeader.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.state = {
      refreshing: false,
      activeTab: "TOP_GAINERS",
      grouped: [],
      count: 1,
      isSet: false,
      showModal: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ showModal: true });
    }, 2500);
  }

  handleTabChange = (tab) => {
    this.setState(prevState => {
      return {
        ...prevState,
        activeTab: tab.title,
      };
    });
  };

  awesomeChildListRenderItem = ({ item, index }) => {
    return (
      <PureItem {...{ item, index }} swipeAble={false} />
    );
  };

  awesomeChildListKeyExtractor = (_, i) => `market-tabs-index-${i}`;

  handleRefresh = () => {
    this.setState({
      refreshing: true,
    }, () => {
      setTimeout(() => {
        this.setState({ refreshing: false });
      }, 500);
    });
  };

  handleNavigation = (type) => navigationRef.current?.navigate(type);

  handleCoinSelected = (market) => {
    ModalProvider.hide();
    navigationRef.current.navigate("MarketDetail", { ...market });
  };

  handleMarketSelect = () => {
    ModalProvider.show(() => <MarketSelectDetail
      shouldFocus={true}
      handleSelect={this.handleCoinSelected} />, true);
  };

  onScroll(event) {
    const { nativeEvent } = event;
    const { contentOffset } = nativeEvent;
    const { y } = contentOffset;
    this.setState({
      offsetY: y,
    });
  }

  getHeader() {
    const {
      language,
      activeTheme,
      authenticated,
    } = this.props;


    return (
      <View style={styles(activeTheme).wrapper}>
        <View style={styles(activeTheme).content}>

          <View style={[styles(activeTheme).header2, {
            width: authenticated ? "80%" : "90%",
          }]}>


            <Pressable
              onPress={this.handleMarketSelect}
              style={[styles(activeTheme).input, {
                width: authenticated ? "88%" : "90%",
              }]}>
              <View style={styles(activeTheme).searchIcon}>
                <TinyImage parent={"rest/"} name={"search"} style={styles(activeTheme).icon2} />
              </View>
              <Text style={styles(activeTheme).txt}>
                {getLang(language, "SEARCH")}
              </Text>
            </Pressable>
          </View>


          <View style={[styles(activeTheme).inn, {
            width: authenticated ? "20%" : "10%",
          }]}>

            <Pressable
              style={{ padding: 5 }}
              onPress={() => this.handleNavigation(authenticated ? "AccountInformation" : "LoginRegister")}>
              <TinyImage style={styles(activeTheme).icon} parent={"rest/"} name={"user"} />
            </Pressable>

            {
              authenticated &&
              <Pressable onPress={() => this.handleNavigation("ScanScreen")}
                         style={{ padding: 5 }}>
                <TinyImage style={styles(activeTheme).icon} parent={"rest/"} name={"qr-login"} />
              </Pressable>
            }


          </View>

        </View>


      </View>
    );
  }

  render() {
    const {
      TOP_GAINERS,
      TOP_LOSERS,
      NEW,
      navigation,
      authenticated,
    } = this.props;
    const {
      activeTab,
      refreshing,
      showModal,
    } = this.state;


    const ruledMarkets = activeTab === "TOP_GAINERS" ? TOP_GAINERS : activeTab === "TOP_LOSERS" ? TOP_LOSERS : NEW;
    const {
      handleTabChange,
      awesomeChildListRenderItem,
      awesomeChildListKeyExtractor,
      getHeader,
    } = this;

    return (
      <>

        <TabNavigationHeader
          {...this.props}
          backAble={true}
          options={{
            presentation: "modal",
            title: getHeader,
          }}
        />


        <CustomList
          contentStyle={{
            marginTop: DIMENSIONS.PADDING_H,
          }}
          borderGray={"transparent"}
          data={ruledMarkets}
          renderItem={awesomeChildListRenderItem}
          keyExtractor={awesomeChildListKeyExtractor}
          showFooter={false}
          itemHeight={DIMENSIONS.LIST_ITEM_HEIGHT}
          onEndReached={null}
          refreshControl={<RefreshControl
            refreshing={refreshing}
            onRefresh={this.handleRefresh}
            tintColor={"#bdbdbd"}
          />}
          ListHeaderComponent={
            <>
              <HomepageHeaders
                {...{
                  authenticated,
                  navigation,
                  refreshing,
                }}
              />

              <View style={{ paddingHorizontal: DIMENSIONS.PADDING_H }}>
                <AnimatedTab {...{
                  activeKey: activeTab,
                  headers: tabs,
                  width: `33%`,
                  filled: true,
                  onChange: handleTabChange,
                }} />
              </View>
            </>
          }
        />

        {
          showModal && <VersionModal />
        }
      </>
    );


  }
}


function mapStateToProps(state) {
  const { TOP_GAINERS, TOP_LOSERS, NEW } = state.marketReducer;
  const { language, activeTheme } = state.globalReducer;
  const { authenticated } = state.authenticationReducer;
  return {
    TOP_GAINERS, TOP_LOSERS, NEW, language, activeTheme, authenticated,
  };
}

const mapDispatchToProps = dispatch => ({ dispatch });
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(styledHigherOrderComponents(Homepage)));


const styles = (props) => StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  content: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingTop: 10,
    height: DIMENSIONS.HEADER_HEIGHT,
    paddingHorizontal: DIMENSIONS.PADDING_H,
  },
  header2: {
    height: "100%",
    alignItems: "flex-end",
    paddingBottom: 2,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  welcome: {
    fontFamily: "CircularStd-Bold",
    fontSize: DIMENSIONS.BIG_TITLE_FONTSIZE,
    color: props.appWhite,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
  icon2: {
    width: 16,
    height: 16,
  },
  logo: {
    width: 30,
    height: 28,
    tintColor: props.appWhite,
  },
  inn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  input: {
    height: 28,
    backgroundColor: props.darkBackground,
    borderRadius: 8,
    paddingHorizontal: DIMENSIONS.PADDING_H / 2,
    alignItems: "center",
    flexDirection: "row",
  },
  txt: {
    color: props.appWhite,
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
  },
  searchIcon: { paddingHorizontal: 10 },

});
