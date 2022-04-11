import React, {useState} from "react";
import { Pressable, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import WebView from "react-native-webview";

import { useSelector } from "react-redux";
import LanguageItem from "../../containers/tabs/settings/components/language-item";
import {
  BIG_TITLE_FONTSIZE,
  LIST_MARGIN_T,
  PADDING_BV,
  PADDING_H,
} from "../../../utils/dimensions";
import { getLang } from "../../helpers/array-helper";
import Intercom from "@intercom/intercom-react-native";
import { navigationRef } from "../../providers/RootNavigation";
import HapticProvider from "../../providers/HapticProvider";
import TinyImage from "../../tiny-image";
import ModalProvider from "../../providers/ModalProvider";
import AccountApproveItem from "../../containers/tabs/settings/components/account-approve-item";

const NavigationListItem = ({ item, isStatic = false }) => {
  const { activeTheme,activeThemeKey, fontSizes, language } = useSelector(state => state.globalReducer);
  const { authenticated, user } = useSelector(state => state.authenticationReducer);

  const handleNavigation = (item) => {
    HapticProvider.trigger();

    if (item.key === "CONTACT_SUPPORT") {
      if (authenticated) {
        Intercom.registerIdentifiedUser({
          email: user.Email,
          userId: user.AffiliateCode,
        }).then(null);
      } else {
        Intercom.registerUnidentifiedUser().then(r => console.log("intercom - ", r));
      }
      Intercom.displayMessenger().then(null);
      return;
    }
    else if(item.key==='VIDEO_MANAGEMENT'){
      return showVideoBlog()
    }
    if (item.type === "navigation") {
      return navigationRef.current.navigate(item.page, {
        title: item.Title ? item.Title : item.name,
        url: item.url,
        content: item.content,
        param: item.param || null,
      });
    }
  };


  const showVideoBlog = () => ModalProvider.show(() => <ModalContent />);

  const ModalContent = () => {
    const [loaded, setLoaded] = useState(false);
    return (
      <View style={[styles(activeTheme).loadingWrapperV, {
        backgroundColor: activeThemeKey === "classic" ? "#040C18" : activeThemeKey === "dark" ? "#0D0D0D" : "#F6F7F9",
      }]}>
        {!loaded && (
          <ActivityIndicator
            style={styles(activeTheme).loadingV}
            size="small"
            color={activeTheme.secondaryText}
          />
        )}
        <WebView
          onLoad={() => setLoaded(true)}
          style={{ backgroundColor: activeTheme.darkBacground }}
          source={{ uri: `https://www.coinpara.com/video-view?theme=${activeThemeKey === "classic" ? "default" : activeThemeKey}` }}
        />

      </View>
    );
  };

  if (isStatic) {
    return (
      <Pressable
        onPress={() => handleNavigation(item)}
        style={[styles(activeTheme).wrapper2]}>
        <View style={styles(activeTheme).leftWrapper}>
          <Text style={[styles(activeTheme, fontSizes).title, {
            color: activeTheme.secondaryText,
          }]}>{isStatic ? item.Title : getLang(language, item.key)}</Text>
        </View>

        <View style={styles(activeTheme).rightWrapper}>
          <TinyImage parent={"rest/"} name={"c-right"} style={styles(activeTheme).icon} />
        </View>
      </Pressable>
    );
  }

  return item.key === "LANGUAGE_SETTINGS" ?  <LanguageItem item={item} />:
   item.key === "ACCOUNT_APPROVE" ?  <AccountApproveItem />:
    <Pressable
      onPress={() => handleNavigation(item)}
      style={[styles(activeTheme).wrapper]}>
      <View style={styles(activeTheme).leftWrapper}>

        <View style={{ marginRight: 10 }}>
          <TinyImage parent={"settings/"} name={item.image} style={styles(activeTheme).icon} />
        </View>

        <Text
          style={[styles(activeTheme, fontSizes).title]}>{isStatic ? item.Title : getLang(language, item.key)}</Text>
      </View>

      <View style={styles(activeTheme).rightWrapper}>
        <TinyImage parent={"settings/"} name={item.type=== 'modal'?"eye-list":"c-right"} style={styles(activeTheme).icon} />
      </View>
    </Pressable>



};


export default NavigationListItem;


const styles = (props, fontSizes) => StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: props.darkBackground,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: PADDING_BV,
    paddingHorizontal: PADDING_H,
    borderRadius: 8,
    marginTop: LIST_MARGIN_T ,
    borderColor: props.borderGray,
    borderWidth: 1,
  },
  wrapper2: {
    width: "100%",
    paddingVertical: PADDING_H / 1.2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    marginTop: LIST_MARGIN_T ,
    borderColor: props.borderGray,
    borderBottomWidth: 1,
    paddingHorizontal: PADDING_H,
    // paddingLeft: PADDING_H,
  },
  leftWrapper: {
    alignItems: "center",
    flexDirection: "row",
  },

  image: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: props.appWhite,
  },

  title: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.BIG_TITLE_FONTSIZE,
    color: props.appWhite,
  },

  rightWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  rightWrapperBig: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "15%",
  },

  icon: {
    width: 22,
    height: 22,
  },
  shadow: {},
  wrapperV: {
    width: "100%",
    marginTop: LIST_MARGIN_T ,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: PADDING_BV,
    paddingHorizontal: PADDING_H,
    borderRadius: 8,
    backgroundColor: props.darkBackground,
    borderWidth: 1,
    borderColor: props.borderGray,
  },
  leftWrapperV: {
    alignItems: "center",
    flexDirection: "row",
  },
  titleV: {
    fontFamily: "CircularStd-Book",
    fontSize: BIG_TITLE_FONTSIZE,
    color: props.appWhite,
  },
  rightWrapperV: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  loadingWrapperV: {
    flex: 1,
  },
  loadingV: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: props.darkBackground,
  },
  iconV: {
    width: 22,
    height: 22,
  },
});
