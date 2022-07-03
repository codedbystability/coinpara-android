import React from "react";
import { StyleSheet } from "react-native";
import { DIMENSIONS } from "../../../../../utils/dimensions";
import { navigationRef } from "../../../../providers/RootNavigation";
import ModalProvider from "../../../../providers/ModalProvider";
import MarketSelectDetail from "../../../../components/page-components/market-select-detail";
import WalletTotal from "../../../../components/page-components/wallet-total";

class NonAuthHeader extends React.PureComponent {

  constructor(props) {
    super(props);
    this.handleNavigation = this.handleNavigation.bind(this);
    this.handleCoinSelected = this.handleCoinSelected.bind(this);
  }

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

  render() {
    const { authenticated, refreshing } = this.props;

    return (
      <>

        {
          authenticated && <WalletTotal refreshing={refreshing} />
        }
      </>
    );
  }
}


export default NonAuthHeader;

const styles = (props) => StyleSheet.create({
  wrapper: {
    width: "100%",
    height: DIMENSIONS.HEADER_HEIGHT,
    justifyContent: "flex-end",
    // marginTop: DIMENSIONS.PADDING_H,
  },
  content: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: DIMENSIONS.PADDING_H,
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
    height: 32,
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


/*
        <View style={styles(activeTheme).wrapper}>
          <View style={styles(activeTheme).content}>

            <View style={{
              width: authenticated ? "80%" : "90%",
              height: "100%",
              alignItems: "center",
              flexDirection: "row",
            }}>


              <Pressable onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                         style={{ paddingRight: 8, paddingVertical: 5 }}>
                <TinyImage style={styles(activeTheme).icon} parent={"rest/"} name={"drawer"} />
              </Pressable>

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

 */
