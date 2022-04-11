import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ActivityIndicator, Animated } from "react-native";
import styles from "./Loading.styles";
import PulseAnimation from "../../pulse";

const Loading = () => {
  const [isShowLoading, setIsShowLoading] = useState(false);
  const { isFetching } = useSelector(state => state.globalReducer);

  const animatedValue = useRef(new Animated.Value(0)).current;

  const animatedValueOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  useEffect(() => {
    let timeout = "";
    if (isFetching) {
      setIsShowLoading(true);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();

      timeout = setTimeout(() => {
        setIsShowLoading(false);
      }, 500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isFetching]);

  if (isShowLoading) {
    return (
      <Animated.View
        style={[
          styles.loadingView,
          {
            opacity: animatedValueOpacity,
          },
        ]}
      >
        {/*<ActivityIndicator color={"#fff"} />*/}

        <PulseAnimation />
      </Animated.View>
    );
  }

  return null;
};

export default Loading;
