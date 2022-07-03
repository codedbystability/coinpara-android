import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { DIMENSIONS } from "../../../../../utils/dimensions";
import { useSelector } from "react-redux";
import PlLoading from "../../../pl-loading";
import TinyImage from "../../../../tiny-image";


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

      <View style={{
        flexDirection: "row",
        alignItems: "center",
      }}>
        <Pressable>
          <TinyImage style={styles(activeTheme).icon} parent={"rest/"} name={"user"} />
        </Pressable>

        <View>
          <Text
            style={styles(activeTheme, fontSizes).name}>{user.Name[0].toUpperCase() + user.Name.toLowerCase().substring(1)} {user.Surname[0].toUpperCase() + user.Surname.toLowerCase().substring(1)} </Text>
          <Text style={[styles(activeTheme, fontSizes).email, {
            color: activeTheme.actionColor,
          }]}>{user.Email}</Text>
        </View>

      </View>
    </View>
  );

};


export default React.memo(UserInfo);

const styles = (props, fontSizes) => StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: DIMENSIONS.PADDING_H,
    borderRadius: 6,
    justifyContent: "center",
    paddingVertical: 8,
    backgroundColor: props.darkBackground,
    marginBottom: 20,
    // borderWidth: 1,
    // borderColor: props.borderGray,
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
    fontSize: fontSizes?.TITLE_FONTSIZE,
    color: props.appWhite,
  },
  email: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.SUBTITLE_FONTSIZE,
    color: props.appWhite,
    marginTop: 5,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: DIMENSIONS.PADDING_H,
  },
});
