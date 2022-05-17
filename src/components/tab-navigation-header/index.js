import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { HEADER_HEIGHT, HEADER_TITLE_FONTSIZE, PADDING_H } from "../../../utils/dimensions";
import { StackActions, useNavigation } from "@react-navigation/native";
import TinyImage from "../../tiny-image";

const TabNavigationHeader = (props) => {

  const navigation = useNavigation();
  const { activeTheme } = useSelector(state => state.globalReducer);

  const { backAble, headerRight, isBack = false, preventGoBack = null, options, height = null } = props;

  const modalPresentation = props.options.presentation && props.options.presentation === "transparentModal";

  let title;
  if (props.options && props.options.title) {
    title = props.options && props.options.title;
  }
  if (props.route.params && props.route.params.title) {
    title = props.route.params.title;
  }
  // const popAction = StackActions.pop(1);
  // const handleGoBack = () => preventGoBack ? preventGoBack() : props.navigation.dispatch(StackActions.pop(1));
  const handleGoBack = () => isBack ? preventGoBack ? preventGoBack() : props.navigation.goBack() : navigation.toggleDrawer();

  // props.navigation.goBack();

  const Title = title;


  return (
    <View
      style={[styles(activeTheme).container, {
        height: height || HEADER_HEIGHT,
        backgroundColor: options.bg ? options.bg : activeTheme.backgroundApp,
      }]}>

      {
        backAble && <Pressable
          onPress={handleGoBack}
          style={modalPresentation ? styles(activeTheme).dismissButtonContainer : styles(activeTheme).backButtonContainer}>
          <TinyImage parent={"rest/"} name={modalPresentation ? "dismiss" : isBack ? "c-left" : "drawer"}
                     style={styles(activeTheme).icon} />
        </Pressable>
      }

      {
        headerRight
      }

      {
        typeof Title === "function" ? <Title /> : <Text numberOfLines={1} style={styles(activeTheme).title}>{title}</Text>
      }
    </View>
  );

};

export default TabNavigationHeader;


const styles = (props) => StyleSheet.create({
  container: {
    width: "100%",
    // paddingBottom: 6,
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 999999,
  },
  backButtonContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    paddingTop: 30,
    paddingBottom: 6,
    paddingRight: PADDING_H * 2,
    paddingLeft: PADDING_H,
    zIndex:9999

  },
  dismissButtonContainer: {
    position: "absolute",
    left: 10,
    bottom: 0,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    zIndex:9999
  },
  title: {
    fontFamily: "CircularStd-Bold",
    color: props.appWhite,
    fontSize: HEADER_TITLE_FONTSIZE,
    paddingBottom: 6,
    maxWidth:'70%'
  },
  icon: {
    width: 20,
    height: 20,
  },
});
