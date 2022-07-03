import React, { useCallback } from "react";
import NavigationListItem from "../../../../../components/page-components/navigation-list-item";
import { DIMENSIONS } from "../../../../../../utils/dimensions";
import StillLogo from "../../../../../components/page-components/still-logo";
import { View } from "react-native";

const AUTH_ITEMS = [
  {
    id: 77,
    key: "HOME",
    type: "navigation",
    page: "Tab",
    image: "home",
    activePages: ["HomeStack", "MarketsStack", "TradeStack", "WalletStack"],

  },
  {
    id: 7,
    key: "ACCOUNT_APPROVE",
    type: "navigation",
    page: "AccountApprove",
    image: "settings",
    activePages: ["AccountApprove"],

  },
  {
    id: 0,
    key: "NOTIFICATIONS",
    type: "navigation",
    page: "Notifications",
    image: "notifications",
    activePages: ["Notifications"],

  },
  {
    id: 1,
    key: "ORDERS",
    type: "navigation",
    title: "MY_ORDERS",
    page: "OrderStack",
    image: "orders",
    activePages: ["Orders"],

  },
  {
    id: 2,
    key: "USER_ACTIVITIES",
    type: "navigation",
    page: "UserLogs",
    image: "user-activities",
    activePages: ["UserLogs"],

  },

  {
    id: 4,
    key: "SECURITY_SETTINGS",
    type: "navigation",
    page: "SettingsSecurity",
    param: "security",
    image: "about-us",
    activePages: ["SecuritySettings"],


  },
  {
    id: 5,
    key: "SYSTEM_SETTINGS",
    type: "navigation",
    page: "SettingsSystem",
    image: "system-settings",
    param: "system",
    activePages: ["SettingsSystem"],

  },

  {
    id: 8,
    key: "REFER_A_FRIEND",
    type: "navigation",
    page: "InviteFriends",
    image: "ref",
    activePages: ["InviteFriends"],

  },

  {
    id: 18,
    key: "SUPPORT_CENTER",
    type: "navigation",
    page: "HelpCenter",
    image: "support-center",
    activePages: ["HelpCenterInner"],
  },
  {
    id: 28,
    key: "HELP_CENTER",
    type: "navigation",
    page: "SupportCenter",
    image: "help-center",
    activePages: ["SupportCenterInner"],
  },
  {
    id: 6,
    key: "ABOUT_US",
    type: "navigation",
    page: "AboutInner",
    image: "settings",
    activePages: ["About"],

  },
  {
    id: 9,
    key: "VIDEO_MANAGEMENT",
    type: "modal",
    page: "VideoListItem",
    image: "video",
    activePages: [],

  },
  {
    id: 3,
    key: "CONTACT_SUPPORT",
    type: "modal",
    page: "Static",
    image: "support",
    activePages: [],
  },


];
const NON_AUTH_ITEMS = [
  {
    id: 77,
    key: "HOME",
    type: "navigation",
    page: "Tab",
    image: "home",
    name: "",
    activePages: ["HomeStack", "MarketsStack", "TradeStack", "WalletStack"],
  },
  {
    id: 0,
    key: "LOGIN",
    type: "navigation",
    page: "Login",
    image: "login",
    activePages: ["Login"],
  },
  {
    id: 1,
    key: "SIGN_UP",
    type: "navigation",
    page: "RegisterStack",
    image: "register",
    activePages: ["RegisterEmail", "RegisterStack"],

  },
  {
    id: 5,
    key: "SYSTEM_SETTINGS",
    type: "navigation",
    page: "SettingsSystem",
    name: "",
    image: "system-settings",
    param: "system",
    activePages: ["SettingsSystem"],

  },


  {
    id: 28,
    key: "HELP_CENTER",
    type: "navigation",
    page: "SupportCenter",
    image: "help-center",
    activePages: ["SupportCenterInner"],
  },
  {
    id: 2,
    key: "LANGUAGE_SETTINGS",
    type: "language",
    page: null,
    image: "language",
    activePages: [],

  },

  {
    id: 3,
    key: "CONTACT_SUPPORT",
    type: "modal",
    page: "Static",
    image: "support",
    activePages: [],

  },
  {
    id: 6,
    key: "ABOUT_US",
    type: "navigation",
    page: "AboutInner",
    image: "settings",
    name: "",
    activePages: ["About"],
  },
];

const AccountsSection = ({ authenticated, currentRouteName }) => {

  const keyExtractor = useCallback((item) => `$settings-${item.id}`, []);

  return (
    <View

      keyExtractor={keyExtractor}
      itemHeight={DIMENSIONS.LIST_ITEM_HEIGHT}
      renderItem={({ item }) => <NavigationListItem key={item.id} item={item} />}
      onEndReached={null}
    >
      {
        authenticated ?
          AUTH_ITEMS.map((item) => <NavigationListItem active={item.activePages.includes(currentRouteName)}
                                                       key={item.id} item={item} />) :
          NON_AUTH_ITEMS.map((item) => <NavigationListItem
            active={item.activePages.includes(currentRouteName)}
            key={item.id} item={item} />)
      }


      <StillLogo />
    </View>
  );
};


export default AccountsSection;
