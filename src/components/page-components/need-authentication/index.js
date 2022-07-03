import React from "react";
import CustomButton from "../button";
import { ScrollView, Text, View, StyleSheet, Image } from "react-native";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { navigationRef } from "../../../providers/RootNavigation";
import LoginRegisterScreen from "../../../containers/stacks/login-register";
import { isIphoneX } from "../../../../utils/devices";

const NeedAuthentication = ({ isFull = true, scrollEnable = true, isSmall = false, isMinimal = false }) => {
  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const handleNavigation = (type) => navigationRef.current.navigate(type);


  if (isMinimal) {
    return (
      <ScrollView scrollEnabled={scrollEnable}
                  contentContainerStyle={[styles(activeTheme).wrapper, isFull && { flex: 1 }]}>

        <View style={isSmall ? styles(activeTheme).titleWrapperS : styles(activeTheme).titleWrapper}>
          <Image
            source={{ uri: "https://images.coinpara.com/files/mobile-assets/logo.png" }}
            style={styles(activeTheme).imgMN} resizeMode={"contain"} />
        </View>


        <Text
          style={isSmall ? styles(activeTheme).titleS : styles(activeTheme).title}>{getLang(language, "NOT_AUTH_TITLE")}</Text>


        <View style={styles(activeTheme).inn}>
          <CustomButton onPress={() => handleNavigation("Login")}
                        text={getLang(language, "LOGIN")}
                        style={styles(activeTheme).b1}
                        textStyles={styles(activeTheme).t1}
                        filled={true} isRadius={true} />

          <View style={styles(activeTheme).btnWrap} />

          <CustomButton onPress={() => handleNavigation("RegisterEmail")}
                        text={getLang(language, "SIGN_UP")}
                        style={styles(activeTheme).b2}
                        textStyles={styles(activeTheme).t2}
                        filled={false} isRadius={true} isBorder={true} />
        </View>


      </ScrollView>
    );
  }

  return <LoginRegisterScreen backAble={false} />;
};


export default NeedAuthentication;

const styles = (props) => StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    paddingHorizontal: DIMENSIONS.PADDING_H,
    paddingTop: "10%",
  },
  btnWrap: {
    height: 10,
  },
  titleWrapper: {
    marginTop: 16,
    alignItems: "center",
  },
  title: {
    color: props.appWhite,
    textAlign: "center",
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    marginVertical: DIMENSIONS.PADDING_V,
  },
  img: {
    height: 70,
    width: 70,
    marginBottom: DIMENSIONS.MARGIN_T,
    tintColor: props.appWhite,
  },

  titleWrapperS: {
    marginTop: 2,
    alignItems: "center",
  },
  titleS: {
    color: props.appWhite,
    textAlign: "center",
    fontFamily: "CircularStd-Book",
    fontSize: 14,
    marginVertical: 4,
  },
  imgS: {
    height: 44,
    width: 44,
    marginBottom: DIMENSIONS.MARGIN_T,
    tintColor: props.appWhite,
  },
  imgMN: {
    height: 56,
    width: 56,
    marginTop: isIphoneX ? DIMENSIONS.MARGIN_T * 2 : 6,
    marginBottom: isIphoneX ? DIMENSIONS.MARGIN_T * 2 : 6,
    tintColor: props.appWhite,
  },
  inn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  b1: {
    paddingVertical: 2,
    width: "40%",
    backgroundColor: props.actionColor,
    marginRight: 10,
  },
  t1: {
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    color: props.buttonWhite,
    fontFamily: "CircularStd-Book",
  },
  b2: {
    paddingVertical: 2,
    width: "40%",
    backgroundColor: props.borderGray,
    marginLeft: 10,
  },
  t2: {
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    color: props.buttonWhite,
    fontFamily: "CircularStd-Book",
  },
});
