import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  Swipeable,
} from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import TinyImage from "../../../../tiny-image";
import { DIMENSIONS } from "../../../../../utils/dimensions";


const SwipeAbleItem = ({ onSwipe, Layout, item, style = null, swipeAble = true }) => {

  const { activeTheme } = useSelector(state => state.globalReducer);

  const RenderRight = ({ onSwipe }) => (
    <Pressable onPress={() => onSwipe(item)}
               style={[styles(activeTheme).swipeContainer, style]}>
      <View>
        <TinyImage parent={"rest/"} name={"trash"} style={styles(activeTheme).trash} />
      </View>
    </Pressable>);


  return (
    <Swipeable
      renderRightActions={() => swipeAble && <RenderRight {...{ onSwipe }} />}>
      <Layout />
    </Swipeable>
  );

};

export default SwipeAbleItem;

const styles = (props) => StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  text: {
    color: "#4a4a4a",
    fontSize: 15,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "#e4e4e4",
    marginLeft: 10,
  },
  leftAction: {
    backgroundColor: "#388e3c",
    justifyContent: "center",
    flex: 1,
  },
  rightAction: {
    backgroundColor: "#dd2c00",
    justifyContent: "center",
    // flex: 1,
    height: DIMENSIONS.LIST_ITEM_HEIGHT,
    flex: 1,
    // alignItems: "flex-end",
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    padding: 20,
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden",
  },

  swipeContainer: {
    justifyContent: "center",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    paddingHorizontal: 30,
    marginLeft: 12,
    backgroundColor: props.noRed,
  },
  trash: {
    width: 18,
    height: 18,
  },
});
