import React from "react";
import { Pressable, Text, View } from "react-native";

import DynamicImage from "../../../components/page-components/dynamic-image";
import styles from "./styles";
import { connect } from "react-redux";
import MarketChart from "./chart";
import { formatMoney, nFormatter } from "../../../helpers/math-helper";
import { navigationRef } from "../../../providers/RootNavigation";
import HapticProvider from "../../../providers/HapticProvider";
import ModalProvider from "../../../providers/ModalProvider";
import LocalStorage from "../../../providers/LocalStorage";

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
      const exist = storedArray.find(localItem => localItem.to === market.to);
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
      item, index, activeTheme, fontSizes, swipeAble = true,
    } = this.props;
    return (
      <View
        key={index}
        style={{ backgroundColor: index % 2 !== 0 ? activeTheme.darkBackground : activeTheme.backgroundApp }}>
        <Pressable
          style={({ pressed }) => [styles(activeTheme).oddContainer, {
            backgroundColor: pressed ? activeTheme.borderGray : index % 2 !== 0 ? activeTheme.darkBackground : "transparent",
          }]}
          onPress={this.handleDetailNavigation}>

          <View style={styles(activeTheme).leftWrapper}>
            <View style={styles(activeTheme).leftWrapperContainer}>
              {
                item && item.in && <View style={styles(activeTheme).newWrapper}>

                </View>
              }
              <DynamicImage style={styles(activeTheme).image} market={item.to} />
            </View>
            <View>
              <Text style={styles(activeTheme, fontSizes).title}
                    adjustsFontSizeToFit={true}>{item.to}

                <Text style={{
                  color: activeTheme.secondaryText,
                  fontFamily: "CircularStd-Book",
                  fontSize: fontSizes.NORMAL_FONTSIZE,
                }}> /{item.fs}</Text>
              </Text>

              <Text style={styles(activeTheme, fontSizes).description}>{nFormatter(item.vd, 4)}</Text>
            </View>

          </View>

          <View style={styles(activeTheme).middleWrapper}>
            <MarketChart market={item} />
          </View>

          <View
            style={styles(activeTheme).rightWrapper}>

            <Text numberOfLines={1} style={[styles(activeTheme, fontSizes).title, { textAlign: "right" }]}>
              {
                formatMoney(item.pr, item.fdp)
              }
            </Text>

            <Text numberOfLines={1}
                  style={item.cp < 0 ? styles(activeTheme, fontSizes).negative : styles(activeTheme, fontSizes).positive}>
              {/*{*/}
              {/*  item.cd.toFixed(2)*/}
              {/*}*/}
              % {
              item.cp.toFixed(2)
            }
            </Text>
          </View>
        </Pressable>
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


