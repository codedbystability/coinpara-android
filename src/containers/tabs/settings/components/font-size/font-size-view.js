import React, { useCallback, useEffect, useState } from "react";
import {  TouchableOpacity, StyleSheet, Text, View } from "react-native";
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import TinyImage from "../../../../../tiny-image";
import {
  PADDING_H,
  SCREEN_WIDTH,
} from "../../../../../../utils/dimensions";
import { useDispatch, useSelector } from "react-redux";
import { getLang } from "../../../../../helpers/array-helper";
import { setFontSize } from "../../../../../actions/global-actions";
import LocalStorage from "../../../../../providers/LocalStorage";

const BUTTON_WIDTH = SCREEN_WIDTH - (PADDING_H * 2);
const INITIAL_COUNT = 11;
const MIN_COUNT = 9;
const MAX_COUNT = 15;
const FontSizeView = () => {
  const { activeTheme, fontSizes, fontSizeActive, language } = useSelector(state => state.globalReducer);
  const dispatch = useDispatch();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);


  const [count, setCount] = useState(0);

  const MAX_SLIDE_OFFSET = BUTTON_WIDTH * 0.3;

  // wrapper function
  const incrementCount = useCallback(() => {
    // external library function
    setCount(currentCount => currentCount + 1 > MAX_COUNT ? currentCount : currentCount + 1);
  }, []);

  const decrementCount = useCallback(() => {
    setCount(currentCount => currentCount - 1 < MIN_COUNT ? currentCount : currentCount - 1);
  }, []);

  const resetCount = useCallback(() => {
    setCount(INITIAL_COUNT);
  }, []);

  useEffect(() => {
    LocalStorage.setItem("FONT_SIZE", count.toString());
    dispatch(setFontSize(count));
  }, [count]);

  useEffect(() => {
    if (count === 0) {
      setCount(fontSizeActive);
    }
  }, [fontSizeActive]);

  const onPanGestureEvent =
    useAnimatedGestureHandler({
      onActive: (event) => {
        translateX.value = Math.min(Math.max(event.translationX, -MAX_SLIDE_OFFSET), MAX_SLIDE_OFFSET);
        translateY.value = Math.min(Math.max(event.translationY, 0), MAX_SLIDE_OFFSET);
      },
      onEnd: () => {
        if (translateX.value === MAX_SLIDE_OFFSET) {
          // Increment
          runOnJS(incrementCount)();
        } else if (translateX.value === -MAX_SLIDE_OFFSET) {
          // Decrement
          runOnJS(decrementCount)();
        } else if (translateY.value === MAX_SLIDE_OFFSET) {
          runOnJS(resetCount)();
        }

        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      },
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  }, []);

  const rPlusMinusIconStyle = useAnimatedStyle(() => {
    const opacityX = interpolate(
      translateX.value,
      [-MAX_SLIDE_OFFSET, 0, MAX_SLIDE_OFFSET],
      [0.4, 0.8, 0.4],
    );

    const opacityY = interpolate(
      translateY.value,
      [0, MAX_SLIDE_OFFSET],
      [1, 0],
    );

    return {
      opacity: opacityX * opacityY,
    };
  }, []);

  const rCloseIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, MAX_SLIDE_OFFSET],
      [0, 0.8],
    );

    return {
      opacity,
    };
  }, []);

  const rButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value * 0.1,
        },
        { translateY: translateY.value * 0.1 },
      ],
    };
  }, []);

  return (
    <GestureHandlerRootView style={{
      flex: 1,
    }}>
      <View style={{
        flex: 1,
        justifyContent: "center",
      }}>
        <Text
          style={styles(activeTheme, fontSizes).title}>{getLang(language, "YOU_CAN_CUSTOMIZE_FONTSIZE")}</Text>

        <Animated.View style={[styles(activeTheme).button, rButtonStyle]}>
          <TouchableOpacity onPress={decrementCount} style={{
            paddingHorizontal:10,
            zIndex:99
          }}>
            <Animated.View style={[rPlusMinusIconStyle, {
              justifyContent: "center",
              alignItems: "center",
            }]}>

              <Text style={styles(activeTheme, fontSizes).text}>-</Text>
            </Animated.View>
          </TouchableOpacity>
          <Animated.View style={rCloseIconStyle}>
            <TinyImage parent={"rest/"} name={"cancel"} style={{
              width: 22,
              height: 22,
            }} />
          </Animated.View>
          <TouchableOpacity onPress={incrementCount} style={{
            paddingHorizontal:10,
            zIndex:99
          }}>
            <Animated.View style={rPlusMinusIconStyle}>
              <Text style={[styles(activeTheme, fontSizes).text, {
                justifyContent: "center",
                alignItems: "center",
              }]}>+</Text>
            </Animated.View>
          </TouchableOpacity>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PanGestureHandler onGestureEvent={onPanGestureEvent}>
              <Animated.View style={[styles(activeTheme).circle, rStyle]}>
                <Text style={styles(activeTheme, fontSizes).countText}>{count}</Text>
              </Animated.View>
            </PanGestureHandler>
          </View>
        </Animated.View>
      </View>
    </GestureHandlerRootView>
  );
};

export default FontSizeView;

const styles = (props, fontSizes) => StyleSheet.create({
  button: {
    height: 50,
    width: BUTTON_WIDTH,
    backgroundColor: props.darkBackground,
    borderWidth: 2,
    borderColor: props.borderGray,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    marginVertical: PADDING_H / 2,

  },
  countText: {
    fontSize: fontSizes?.BIG_TITLE_FONTSIZE + 2,
    color: props.appWhite,
    fontFamily: "CircularStd-Bold",
  },
  circle: {
    height: 50,
    width: 90,
    backgroundColor: props.activeListBg,
    borderColor: props.actionColor,
    borderWidth: 3,
    borderRadius: 25,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "CircularStd-Bold",
    fontSize: fontSizes?.HEADER_TITLE_FONTSIZE + 10,
    color: props.appWhite,
  },
  title: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.TITLE_FONTSIZE,
    // lineHeight: 16,
    color: props.secondaryText,
    marginTop: 12,
  },
});
