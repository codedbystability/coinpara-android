import React from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  divide,
  interpolate,
  Extrapolate,
  sub,
  cond,
  add,
  lessThan,
  multiply,
} from "react-native-reanimated";

import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import { LIST_ITEM_HEIGHT } from "../../../../utils/dimensions";

const styles = StyleSheet.create({
  remove: {
    color: "white",
    fontSize: 14,
  },
});

interface ActionProps {
  x: Animated.Node<number>;
  deleteOpacity: Animated.Node<number>;
}

const Action = ({ x, deleteOpacity }: ActionProps) => {

  const { language } = useSelector(state => state.globalReducer);
  const size = cond(lessThan(x, LIST_ITEM_HEIGHT), x, add(x, sub(x, LIST_ITEM_HEIGHT)));
  const translateX = cond(lessThan(x, LIST_ITEM_HEIGHT), 0, divide(sub(x, LIST_ITEM_HEIGHT), 2));
  const borderRadius = divide(size, 2);
  const scale = interpolate(size, {
    inputRange: [20, 30],
    outputRange: [0.01, 1],
    extrapolate: Extrapolate.CLAMP,
  });
  const iconOpacity = interpolate(size, {
    inputRange: [LIST_ITEM_HEIGHT - 10, LIST_ITEM_HEIGHT + 10],
    outputRange: [1, 0],
  });
  const textOpacity = sub(1, iconOpacity);
  return (
    <Animated.View
      style={{
        backgroundColor: "#D93F12",
        borderRadius,
        justifyContent: "center",
        alignItems: "center",
        height: size,
        width: size,
        transform: [{ translateX }],
      }}
    >
      <Animated.View
        style={{
          height: 5,
          width: 20,
          backgroundColor: "white",
          opacity: iconOpacity,
          transform: [{ scale }],
        }}
      />
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: "center",
          alignItems: "center",
          opacity: multiply(textOpacity, deleteOpacity),

        }}
      >
        <Text style={styles.remove}>{getLang(language, "DELETE")}</Text>
      </Animated.View>
    </Animated.View>
  );
};

export default Action;
