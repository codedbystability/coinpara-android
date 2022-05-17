import React, { useEffect, useState } from "react";
import { Text, View, FlatList, Pressable, Alert } from "react-native";
import styles from "./styles";
import { getLang } from "../../../../helpers/array-helper";
import { useSelector } from "react-redux";
import { navigationRef } from "../../../../providers/RootNavigation";
import Intercom from "@intercom/intercom-react-native";
import styledHigherOrderComponents from "../../../../hocs/styledHigherOrderComponents";
import store from "../../../../reducers/createReducers";
import HapticProvider from "../../../../providers/HapticProvider";

import TinyImage from "../../../../tiny-image";
import userServices from "../../../../services/user-services";
import ModalProvider from "../../../../providers/ModalProvider";
import MarketSelect from "../../../../components/market-select";
import { selectSortByMarket } from "../../../../selectors/wallet-selector";


const NonAuth = [

  {
    id: 1,
    title: "DEPOSIT_TL",
    actionKey: "price-deposit",
    icon: "arrow-down",
    tiny: "tl-deposit",
  },
  {
    id: 2,
    title: "WITHDRAW_TL",
    actionKey: "price-withdraw",
    tiny: "tl-withdraw",
    icon: "arrow-up",
  },

  {
    id: 6, title: "INSTANT_TRADE", actionKey: "instant-trade",
    tiny: "instant-trade-2",
  },
  {
    id: 9, title: "DEPOSIT_CRYPTO", actionKey: "crypto-deposit",
    tiny: "crypto-deposit",
    icon: "arrow-down",
  },

  {
    id: 8, title: "HELP", actionKey: "help",
    tiny: "contact-2",
  },
];
const AuthApproved = [
  {
    id: 1,
    title: "DEPOSIT_TL",
    actionKey: "price-deposit",
    icon: "arrow-down",
    tiny: "tl-deposit",
  },
  {
    id: 2,
    title: "WITHDRAW_TL",
    actionKey: "price-withdraw",
    tiny: "tl-withdraw",
    icon: "arrow-up",
  },

  {
    id: 6, title: "INSTANT_TRADE", actionKey: "instant-trade",
    tiny: "instant-trade-2",
  },
  {
    id: 9, title: "DEPOSIT_CRYPTO", actionKey: "crypto-deposit",
    tiny: "crypto-deposit",
    icon: "arrow-down",
  },


  {
    id: 8, title: "HELP", actionKey: "help",
    tiny: "contact-2",
  },
];
const AuthNonApproved = [
  {
    id: 10, title: "ACCOUNT_VERIFICATION",
    actionKey: "account-verification",
    tiny: "account-verification-2",
  },
  {
    id: 1,
    title: "DEPOSIT_TL",
    actionKey: "price-deposit",
    icon: "arrow-down",
    tiny: "tl-deposit",
  },
  {
    id: 6, title: "INSTANT_TRADE", actionKey: "instant-trade",
    tiny: "instant-trade-2",
  },
  {
    id: 9, title: "DEPOSIT_CRYPTO", actionKey: "crypto-deposit",
    tiny: "crypto-deposit",
    icon: "arrow-down",
  },


  {
    id: 8, title: "HELP", actionKey: "help",
    tiny: "contact-2",
  },
];

