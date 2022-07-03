import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  Extrapolate,
  withRepeat,
  withDelay,
  Easing,
} from "react-native-reanimated";
import DynamicImage from "../dynamic-image";
import { useSelector } from "react-redux";

const Pulse = ({ delay = 0, repeat, borderColor = "#e91e63", backgroundColor = "#ff6090" }) => {
  const animation = useSharedValue(0);
  useEffect(() => {
    animation.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 1000,
          easing: Easing.linear,
        }),
        repeat ? -1 : 1,
        false,
      ),
    );
  }, []);
  const animatedStyles = useAnimatedStyle(() => {
    const opacity = interpolate(
      animation.value,
      [0, 1],
      [0.2, 0],
      Extrapolate.CLAMP,
    );
    return {
      opacity: opacity,
      transform: [{ scale: animation.value }],
    };
  });
  return <Animated.View
    style={[styles.circle, animatedStyles, {
      borderColor: borderColor,
      backgroundColor: backgroundColor,
    }]} />;
};

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

export default function PulseAnimation({ market = null }) {
  const { activeTheme } = useSelector(state => state.globalReducer);
  const [pulse, setPulse] = useState([1]);

  useInterval(() => {
    setPulse((prev) => [...prev, Math.random()]);
  }, 500);


  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Pressable
        style={[styles.innerCircle, {
          backgroundColor: activeTheme.activeListBg,
          borderColor: activeTheme.inActiveListBg,

        }]}
        onPress={() => {
          setPulse((prev) => [...prev, Math.random()]);
        }}>
        {
          market ? <DynamicImage market={market} style={{
              width: 30,
              height: 30,
            }} /> :
            <Image
              source={{
                uri: "https://images.coinpara.com/files/mobile-assets/logo.png",
              }}
              style={{
                width: 22,
                height: 22,
                tintColor: activeTheme.appWhite,
              }}
              resizeMode={"contain"} />
        }

      </Pressable>
      {pulse.map((item, index) => (
        <Pulse repeat={index === 0}
               key={index}
               backgroundColor={activeTheme.inActiveListBg}
               borderColor={activeTheme.activeListBg}
          // borderColor={activeTheme.noRed}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  circle: {
    width: 240,
    borderRadius: 120,
    height: 240,
    position: "absolute",
    borderColor: "red",
    // backgroundColor: "red",
    borderWidth: 14,
  },
  innerCircle: {
    width: 60,
    borderRadius: 30,
    height: 60,
    zIndex: 100,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,

  },
});
