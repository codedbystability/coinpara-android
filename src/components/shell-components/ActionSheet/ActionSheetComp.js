import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { setActionSheetRef } from "../../../providers/ActionSheetComProvider";
import { Text, TouchableOpacity, View, Pressable, Animated } from "react-native";
import styles from "./ActionSheetComp.styles";

const fake = {
  title: "",
  options: [],
  onAction: null,
  animate: true,
};
const ActionSheetComp = forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({
    show: show,
    hide: hide,
  }));

  const { activeTheme, activeThemeKey } = useSelector(state => state.globalReducer);
  const [params, setParams] = useState(fake);
  // const animatedValue = new Animated.Value(0);
  const [visible, setVisible] = useState(false);
  const show = (title, options, onAction, animate = true) => {
    setParams({
      title,
      options,
      onAction,
      animate,
    });
    // slideUp();

  };

  const hide = () => slideDown();

  const handleAction = (i) => slideDown().then(r => params.onAction(i));


  useEffect(() => {
    if (params.title) {
      slideUp();
    }
  }, [params]);


  const slideUp = () => setVisible(true);

  // const slideUp = () => {
  //
  //   Animated.spring(animatedValue, {
  //     toValue: 0,
  //     useNativeDriver: true,
  //     duration: 2000,
  //     friction: 6,
  //   }).start(() => {
  //     console.log("shown");
  //
  //   });
  // };

  const slideDown = async () => {
    if (!params || !params.animate) {
      return;
    }

    setParams({});
    setVisible(false);

  };
  //
  // const position = {
  //   transform: [
  //     {
  //       translateY: animatedValue,
  //     },
  //   ],
  // };

  // const position= {
  //   transform: [
  //     {
  //       translateY: this.animatedValue.interpolate({
  //         inputRange: [0, 1],
  //         outputRange: [startY - (height / 2) - (height * initialScale / 2), endY]
  //       })
  //     }
  //   ]
  // };
  if (!visible || !params.options || params.options.length <= 0)
    return null;

  return (

    <Pressable
      // onPress={slideDown}
      style={[styles(activeTheme).wrap, {
        backgroundColor: activeThemeKey === "light" ? "rgba(0,0,0,.8)" : "rgba(31,31,31,.8)",
      }]}>
      <View
        style={[styles(activeTheme).modal]}>

        <View style={{ alignItems: "center" }}>
          <Text style={styles(activeTheme).modalText}>
            {params.title}
          </Text>
        </View>

        {
          params.options.map((option, i) => <TouchableOpacity
            activeOpacity={.8}
            key={option} style={styles(activeTheme).button}
            onPress={() => handleAction(i)}>
            <Text
              style={[i === params.options.length - 1 ? styles(activeTheme).cancel : styles(activeTheme).text]}>{option}</Text>
          </TouchableOpacity>)
        }
      </View>
    </Pressable>
  );
});

const CustomActionSheetComp = () => {
  return (
    <ActionSheetComp ref={(ref) => setActionSheetRef(ref)} />
  );
};

export default CustomActionSheetComp;

