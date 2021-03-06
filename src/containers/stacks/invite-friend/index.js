import React, { useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import {  ScrollView, StyleSheet, View } from "react-native";
import InviteContent from "./invite-content";
import ReferralAccounts from "./referral-accounts";
import ReferralLinks from "./links";
import GenerateLinkContent from "./generate-link-content";
import { useSelector } from "react-redux";
import userServices from "../../../services/user-services";
import Clipboard from "@react-native-community/clipboard";
import TabNavigationHeader from "../../../components/page-components/tab-navigation-header";
import { DIMENSIONS } from "../../../../utils/dimensions";
import QrCreateModalize from "../deposit-btc/read-qr";
import Share from "react-native-share";
import DropdownAlert from "../../../providers/DropdownAlert";
import { getLang } from "../../../helpers/array-helper";
import ModalProvider from "../../../providers/ModalProvider";
import AnimatedTab from "../../../components/page-components/animated-tab";
import { headers, options, percentages } from "./constants";
import FloatingAction from "../../../components/page-components/floating-action";


const InviteFriends = (props) => {

  const { user } = useSelector(state => state.authenticationReducer);
  const { language } = useSelector(state => state.globalReducer);

  const [activeHeaderKey, setActiveHeaderKey] = useState("invite");
  const [activePercentage, setActivePercentage] = useState("0");

  const handleSetHeader = (header) => setActiveHeaderKey(header.key);
  const handleSetPercentage = (tab) => setActivePercentage(tab.value);
  const handleAction = (type) => {
    if (type === "copy") {
      Clipboard.setString(user.AffiliateLink);
      return DropdownAlert.show("info", getLang(language, "INFO"), getLang(language, "LINK_COPIED"));
    } else if (type === "qr") {
      ModalProvider.show(() => <QrCreateModalize qrValue={user.AffiliateLink} />);
    }
  };


  const handleCreateAffiliateCode = () => {
    const instance = {
      FriendPercentage: activePercentage,
    };
    userServices.createAffiliateCode(instance).then((response) => {
      if (response.IsSuccess) {
        Share.open(options(response.Data)).then(r => null);
        DropdownAlert.show("info", getLang(language, "SUCCESS"), getLang(language, "AFFILIATE_CODE_GENERATED"));
      }
    });
  };
  return (
    <>
      <TabNavigationHeader
        {...props}
        backAble={true}
        options={{
          title: getLang(language, "INVITE_A_FRIEND"),
        }}

      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.wrapper}
      >

        <View style={{ paddingHorizontal: DIMENSIONS.PADDING_H }}>
          <AnimatedTab {...{
            activeKey: activeHeaderKey,
            headers: headers,
            width: `50%`,
            onChange: handleSetHeader,
          }} />
        </View>

        {
          activeHeaderKey === "invite" ? <InviteContent {...{ handleAction, user }} /> : <GenerateLinkContent  {...{
            handleCreateAffiliateCode,
            percentages,
            user,
            activePercentage,
            handleSetPercentage,
          }} />
        }
        <ReferralAccounts {...{ user }} />

        <ReferralLinks {...{ props }} />


        <View style={{ height: 100, width: "100%" }} />

      </ScrollView>


      <FloatingAction />

    </>
  );

};

const InviteFriendsScreen = styledHigherOrderComponents(InviteFriends);
export default InviteFriendsScreen;

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: DIMENSIONS.PADDING_BV,
    // paddingTop: 60,
  },
});
