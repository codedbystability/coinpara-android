import React, { useEffect } from "react";
import { StyleSheet, Animated, TouchableWithoutFeedback, View, Pressable, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { navigationRef } from "../../../providers/RootNavigation";
import TinyImage from "../../../tiny-image";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { getLang } from "../../../helpers/array-helper";
import { replaceAll } from "../../../helpers/string-helper";

let _open = false;
const FloatingAction = ({ isButton }) => {
  const animation = new Animated.Value(0);
  const { activeTheme, language } = useSelector(state => state.globalReducer);

  useEffect(() => {
    _open = false;
    return () => {
      _open = false;
    };
  }, []);

  const toggleOpen = () => {
    const toValue = _open ? 0 : 1;
    // setIcon(_open ? "fab" : "cancel");

    Animated.timing(animation, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();

    _open = !_open;
  };


  const scaleInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 12],
  });

  const bgStyle = {
    transform: [
      {
        scale: scaleInterpolate,
      },
    ],
  };

  const reloadInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -90],
  });

  const orderInterpolate2 = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const orderInterpolateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-90, 60],
  });

  const orderInterpolateX2 = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-90, -10],
  });

  const lastInterpolate2 = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  const lastInterpolateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60],
  });

  const cancelStyle = {
    transform: [
      {
        scale: animation,
      },
      {
        translateY: reloadInterpolate,
      },
      {
        translateX: orderInterpolateX2,
      },
    ],
  };

  const homeStyle = {
    transform: [
      {
        scale: animation,
      },
      {
        translateY: orderInterpolate2,
      },
      {
        translateX: orderInterpolateX,
      },
    ],
  };

  const lastStyle = {
    transform: [
      {
        scale: animation,
      },
      {
        translateY: lastInterpolate2,
      },
      {
        translateX: lastInterpolateX,
      },
    ],
  };

  const handleNavigation = (type) => navigationRef.current.navigate(type);

  return (

    <Pressable
      onPress={toggleOpen}
      style={styles(activeTheme, isButton).container}>
      <Animated.View style={[styles(activeTheme, isButton).background, bgStyle]} />

      <TouchableOpacity
        activeOpacity={.6}
        onPress={() => handleNavigation("HomeStack")}>

        <Animated.View
          style={[styles(activeTheme, isButton).button2, styles(activeTheme, isButton).other, cancelStyle]}>
          <TinyImage parent={"rest/"} name={"home"} style={styles(activeTheme, isButton).icn} />

          <Text style={styles(activeTheme, true).txt}>{getLang(language, "HOME")}</Text>
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={.6}
        onPress={() => handleNavigation("MarketsStack")}>
        <Animated.View style={[styles(activeTheme, isButton).button2, styles(activeTheme, isButton).other, homeStyle]}>
          <TinyImage parent={"rest/"} name={"candle-chart"} style={styles(activeTheme, isButton).icn} />

          <Text style={styles(activeTheme, true).txt}>{getLang(language, "MARKETS")}</Text>
        </Animated.View>
      </TouchableOpacity>


      <TouchableOpacity
        activeOpacity={.6}
        onPress={() => handleNavigation("WalletStack")}>
        <Animated.View style={[styles(activeTheme, isButton).button2, styles(activeTheme, isButton).other, lastStyle]}>
          <TinyImage parent={"rest/"} name={"empty-coins"} style={styles(activeTheme, isButton).icn} />
          <Text style={styles(activeTheme, true).txt}>{getLang(language, "WALLET")}</Text>
        </Animated.View>
      </TouchableOpacity>


      <TouchableWithoutFeedback onPress={toggleOpen}>
        <View style={[styles(activeTheme, isButton).button, styles(activeTheme, isButton).pay]}>
          <TinyImage parent={"rest/"} name={"floating"} style={styles(activeTheme, isButton).icn2} />
        </View>
      </TouchableWithoutFeedback>


    </Pressable>

  );
};

export default React.memo(FloatingAction);

const styles = (props, isButton) => StyleSheet.create({
  container: {
    height: 40,
    width: 40,
    borderRadius: 20,
    position: "absolute",
    left: DIMENSIONS.PADDING_H,
    bottom: isButton ? 72 : DIMENSIONS.PADDING_H * 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: props.darkBackground,
    borderWidth: 1,
    borderColor: props.appWhite,
  },
  background: {
    height: 40,
    width: 40,
    borderRadius: 20,
    position: "absolute",
    left: DIMENSIONS.PADDING_H * 2,
    bottom: isButton ? 16 : DIMENSIONS.PADDING_H * 2,
    alignItems: "center",
    justifyContent: "center",
    padding: DIMENSIONS.PADDING_H,
    backgroundColor: replaceAll(props.inActiveListBg, "1)", "0.6)"),

  },
  button2: {
    height: 50,
    width: 50,
    borderRadius: 8,
    position: "absolute",
    left: DIMENSIONS.PADDING_H * 2,
    bottom: isButton ? 16 : DIMENSIONS.PADDING_H * 2,
    backgroundColor: props.darkBackground,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: props.actionColor,
  },
  button: {
    height: "100%",
    width: "100%",
    borderRadius: 20,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    padding: DIMENSIONS.PADDING_H,
    backgroundColor: props.darkBackground,
    borderColor: props.borderGray,
    borderWidth: 1,
  },
  other: {
    backgroundColor: props.backgroundApp,
  },
  payText: {
    color: "#FFF",
  },
  pay: {
    // backgroundColor: props.darkBackground,
  },
  icn: {
    width: 24,
    height: 24,
  },
  icn2: {
    width: 20,
    height: 20,
  },
  label: {
    color: "red",
    position: "absolute",
    fontSize: DIMENSIONS.NORMAL_FONTSIZE,
    bottom: -20,
    textAlign: "center",
    width: "100%",
  },
  txt: {
    position: "absolute",
    left: 58,
    fontSize: DIMENSIONS.NORMAL_FONTSIZE - 2,
    fontFamily: "CircularStd-Bold",
    width: 120,
    color: props.appWhite,
  },

});

