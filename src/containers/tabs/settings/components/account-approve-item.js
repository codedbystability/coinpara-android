import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getLang } from "../../../../helpers/array-helper";
import { DIMENSIONS } from "../../../../../utils/dimensions";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import userServices from "../../../../services/user-services";
import { navigationRef } from "../../../../providers/RootNavigation";
import TinyImage from "../../../../tiny-image";


const AccountApproveItem = ({ active }) => {

  const { activeTheme, fontSizes, language } = useSelector(state => state.globalReducer);
  const isFocused = useIsFocused();
  const [userApproval, setUserApproval] = useState({});
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (isFocused) {
      userServices.getApproval().then((response) => {
        if (response.IsSuccess) {
          setUserApproval(response.Data);
          if (response.Data.AdminApproval) {
            setApproved(true);
          }
        }
      });
    }
  }, [isFocused]);

  const getAccountStatus = () => {
    if (!userApproval || Object.keys(userApproval).length <= 0) {
      return getLang(language, "APPROVE_YOUR_ACCOUNT");
    }
    if (userApproval.AdminApproval) {
      return getLang(language, "YOUR_ACCOUNT_IS_VERIFIED");
    }
    if (
      (!userApproval.FirstApproval && userApproval.IdCopy && userApproval.IdCopyBack) ||
      (!userApproval.SecondApproval && userApproval.Selfy) ||
      (!userApproval.ThirdApproval && userApproval.Adress) ||
      (!userApproval.FourthApproval && userApproval.VideoSelfy)
    ) {
      return getLang(language, "VERIFICATION_PENDING");
    }

    return getLang(language, "APPROVE_YOUR_ACCOUNT");

  };

  return (
    <Pressable
      onPress={() => navigationRef.current.navigate("AccountApprove")}
      style={[styles(activeTheme, {}, active).wrapper, {}]}>
      {
        !approved && <View style={{
          position: "absolute",
          height: 8,
          width: 8,
          borderRadius: 4,
          backgroundColor: activeTheme.changeRed,
          top: -2,
          right: -2,
        }} />
      }

      <View style={styles(activeTheme).leftWrapper}>

        <View style={{
          marginRight: 10,
        }}>
          <TinyImage parent={"settings/"} name={approved ? "account-verificated" : "account-verification"}
                     style={styles(activeTheme).icon} />
        </View>

        <View>
          <Text style={styles(activeTheme, fontSizes).title}>{getLang(language, "ACCOUNT_APPROVE")}</Text>
          <Text style={styles(activeTheme, fontSizes).desc}>{getAccountStatus()}</Text>
        </View>
      </View>

      {
        !active &&
        <View style={styles(activeTheme).rightWrapper}>
          <TinyImage parent={"rest/"} name={"c-right"} style={styles(activeTheme).icon} />
        </View>
      }
    </Pressable>
  );


};

export default AccountApproveItem;


const styles = (props, fontSizes, active) => StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: DIMENSIONS.PADDING_BV / 2,
    paddingHorizontal: DIMENSIONS.PADDING_H,
    borderRadius: 8,
    marginTop: DIMENSIONS.LIST_MARGIN_T,
    backgroundColor: active ? props.darkBackground : "transparent",
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
    fontSize: fontSizes?.SUBTITLE_FONTSIZE,
    color: props.appWhite,
    marginRight: 6,
  },

  desc: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.NORMAL_FONTSIZE,
    color: props.secondaryText,
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
    width: 16,
    height: 16,
  },
});
