import React from "react";

import ProfileScreen from "../containers/stacks/profile";
import ChangePasswordScreen from "../containers/stacks/change-password";
import TimeExpirationScreen from "../containers/stacks/time-expiration";
import AccountApproveScreen from "../containers/stacks/account-approve";
import InviteFriendsScreen from "../containers/stacks/invite-friend";
import WalletHistoryScreen from "../containers/stacks/wallet-history";
import TransactionDetailScreen from "../containers/stacks/transaction-detail";
import RedeemCreatedScreen from "../containers/stacks/redeem-created";
import LoginRegisterScreen from "../containers/stacks/login-register";
import LoginScreen from "../containers/stacks/login";
import RegisterEmailScreen from "../containers/stacks/register/register-email";
import RegisterAdditionalScreen from "../containers/stacks/register/register-additional";
import RegisterPasswordScreen from "../containers/stacks/register/register-password";
import ResultScreen from "../containers/stacks/result";
import NotificationsScreen from "../containers/stacks/notifications";
import TwoFactorAuthenticationScreen from "../containers/stacks/two-factor";
import UserLogsScreen from "../containers/stacks/user-logs";
import TransferScreen from "../containers/stacks/transfer";
import ScanScreen from "../containers/stacks/sqan-qr";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import AllOrdersScreen from "../containers/stacks/orders/all";
import QrCamera from "../containers/stacks/qr-camera";
import ForgotPasswordScreen from "../containers/forgot-password";
import SetPasswordsScreen from "../containers/stacks/set-password";
import AccountInformationScreen from "../containers/stacks/account-information";
import MarketDetailPure2 from "../containers/stacks/market-detail/index-pure";
import LockScreen from "../containers/stacks/lock-screen";
import WalkThrough from "../containers/stacks/walk-through";
import FavSort from "../containers/stacks/fav-sort";
import AboutInner from "../containers/stacks/about-inner";
import Static from "../containers/stacks/static";
import SecuritySettingsScreen from "../containers/stacks/settings-inner";
import SystemSettingsScreen from "../containers/stacks/settings-inner/system-settings";
import OrderDetail from "../containers/stacks/order-detail";
import HelpCenterScreen from "../containers/stacks/help-center";
import StoreHelpRequestScreen from "../containers/stacks/help-center/store";
import SupportCenterScreen from "../containers/stacks/support-center";
import SupportCenterInnerScreen from "../containers/stacks/support-center/inner";
import HelpCenterDetailScreen from "../containers/stacks/help-center/detail";


const Stack = createStackNavigator();

const AboutStack = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name={"About"} component={AboutInner} />
      <Stack.Screen name={"Static"} component={Static} />
    </Stack.Navigator>
  );
};

const SecuritySettingsStack = () => {

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name={"SecuritySettings"} component={SecuritySettingsScreen} />
      <Stack.Screen name={"TwoFactorAuthentication"} component={TwoFactorAuthenticationScreen} />
      <Stack.Screen name={"ChangePassword"} component={ChangePasswordScreen} />
      <Stack.Screen name={"TimeExpiration"} component={TimeExpirationScreen} />
    </Stack.Navigator>
  );
};


const SupportCenterStack = () => {

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name={"SupportCenterInner"} component={SupportCenterScreen} />
      <Stack.Screen name={"SupportCenterInnerScreen"} component={SupportCenterInnerScreen} />
      <Stack.Screen name={"Static"} component={Static} />

    </Stack.Navigator>
  );
};

const HelpCenterStack = () => {

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name={"HelpCenterInner"} component={HelpCenterScreen} />
      <Stack.Screen name={"HelpCenterDetail"} component={HelpCenterDetailScreen} />
      <Stack.Screen name={"StoreHelpRequest"} component={StoreHelpRequestScreen} />
    </Stack.Navigator>
  );
};

const RegisterItems = [

  {
    id: 6, name: "RegisterEmail",
    component: RegisterEmailScreen,
    options: {
      title: "Register",
      header: () => null,
      ...TransitionPresets.SlideFromRightIOS,
      // header: () => null,
      // presentation: "transparentModal",
    },
  },


  {
    id: 8, name: "RegisterAdditional",
    component: RegisterAdditionalScreen,
    options: {
      title: "Register",
      header: () => null,
      ...TransitionPresets.SlideFromRightIOS,

    },
  },

  {
    id: 9, name: "RegisterPassword",
    component: RegisterPasswordScreen,
    options: {
      title: "RegisterPassword",
      ...TransitionPresets.SlideFromRightIOS,
      header: () => null,
    },
  },

];

