import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

import DynamicImage from "../../../components/dynamic-image";
import styles from "./styles";
import marketServices from "../../../services/market-services";
import { setIsFavorite } from "../../../actions/market-actions";
import { connect } from "react-redux";
import DropdownAlert from "../../../providers/DropdownAlert";
import { getLang } from "../../../helpers/array-helper";
import MarketChart from "./chart";
import { formatMoney, nFormatter } from "../../../helpers/math-helper";
import { navigationRef } from "../../../providers/RootNavigation";
import HapticProvider from "../../../providers/HapticProvider";
import ModalProvider from "../../../providers/ModalProvider";
import LocalStorage from "../../../providers/LocalStorage";
import TinyImage from "../../../tiny-image";

const refRow = [];
let lastIndex = false;
let prevOpenedRow = null;

class ListItemPure extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleDetailNavigation = this.handleDetailNavigation.bind(this);
    this.closeRow = this.closeRow.bind(this);
    this.state = {
      loadings: [],
    };
  }

  updateButtonPress(index) {
    HapticProvider.trigger();
    this.handleFav(index);
  }

  rightActions(index) {

    const { loadings } = this.state;
    const { activeTheme, item } = this.props;
    return (
      <Pressable
        onPress={() => this.updateButtonPress(index)}
        style={[styles(activeTheme).rightActionOddWrapper,
          index % 2 !== 0 && { backgroundColor: activeTheme.darkBackground }]}>
        {
          loadings.includes(index) ? <ActivityIndicator color={activeTheme.appWhite} /> :
            <TinyImage parent={"rest/"} name={item.if ? "fav-active" : "fav"} style={styles(activeTheme).icon} />
        }

      </Pressable>
    );
  };

  handleFav(index) {
    const { authenticated, item, language, dispatch } = this.props;
    const { loadings } = this.state;

    if (!authenticated) {
      return DropdownAlert.show("error", getLang(language, "ERROR"), getLang(language, "PLEASE_SIGNIN_OR_CREATE_ACCOUNT"));
    }
    this.setState({ loadings: [...loadings, index] });
    if (item.if) {
      marketServices.removeFavorite({ MarketGuid: item.gd }).then((response) => {
        setTimeout(() => this.setState({ loadings: loadings.filter(itm => itm !== index) }), 500);
        if (response.IsSuccess) {
          return dispatch(setIsFavorite(false, item.gd));
        }
      });
    } else {
      marketServices.addFavorite({ MarketGuid: item.gd }).then((response) => {
        setTimeout(() => this.setState({ loadings: loadings.filter(itm => itm !== index) }), 500);
        if (response.IsSuccess) {
          return dispatch(setIsFavorite(true, item.gd));
        }
      });
    }
  };

  handleDetailNavigation() {
    HapticProvider.trigger();

    if (this.props.modalShown && this.props.modalShown === true) {
      ModalProvider.hide();
    }
    const { item } = this.props;
    this.handleMarketSelect(item);
  }

  closeAll = () => prevOpenedRow && prevOpenedRow.close();

  closeRow = () => {
    const {
      index,
    } = this.props;
    if (prevOpenedRow) {
      if (index !== lastIndex) {

        prevOpenedRow.close();
        prevOpenedRow = null;
      }
    }
    lastIndex = index;
    prevOpenedRow = refRow[index];
  };

  handleMarketSelect = (market) => {
    const { searchText = null } = this.props;
    if (searchText) {
      const storedArray = LocalStorage.getArray("marketsLocal");
      const exist = storedArray.find(localItem => localItem.gd === market.gd);
      if (!exist) {
        const newItem = {
          to: market.to,
          fs: market.fs,
          gd: market.gd,
        };
        const newArray = [newItem].concat(storedArray); // [ 4, 3, 2, 1 ]
        LocalStorage.storeObject("marketsLocal", newArray.slice(0, 10));
      }
    }
    navigationRef.current.navigate("MarketDetail", { ...market });
  };


  render() {
    const {
      item, index, activeTheme,fontSizes, language, swipeAble = true,
    } = this.props;

    return (
      <View style={{ backgroundColor: index % 2 !== 0 ? activeTheme.darkBackground : activeTheme.backgroundApp }}>
        <Swipeable
          renderRightActions={() => swipeAble ? this.rightActions(index) : null}
          key={index}
          ref={ref => refRow[index] = ref}
          onSwipeableOpen={this.closeRow}
        >

          <Pressable
            style={({ pressed }) => [styles(activeTheme).oddContainer, {
              backgroundColor: pressed ? activeTheme.borderGray : index % 2 !== 0 ? activeTheme.darkBackground : "transparent",
            }]}
            onPress={this.handleDetailNavigation}>

            <View style={styles(activeTheme).leftWrapper}>
              <View style={styles(activeTheme).leftWrapperContainer}>
                {
                  item && item.in && <View style={styles(activeTheme).newWrapper}>
                    <Text style={styles(activeTheme,fontSizes).newText}>
                      {getLang(language, "NEW", "NEW").toUpperCase()}
                    </Text>
                  </View>
                }
                <DynamicImage style={styles(activeTheme).image} market={item.to} />
              </View>
              <View>
                <Text style={styles(activeTheme,fontSizes).title} adjustsFontSizeToFit={true}>{item.to}/{item.fs}</Text>

                <Text style={styles(activeTheme,fontSizes).description}>{nFormatter(item.vd, 4)}</Text>
              </View>

            </View>

            <View style={styles(activeTheme).middleWrapper}>
              <MarketChart market={item} />
            </View>

            <View
              style={styles(activeTheme).rightWrapper}>

              <Text numberOfLines={1} style={[styles(activeTheme,fontSizes).title, { textAlign: "right" }]}>
                {
                  formatMoney(item.pr, item.fdp)
                }
              </Text>

              <Text numberOfLines={1}
                    style={item.cp < 0 ? styles(activeTheme,fontSizes).negative : styles(activeTheme,fontSizes).positive}>
                {
                  item.cd.toFixed(2)
                }
                (%{
                item.cp.toFixed(2)
              })
              </Text>


            </View>
          </Pressable>
        </Swipeable>
      </View>

    );
  }

}

function mapStateToProps(state) {
  const { fontSizes, activeTheme, language } = state.globalReducer;
  return {
    fontSizes, activeTheme, language,
    authenticated: state.authenticationReducer.authenticated,
  };
}

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(ListItemPure);


