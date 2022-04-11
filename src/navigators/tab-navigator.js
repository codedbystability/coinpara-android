import * as React from "react";
import { BottomTabBar, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MarketsScreen from "../containers/tabs/markets";
import TradeScreen from "../containers/tabs/trade";
import WalletScreen from "../containers/tabs/wallet";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import SettingsScreen from "../containers/tabs/settings";
import HomepageScreen from "../containers/tabs/homepage";
import { useSelector } from "react-redux";
import { NORMAL_FONTSIZE } from "../../utils/dimensions";
import { getLang } from "../helpers/array-helper";
import { isIphoneX } from "../../utils/devices";
import HapticProvider from "../providers/HapticProvider";
import TinyImage from "../tiny-image";


const Tab = createBottomTabNavigator();


const CustomTabBar = (props) => {
  const { activeTheme } = props;
  return (
    <View style={styles(activeTheme).tabInner}>
      <BottomTabBar{...props} />
    </View>
  );
};

const TabButton = (props) => {
  const { item, activeTheme, language, accessibilityState, onPress } = props;
  const focused = accessibilityState.selected;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}
                      style={styles(activeTheme).container}>

      <View style={styles(activeTheme).btn}>
        <TinyImage
          style={styles(activeTheme).img}
          parent={"tabs/"} name={focused ? item.icon + "-active" : item.icon} />
      </View>


      {
        <Text
          style={[styles(activeTheme, focused).text]}>
          {getLang(language, item.labelKey)}
        </Text>
      }


    </TouchableOpacity>
  );
};

const NestedTabNavigator = () => {
  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const tabItems = [
    {
      id: 1,
      name: "Homepage",
      labelKey: "HOME",
      component: HomepageScreen,
      icon: "homepage",
    },
    {
      id: 1,
      name: "Markets",
      labelKey: "MARKETS",
      component: MarketsScreen,
      icon: "markets",

    },
    {
      id: 3,
      name: "Trade",
      labelKey: "TRADE",
      component: TradeScreen,
      icon: "trade",

    },
    {
      id: 4,
      name: "Wallet",
      labelKey: "WALLET",
      component: WalletScreen,
      icon: "wallet",

    },
    {
      id: 5,
      name: "Settings",
      labelKey: "SETTINGS",
      component: SettingsScreen,
      icon: "settings",

    },
  ];

  return (
    <Tab.Navigator

      tabBar={(props) => <CustomTabBar {...props} activeTheme={activeTheme} />}
      screenOptions={{
        tabBarStyle: styles(activeTheme).tabStyle,
      }}
    >
      {
        tabItems.length >= 1 && tabItems.map(tabItem => <Tab.Screen
          //TODO ANDROID REMOVE!!!
          listeners={({ navigation, route }) => ({
            tabPress: e => HapticProvider.trigger(),
          })}

          options={{
            // tabBarHideOnKeyboard: true
            headerShown: false,
            tabBarButton: (props) => <TabButton
              {...props}
              language={language}
              item={tabItem}
              activeTheme={activeTheme} />,
          }}
          name={tabItem.name} component={tabItem.component} key={tabItem.id} />)
      }
    </Tab.Navigator>
  );
};

export default NestedTabNavigator;

const styles = (props, focused) => StyleSheet.create({
  text: {
    color: focused ? props.tabActive : props.borderGray,
    fontSize: NORMAL_FONTSIZE - 1,
    fontFamily: "CircularStd-Book",
  },
  activeText: {
    color: props.appWhite,
    fontSize: NORMAL_FONTSIZE - 1,
    fontFamily: "CircularStd-Book",
  },
  tabStyle: {
    elevation: 0,
    backgroundColor: "transparent",
    borderTopColor: props.borderGray,
    borderTopWidth: .4,
    // zIndex: 9999998,
    alignItems: "center",
    justifyContent: "center",
    height: isIphoneX ? 70 : 60,

  },
  button: { flex: 1, alignItems: "center", justifyContent: "center" },
  btn: {
    width: 40,
    height: 40,
    // borderRadius: 25,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 25,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },

  tabInner: {
    backgroundColor: props.backgroundApp,
  },
  img: {
    height: 22,
    width: 22,
  },
});
