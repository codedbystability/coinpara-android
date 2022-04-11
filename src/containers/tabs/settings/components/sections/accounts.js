import React, { useCallback } from "react";
import NavigationListItem from "../../../../../components/navigation-list-item";
import { LIST_ITEM_HEIGHT, PADDING_H } from "../../../../../../utils/dimensions";
import CustomList from "../../../../../components/custom-list";
import UserInfo from "../user-info";
import WalletInfo from "../wallet-info";
import SettingsLogout from "../settings-logout";
import StillLogo from "../../../../../components/still-logo";
import ThemeSelector from "../theme-selector";
import FontSizeView from "../font-size/font-size-view";
import ColorOption from "../color-option";

const AUTH_ITEMS = [
  {
    id: 7,
    key: "ACCOUNT_APPROVE",
    type: "navigation",
    page: "AccountApprove",
    image: "settings",
    name: "",
  },
  {
    id: 1,
    key: "ORDERS",
    type: "navigation",
    page: "Orders",
    image: "orders",
  },
  {
    id: 2,
    key: "USER_ACTIVITIES",
    type: "navigation",
    page: "UserLogs",
    image: "user-activities",
  },

  {
    id: 4,
    key: "SECURITY_SETTINGS",
    type: "navigation",
    page: "SettingsInner",
    name: "",
    param: "security",
    image: "about-us",

  },
  {
    id: 5,
    key: "SYSTEM_SETTINGS",
    type: "navigation",
    page: "SettingsInner",
    name: "",
    image: "system-settings",
    param: "system",
  },
  {
    id: 6,
    key: "ABOUT_US",
    type: "navigation",
    page: "AboutInner",
    image: "settings",
    name: "",
  },

  {
    id: 8,
    key: "REFER_A_FRIEND",
    type: "navigation",
    page: "InviteFriends",
    image: "ref",
    name: "",
  },
  {
    id: 9,
    key: "VIDEO_MANAGEMENT",
    type: "modal",
    page: "VideoListItem",
    image: "video",
    name: "",
  },
  {
    id: 3,
    key: "CONTACT_SUPPORT",
    type: "modal",
    page: "Static",
    name: "Contact Support",
    image: "support",
  },

];

const NON_AUTH_ITEMS = [
  {
    id: 0,
    key: "LOGIN",
    type: "navigation",
    page: "Login",
    image: "login",
  },
  {
    id: 1,
    key: "SIGN_UP",
    type: "navigation",
    page: "RegisterEmail",
    image: "register",
  },
  {
    id: 6,
    key: "ABOUT_US",
    type: "navigation",
    page: "AboutInner",
    image: "settings",
    name: "",
  },


  {
    id: 2,
    key: "LANGUAGE_SETTINGS",
    type: "language",
    page: null,
    image: "language",
  },

  {
    id: 3,
    key: "CONTACT_SUPPORT",
    type: "modal",
    page: "Static",
    image: "support",
  },
];


const AccountsSection = ({ authenticated }) => {


  const keyExtractor = useCallback((item) => `$settings-${item.id}`, []);

  return (
    <CustomList
      contentStyle={{
        padding: PADDING_H,
      }}
      data={authenticated ? AUTH_ITEMS : NON_AUTH_ITEMS}
      showFooter={true}
      ListHeaderComponent={
        authenticated ?
          <>
            <UserInfo />
            <WalletInfo />
          </> : <>
            <ThemeSelector />

            <FontSizeView />

            <ColorOption />
          </>
      }
      ListFooterComponent={
        <>
          {
            authenticated && <SettingsLogout />
          }
          <StillLogo />
        </>
      }
      keyExtractor={keyExtractor}
      itemHeight={LIST_ITEM_HEIGHT}
      renderItem={({ item }) => <NavigationListItem key={item.id} item={item} />}
      onEndReached={null}
    />
  );
};


export default AccountsSection;
