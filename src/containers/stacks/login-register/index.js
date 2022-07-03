import * as React from "react";
import { View, ImageBackground, Text, Pressable, StyleSheet } from "react-native";
import CustomButton from "../../../components/page-components/button";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import { navigationRef } from "../../../providers/RootNavigation";
import { isIphoneX } from "../../../../utils/devices";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import TinyImage from "../../../tiny-image";

function LoginRegisterScreen(props) {

  const { backAble = true } = props;
  const { language, activeThemeKey, activeTheme } = useSelector(state => state.globalReducer);
  const handleNavigation = (type) => navigationRef.current.navigate(type);

  return (
    <ImageBackground
      source={{ uri: "https://images.coinpara.com/files/mobile-assets/" + activeThemeKey + "-bg1.jpg" }}
      resizeMode="cover" style={styles(activeTheme).wrapper}>

      {
        backAble && <Pressable style={styles(activeTheme).press}
                               onPress={() => navigationRef.current.canGoBack() && navigationRef.current.goBack()}>

          <TinyImage parent={"rest/"} name={"c-left"} style={styles(activeThemeKey).icon} />
        </Pressable>
      }


      <View style={styles(activeTheme).c1}>

        <View style={styles(activeTheme).c2}>
          <Text style={styles(activeTheme).title}>{getLang(language, "NOT_AUTH_TITLE")}</Text>

          <Pressable onPress={() => navigationRef.current.navigate("MarketsStack")}>
            <Text style={styles(activeTheme).continue}>{getLang(language, "CONTINUE_WITHOUT_REGISTER")}</Text>
          </Pressable>
        </View>


        <View style={styles(activeTheme).c3}>
          <CustomButton filled={false}
                        text={getLang(language, "SIGN_IN")}
                        style={styles(activeTheme).b1}
                        textStyles={styles(activeTheme).txt}
                        onPress={() => handleNavigation("Login")} />


          <CustomButton
            text={getLang(language, "SIGN_UP")}
            filled={true}
            style={styles(activeTheme).b2}
            textStyles={[styles(activeTheme).txt, { color: "#fff" }]}
            onPress={() => handleNavigation("RegisterStack")} />

        </View>
      </View>
    </ImageBackground>
  );
}

export default React.memo(styledHigherOrderComponents(LoginRegisterScreen));

const styles = props => StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: DIMENSIONS.PADDING_H,
    justifyContent: "flex-end",
  },
  c1: { flex: isIphoneX ? .6 : .7, justifyContent: "space-around", alignItems: "center" },
  c2: { width: "100%", flex: .6, justifyContent: "space-around" },
  title: {
    fontFamily: "CircularStd-Book",
    fontSize: 26,
    textAlign: "center",
    color: props.appWhite,
    paddingTop: "30%",
  },
  continue: {
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    textAlign: "center",
    color: props.appWhite,
    marginVertical: 20,
  },
  c3: {
    width: "100%",
    flex: isIphoneX ? .25 : .2,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
  b1: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 32,
    paddingVertical: 0,
    borderWidth: 1,
    borderColor: props.appWhite,
  },
  b2: {
    width: "100%",
    backgroundColor: "rgb(2,123,238)",
    borderRadius: 32,
    paddingVertical: 0,
  },
  txt: {
    fontFamily: "CircularStd-Bold",
    fontSize: 14,
    color: props.appWhite,
    lineHeight: 22,

  },
  press: {
    position: "absolute",
    left: DIMENSIONS.PADDING_H,
    top: 36,
    paddingVertical: DIMENSIONS.PADDING_H * 3,
    paddingRight: DIMENSIONS.PADDING_H * 3,
    paddingLeft: DIMENSIONS.PADDING_H,
  },
  icon: {
    width: 16,
    height: 16,
  },
});