const Shortcuts = () => {

  const { activeTheme, fontSizes, language } = useSelector(state => state.globalReducer);
  const { authenticated, user } = useSelector(state => state.authenticationReducer);
  const [items, setItems] = useState([]);


  const handleCoinSelected = (theCoin) => {
    ModalProvider.hide();
    const wallets = store.getState()["walletReducer"]["wallets"];

    const theWallet = wallets.find(wallet => wallet.cd === theCoin.Code);
    if (!theWallet) {
      return;
    }
    setTimeout(() => {
      return navigationRef.current.navigate("Transfer", {
        wallet: theWallet,
        transactionType: theCoin.AllowDeposit ? "deposit" : "withdraw",
        coinType: "crypto",
      });
    }, 250);
  };

  const handleNavigation = (type) => {
    HapticProvider.trigger();

    if (type === "help") {
      if (authenticated) {
        Intercom.registerIdentifiedUser({
          userId: user.Id,
          email: user.Email,
        }).then(null);
      } else {
        Intercom.registerUnidentifiedUser().then(r => console.log("intercom - ", r));
      }
      Intercom.displayMessenger().then(null);
      return;
    }
    if (!authenticated) {
      return navigationRef.current.navigate("LoginRegister");
    }
    if (type === "instant-trade") {
      return navigationRef.current.navigate("TradeStack");
    } else if (type === "account-verification") {
      return navigationRef.current.navigate("AccountApprove");
    } else if (type === "wallet") {
      return navigationRef.current.navigate("Wallet");
    } else if (type === "orders") {
      return navigationRef.current.navigate("Orders");
    } else if (type === "invite") {
      return navigationRef.current.navigate("InviteFriends");
    } else if (type === "market") {
      return navigationRef.current.navigate("Markets");
    } else if (
      type === "price-deposit" || type === "price-withdraw"
    ) {
      const wallets = store.getState()["walletReducer"]["wallets"];
      return navigationRef.current.navigate("Transfer", {
        wallet: wallets.find(wallet => wallet.cd === "TRY"),
        // wallet: wallets.find(wallet => ["price-deposit", "price-withdraw"].includes(type) ? wallet.cd === "TRY" : wallet.cd === "BTC"),
        transactionType: ["price-deposit", "crypto-deposit"].includes(type) ? "deposit" : "withdraw",
        coinType: "price",
      });
    } else if (type === "crypto-deposit" || type === "crypto-withdraw") {
      ModalProvider.show(() => <MarketSelect
        isBoth={false}
        type={"DEPOSIT_CRYPTO"}
        initialActiveType={"crypto"}
        setActiveType={() => null}
        isTrending={true}
        handleSelect={handleCoinSelected}
        shouldCheck={true}
      />, true);

    }
  };

  useEffect(() => {
    if (authenticated) {
      userServices.getApproval().then((res) => {
        if (res && res.IsSuccess) {
          if (res.Data.AdminApproval) {
            setItems(AuthApproved);
          } else {
            setItems(AuthNonApproved);
          }
        }
      });
    } else {
      setItems(NonAuth);
    }
  }, [authenticated]);

  const card = ({ item }) => {

    return (
      <Pressable onPress={() => handleNavigation(item.actionKey)}
                 style={({ pressed }) => [
                   styles(activeTheme).item,
                   {
                     // backgroundColor: pressed ? activeTheme.inActiveListBg : activeTheme.darkBackground,
                   },
                 ]}>
        <TinyImage parent={"shortcuts/"} name={item.tiny}

                   style={styles(activeTheme).img}
        />
        <Text style={styles(activeTheme, fontSizes).text}>{getLang(language, item.title)}</Text>

        {
          item.icon ? <View style={styles(activeTheme).icon}>
            <TinyImage parent={"shortcuts/"} name={item.icon}
                       style={styles(activeTheme).arr}
            />
          </View> : null
        }


      </Pressable>
    );
  };


  return (
    <View style={[styles(activeTheme).container]}>
      <FlatList
        numColumns={5}
        showsHorizontalScrollIndicator={false}
        data={items}
        renderItem={card}
        keyExtractor={(item, index) => index}
      />
    </View>
  );

};


export default React.memo(styledHigherOrderComponents(Shortcuts));

// {
//   id: 4,
//   title: "WITHDRAW_CRYPTO",
//   actionKey: "crypto-withdraw",
//   tiny: "crypto",
//   icon: "arrow-up",
//
// },

// {
//   id: 5,
//   title: "INVITE",
//   actionKey: "invite",
//   tiny: "invite",
// },
//
// {
//   id: 7, title: "WALLET", actionKey: "wallet",
//   tiny: "wallet",
// },
//
// {
//   id: 3,
//   title: "ORDERS",
//   actionKey: "orders",
//   tiny: "orders",
// },
//
// {
//   id: 10, title: "ACCOUNT_VERIFICATION",
//   actionKey: "account-verification",
//   tiny: "account-verification",
// },
//
