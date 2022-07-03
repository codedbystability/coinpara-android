import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import userServices from "../../../services/user-services";
import { useSelector } from "react-redux";
import { DIMENSIONS } from "../../../../utils/dimensions";
import Clipboard from "@react-native-community/clipboard";
import { getLang } from "../../../helpers/array-helper";
import DropdownAlert from "../../../providers/DropdownAlert";
import TinyImage from "../../../tiny-image";


const links = [
  { id: 1, key: "link", title: "LINKS" },
  { id: 2, key: "commission", title: "COMMISSIONS" },
  { id: 3, key: "friends", title: "FRIENDS" },
];
const ReferralLinks = () => {
  const [activeLinkTab, setActiveLinkTab] = useState("link");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleSetTab = (tab) => setActiveLinkTab(tab.key);
  const { activeTheme, language } = useSelector(state => state.globalReducer);


  const handleCopy = (item) => {
    Clipboard.setString(item.AffiliateCode);
    return DropdownAlert.show("info", getLang(language, "INFO"), getLang(language, "LINK_COPIED"));
  };
  useEffect(() => {
    if (activeLinkTab) {
      setLoading(true);
      switch (activeLinkTab) {
        case "link":
          getUserLinks();
          break;

        case "commission":
          getUserCommissions();
          break;

        case "friends":
          getFriendList();
          break;
      }
    }

  }, [activeLinkTab]);


  const getUserLinks = () => {
    userServices.getUserLinks().then((response) => {
      setLoading(false);
      if (response.IsSuccess) {
        setData(response.Data);
      }
    });
  };

  const getUserCommissions = () => {
    userServices.getCommissions().then((response) => {
      setLoading(false);

      if (response.IsSuccess) {
        setData(response.Data);
      }
    });
  };

  const getFriendList = () => {
    userServices.getFriendList().then((response) => {
      setLoading(false);

      if (response.IsSuccess) {
        setData(response.Data);
      }
    });
  };

  return (
    <View style={styles(activeTheme).wrapper}>

      <View style={styles(activeTheme).container}>
        {
          links.map(item => (
            <Pressable key={item.id}
                       onPress={() => handleSetTab(item)}
                       style={[styles(activeTheme).linkItem, activeLinkTab === item.key && styles(activeTheme).linkItemActive]}>
              <Text
                style={[styles(activeTheme).text, activeLinkTab === item.key && styles(activeTheme).activeText]}>{getLang(language, item.title)}</Text>
            </Pressable>
          ))
        }

      </View>


      <View style={{
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
      }}>
        <Text style={[styles(activeTheme).tabTitle, { textAlign: "left" }]}>{getLang(language, "AFFILIATE_CODE")}</Text>
        <Text
          style={[styles(activeTheme).tabTitle, { textAlign: "center" }]}>{getLang(language, "REFERRAL_PERCENTAGE")}</Text>
        <Text
          style={[styles(activeTheme).tabTitle, { textAlign: "right" }]}>{getLang(language, "FRIEND_PERCENTAGE")}</Text>
      </View>

      <View style={{
        width: "100%",
        paddingHorizontal: 20,
      }}>
        {
          loading ? <View style={{ paddingVertical: DIMENSIONS.PADDING_H * 2 }}>
            <ActivityIndicator />
          </View> : data.length >= 1 ? data.map(item => (
              <Pressable
                onPress={() => handleCopy(item)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 8,
                }} key={item.Id}>
                <Text style={[styles(activeTheme).tabText, { textAlign: "left" }]}>{item.AffiliateCode}</Text>
                <Text style={[styles(activeTheme).tabText, { textAlign: "center" }]}>% {item.ReferralPercentage}</Text>
                <Text style={[styles(activeTheme).tabText, { textAlign: "right" }]}>% {item.FriendPercentage}</Text>
              </Pressable>
            )) :
            <View style={{ paddingVertical: DIMENSIONS.PADDING_H * 4, alignItems: "center", justifyContent: "center" }}>
              <TinyImage parent={"rest/"} name={"empty-face"} style={styles(activeTheme).icon} />
            </View>
        }

      </View>


    </View>
  );

};

export default ReferralLinks;

const styles = (props) => StyleSheet.create({

  wrapper: {
    paddingVertical: 20,
  },
  container: {
    paddingHorizontal: DIMENSIONS.PADDING_H,
    height: DIMENSIONS.INPUT_HEIGHT,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.03)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  linkItem: {
    backgroundColor: props.darkBackground,
    borderRadius: 8,
    width: "30%",
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
  },

  linkItemActive: {
    backgroundColor: props.borderGray,
  },

  text: {
    color: props.secondaryText,
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
  },

  activeText: {
    color: props.appWhite,
  },

  tabTitle: {
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    width: "33%",
    color: props.secondaryText,

  },

  tabText: {
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    letterSpacing: 0,
    color: props.secondaryText,
    textAlign: "center",
    width: "33%",
  },

  icon: {
    width: 24,
    height: 24,
  },
});
