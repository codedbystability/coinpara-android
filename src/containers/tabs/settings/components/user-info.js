import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  PADDING_H,
  PADDING_V,
} from "../../../../../utils/dimensions";
import { useSelector } from "react-redux";
import PlLoading from "../../../pl-loading";


const UserInfo = () => {

  const { activeTheme, fontSizes } = useSelector(state => state.globalReducer);
  const { user } = useSelector(state => state.authenticationReducer);

  if (!user || Object.keys(user).length <= 0) {
    return <PlLoading height={120} />;
  }
  return (
    <View
      style={[styles(activeTheme).container, styles(activeTheme).shadow]}>
      <Text style={styles(activeTheme, fontSizes).refCode}>#{user.AffiliateCode}</Text>
      <Text
        style={styles(activeTheme, fontSizes).name}>{user.Name[0].toUpperCase() + user.Name.toLowerCase().substring(1)} {user.Surname[0].toUpperCase() + user.Surname.toLowerCase().substring(1)} </Text>
      <Text style={[styles(activeTheme, fontSizes).email, {
        color: activeTheme.actionColor,
      }]}>{user.Email}</Text>
    </View>
  );

};


export default React.memo(UserInfo);

const styles = (props, fontSizes) => StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: PADDING_H,
    borderRadius: 6,
    justifyContent: "center",
    paddingVertical: PADDING_V * 1.4,
    backgroundColor: props.darkBackground,
    borderWidth: 1,
    borderColor: props.borderGray,
  },
  shadow: {},
  refCode: {
    fontFamily: "CircularStd-Bold",
    fontSize: fontSizes?.NORMAL_FONTSIZE,
    color: props.appWhite,
    position: "absolute",
    right: 10,
    top: 5,
    lineHeight: 22,
    letterSpacing: 0,
  },
  name: {
    fontFamily: "CircularStd-Bold",
    fontSize: fontSizes?.BIG_TITLE_FONTSIZE,
    color: props.appWhite,
  },
  email: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.BIG_TITLE_FONTSIZE,
    color: props.appWhite,
    marginTop: 5,
  },
});
