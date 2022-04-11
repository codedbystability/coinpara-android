import React from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { FlatList, RefreshControl, View } from "react-native";
import { connect } from "react-redux";
import PureItem from "../markets/item-pure";
import HomepageHeaders from "./components/headers";
import { LIST_ITEM_HEIGHT, PADDING_H } from "../../../../utils/dimensions";
import { tabs } from "./constant";
import AnimatedTab from "../../../components/animated-tab";
import LocalStorage from "../../../providers/LocalStorage";
import VersionModal from "../../../components/version-modal";


class Homepage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      activeTab: "TOP_GAINERS",
      grouped: [],
      count: 1,
      isSet: false,
    };
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

  awesomeChildListKeyExtractor = (item, i) => `market-tabs-index-${i}`;

  getItemLayout = (data, index) => ({ length: LIST_ITEM_HEIGHT, offset: LIST_ITEM_HEIGHT * index, index });

  handleRefresh = () => {
    this.setState({
      refreshing: true,
    }, () => {
      setTimeout(() => {
        this.setState({ refreshing: false });
      }, 1000);
    });
  };

  render() {
    const {
      TOP_GAINERS,
      TOP_LOSERS,
      NEW,
      language,
    } = this.props;
    const {
      activeTab,
      refreshing,
    } = this.state;

    const ruledMarkets = activeTab === "TOP_GAINERS" ? TOP_GAINERS : activeTab === "TOP_LOSERS" ? TOP_LOSERS : NEW;
    const {
      handleTabChange,
      awesomeChildListRenderItem,
      awesomeChildListKeyExtractor,
      getItemLayout,
      handleRefresh,
    } = this;

    return (
      <>
        <FlatList
          style={{
            paddingTop: 8,
          }}
          refreshControl={<RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={"#bdbdbd"}
          />}
          contentContainerStyle={{ paddingTop: 16 }}
          ListHeaderComponent={
            <>
              <HomepageHeaders refreshing={refreshing} />

                <View style={{ paddingHorizontal: PADDING_H, marginVertical: PADDING_H }}>
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
          showsVerticalScrollIndicator={false}
          data={ruledMarkets}
          renderItem={awesomeChildListRenderItem}
          keyExtractor={awesomeChildListKeyExtractor}
          getItemLayout={getItemLayout}
          // onRefresh={handleRefresh}
          // refreshing={refreshing}
        />
        <VersionModal />
      </>

    );
  }
}


function mapStateToProps(state) {
  const { TOP_GAINERS, TOP_LOSERS, NEW } = state.marketReducer;
  const { language } = state.globalReducer;
  return {
    TOP_GAINERS, TOP_LOSERS, NEW, language,
  };
}

const mapDispatchToProps = dispatch => ({ dispatch });
export default connect(mapStateToProps, mapDispatchToProps)


(React.memo(styledHigherOrderComponents(Homepage)));