const RegisterStack = () => {

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      {
        RegisterItems.map(item => <Stack.Screen
          key={item.id}
          name={item.name}
          component={item.component} />,
        )
      }

    </Stack.Navigator>
  );
};

const OrderItems = [{
  id: 25, name: "Orders", component: AllOrdersScreen, options: {
    title: "Orders",
    header: () => null,
    ...TransitionPresets.SlideFromRightIOS,

  },
},

  {
    id: 25, name: "OrderDetail", component: OrderDetail, options: {
      title: "OrderDetail",
      header: () => null,
      ...TransitionPresets.SlideFromRightIOS,

    },
  },
];
const OrderStack = () => {

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      {
        OrderItems.map(item => <Stack.Screen
          key={item.id}
          name={item.name}
          component={item.component} />,
        )
      }

    </Stack.Navigator>
  );
};
export const drawerItems = [

  {
    id: 10, name: "RegisterStack",
    component: RegisterStack,
    options: {
      title: "",
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
  {
    id: 35, name: "WalkThrough", component: WalkThrough, options: {
      title: "",
      header: () => null,
      ...TransitionPresets.ModalSlideFromBottomIOS,

    },
  },


  {
    id: 10, name: "Result",
    component: ResultScreen,
    options: {
      title: "Register",
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
  {
    id: 11, name: "SetPassword",
    component: SetPasswordsScreen,
    options: {
      title: "",
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
  {
    id: 11, name: "OrderStack",
    component: OrderStack,
    options: {
      title: "",
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
  {
    id: 34, name: "ForgotPassword", component: ForgotPasswordScreen, options: {
      title: "ForgotPassword",
      header: () => null,
      ...TransitionPresets.SlideFromRightIOS,

    },
  },
  {
    id: 3, name: "LoginRegister", component: LoginRegisterScreen, options: {
      header: () => null,
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
  {
    id: 36, name: "AboutInner", component: AboutStack, options: {
      title: "",
      header: () => null,

      // ...TransitionPresets.ModalSlideFromBottomIOS,
    },
  },

  {
    id: 48, name: "HelpCenter", component: HelpCenterStack, options: {
      header: () => null,
      title: "Notifications",
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
  {
    id: 118, name: "SupportCenter", component: SupportCenterStack, options: {
      header: () => null,
      title: "SupportCenter",
      ...TransitionPresets.SlideFromRightIOS,
    },
  },

  {
    id: 4, name: "Login",
    component: LoginScreen,
    options: {
      header: () => null,
      title: "",
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
  {
    id: 8, name: "InviteFriends", component: InviteFriendsScreen, options: {
      title: "InviteFriends",
      header: () => null,
      ...TransitionPresets.SlideFromRightIOS,


    },
  },
  {
    id: 7, name: "AccountApprove", component: AccountApproveScreen, options: {
      title: "AccountApprove",
      header: () => null,
      ...TransitionPresets.SlideFromRightIOS,

    },
  },
  {
    id: 18, name: "Notifications", component: NotificationsScreen, options: {
      header: () => null,
      title: "Notifications",
      ...TransitionPresets.SlideFromRightIOS,

    },
  },

  {
    id: 20, name: "UserLogs", component: UserLogsScreen, options: {
      title: "",
      ...TransitionPresets.SlideFromRightIOS,
      header: () => null,

    },
  },

  {
    id: 36, name: "SettingsSecurity", component: SecuritySettingsStack, options: {
      title: "",
      header: () => null,
    },
  },

  {
    id: 36, name: "SettingsSystem", component: SystemSettingsScreen, options: {
      title: "",
      header: () => null,
    },
  },


];

export const stackItems = [

  {
    id: 17, name: "MarketDetail", component: MarketDetailPure2, options: {
      header: () => null,
      title: "MarketDetail",
      ...TransitionPresets.SlideFromRightIOS,
      gestureEnabled: false,
      animationEnabled: true,
    },
  },


  {
    id: 21, name: "ScanScreen", component: ScanScreen, options: {
      title: "Scan",
      header: () => null,
      ...TransitionPresets.BottomSheetAndroid,
    },
  },

  {
    id: 2, name: "Profile", component: ProfileScreen, options: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
  {
    id: 34, name: "AccountInformation", component: AccountInformationScreen, options: {
      title: "",
      header: () => null,
      ...TransitionPresets.SlideFromRightIOS,
    },
  },

];
export const HomeStackNavigatorItems = [
  {
    id: 10, name: "WalletHistory", component: WalletHistoryScreen, options: {
      title: "WalletHistory",
      ...TransitionPresets.SlideFromRightIOS,
      header: () => null,


    },
  },

  {
    id: 11, name: "Transfer", component: TransferScreen, options: {
      title: "",
      headerShown: false,
      ...TransitionPresets.SlideFromRightIOS,
      header: () => null,

    },
  },


  {
    id: 15, name: "TransactionDetail", component: TransactionDetailScreen, options: {
      title: "TransactionDetail",
      ...TransitionPresets.SlideFromRightIOS,
      header: () => null,

    },
  },

  {
    id: 36, name: "FavSort", component: FavSort, options: {
      title: "",
      header: () => null,
      // ...TransitionPresets.ModalSlideFromBottomIOS,
    },
  },

  // {
  //   id: 4, name: "ChangePassword", component: ChangePasswordScreen, options: {
  //     title: "RESET_PASSWORD",
  //     ...TransitionPresets.SlideFromRightIOS,
  //     header: () => null,
  //   },
  // },

  {
    id: 16, name: "RedeemCreated", component: RedeemCreatedScreen, options: {
      title: "RedeemCreated",
      ...TransitionPresets.SlideFromRightIOS,

    },
  },


  {
    id: 33, name: "QrCamera", component: QrCamera, options: {
      title: "QrCamera",
      header: () => null,
      ...TransitionPresets.SlideFromRightIOS,

    },
  },

  {
    id: 34, name: "LockScreen", component: LockScreen, options: {
      title: "",
      header: () => null,
      ...TransitionPresets.ModalSlideFromBottomIOS,

    },
  },


  {
    id: 4, name: "Login",
    component: LoginScreen,
    options: {
      header: () => null,
      title: "",
      ...TransitionPresets.SlideFromRightIOS,
    },
  },

  {
    id: 3, name: "LoginRegister", component: LoginRegisterScreen, options: {
      header: () => null,
      ...TransitionPresets.SlideFromRightIOS,
    },
  },


  {
    id: 10, name: "Result",
    component: ResultScreen,
    options: {
      title: "Register",
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
  {
    id: 11, name: "SetPassword",
    component: SetPasswordsScreen,
    options: {
      title: "",
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
  {
    id: 34, name: "ForgotPassword", component: ForgotPasswordScreen, options: {
      title: "ForgotPassword",
      header: () => null,
      ...TransitionPresets.SlideFromRightIOS,

    },
  },

];


export const nonLoginStackItems = [

  // {
  //   id: 6, name: "RegisterEmail",
  //   component: RegisterEmailScreen,
  //   options: {
  //     title: "Register",
  //     header: () => null,
  //     ...TransitionPresets.SlideFromRightIOS,
  //     // header: () => null,
  //     // presentation: "transparentModal",
  //   },
  // },


  {
    id: 4, name: "Login",
    component: LoginScreen,
    options: {
      header: () => null,
      title: "",
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
  {
    id: 6, name: "RegisterEmail",
    component: RegisterEmailScreen,
    options: {
      title: "Register",
      header: () => null,
      ...TransitionPresets.SlideFromRightIOS,
      // header: () => null,
      // presentation: "transparentModal",
    },
  },

  {
    id: 3, name: "LoginRegister", component: LoginRegisterScreen, options: {
      header: () => null,
      ...TransitionPresets.SlideFromRightIOS,
    },
  },

  {
    id: 8, name: "RegisterAdditional",
    component: RegisterAdditionalScreen,
    options: {
      title: "Register",
      header: () => null,
      ...TransitionPresets.SlideFromRightIOS,

    },
  },

  {
    id: 9, name: "RegisterPassword",
    component: RegisterPasswordScreen,
    options: {
      title: "RegisterPassword",
      ...TransitionPresets.SlideFromRightIOS,
      header: () => null,
    },
  },

  {
    id: 10, name: "Result",
    component: ResultScreen,
    options: {
      title: "Register",
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
  {
    id: 11, name: "SetPassword",
    component: SetPasswordsScreen,
    options: {
      title: "",
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
  {
    id: 34, name: "ForgotPassword", component: ForgotPasswordScreen, options: {
      title: "ForgotPassword",
      header: () => null,
      ...TransitionPresets.SlideFromRightIOS,

    },
  },
];


//
// {
//   id: 23, name: "CreateAlarm", component: AlarmCreateScreen, options: {
//     title: "Alarm",
//     header: () => null,
//     ...TransitionPresets.SlideFromRightIOS,
//   },
// },
// {
//   id: 24, name: "Alarms", component: AlarmsScreen, options: {
//     title: "Alarms",
//     header: () => null,
//     ...TransitionPresets.SlideFromRightIOS,
//
//   },
// },
