import React, { useState, useEffect, useRef } from "react";
import {
  Keyboard,
  Animated,
  Text,
  View, Pressable, ScrollView,
} from "react-native";
import { PADDING_H, SCREEN_WIDTH } from "../../../utils/dimensions";
import TinyImage from "../../tiny-image";
import { isIphoneX } from "../../../utils/devices";

const InputAccessory = (props) => {
  const {
    onPress = () => null,
    mailProviders = [],
    isAddition = true,
    isDelete = false,
    stepAble = false,
    onDelete = () => null,
    handleStep = () => null,
    tabBarShown = false,
  } = props;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [keyboardShowing, setKeyboardShowing] = useState(false);

  const [bottom, setBottom] = useState(0);

  const handleDismiss = () => {
    setKeyboardShowing(false);
    Keyboard.dismiss();
  };
  const handleNext = () => handleStep("next");

  const handlePrev = () => handleStep("prev");


  useEffect(() => {
    const keyboardHiddenListener = Keyboard.addListener("keyboardWillShow", _keyboardWillShow);
    const keyboardShownListener = Keyboard.addListener("keyboardWillHide", _keyboardWillHide);

    // cleanup function
    return () => {
      keyboardHiddenListener.remove();
      keyboardShownListener.remove();
      // Keyboard.removeListener("keyboardWillShow", _keyboardWillShow);
      // Keyboard.removeListener("keyboardWillHide", _keyboardWillHide);
    };
  }, []);

  const _keyboardWillShow = (e) => {
    setKeyboardShowing(true);
    setBottom(tabBarShown && isIphoneX ? e.endCoordinates.height - 80 : tabBarShown && !isIphoneX ? e.endCoordinates.height - 60 : e.endCoordinates.height);
  };

  const _keyboardWillHide = (e) => {
    setKeyboardShowing(false);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }).start();

  };

  return (
    <Animated.View
      style={{
        // backgroundColor: activeTheme.darkBackground,
        backgroundColor: "rgb(41,49,59)",
        position: "absolute",
        bottom: bottom,
        height: 48,
        width: SCREEN_WIDTH,
        marginBottom: 0,
        display: keyboardShowing ? "flex" : "none",
        alignItems: "center",
        flexDirection: "row",
        // borderTop: "solid",
        // borderTopWidth: 1,
        // borderTopColor: activeTheme.borderGray,
        paddingHorizontal: 4,
      }}
    >

      {
        stepAble && <View style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "14%",
        }}>
          <Pressable onPress={handlePrev} style={{
            width: "50%",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <TinyImage parent={"rest/"} name={"c-up"} style={{
              width: 22,
              height: 22,
            }} />
          </Pressable>
          <Pressable style={{
            width: "50%",
            alignItems: "center",
            justifyContent: "center",
          }} onPress={handleNext}>
            <TinyImage parent={"rest/"} name={"c-down"} style={{
              width: 22,
              height: 22,
            }} />
          </Pressable>
        </View>
      }

      <ScrollView
        keyboardShouldPersistTaps={"always"}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={{
          width: stepAble ? "76%" : "80%",
        }}
        contentContainerStyle={{
          height: "100%",
          paddingHorizontal: PADDING_H,
        }}
      >

        {
          mailProviders.map((item, i) => (
            <Pressable
              key={i}
              onPress={() => onPress(item.value)}
              style={{
                borderWidth: 1,
                borderColor: "rgba(235,235,235,.2)",
                borderRadius: 8,
                padding: 4,
                marginRight: 8,
              }}>
              <Text style={{
                color: "rgba(235,235,235,1)",
              }}>
                {isAddition ? "@" + item.value : item.value}
              </Text>
            </Pressable>
          ))
        }


      </ScrollView>

      <View style={{
        // alignItems: "center",
        justifyContent: "space-around",
        height: "100%",
        flexDirection: "row",
        width: "20%",
      }}>

        {
          mailProviders.length >= 1 && isDelete && <Pressable
            style={{
              height: "100%",
              width: "50%",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={onDelete}>

            <TinyImage parent={"rest/"} name={"cancel"} style={{
              width: 22,
              height: 22,
            }} />
          </Pressable>
        }


        <Pressable
          style={{
            height: "100%",
            width: "50%",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={handleDismiss}>
          <TinyImage parent={"rest/"} name={"keyboard-close"} style={{
            width: 22,
            height: 22,
          }} />
        </Pressable>
      </View>


    </Animated.View>
  );
};

export default InputAccessory;
