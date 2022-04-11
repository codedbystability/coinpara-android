import React from "react";
import { View, StyleSheet, Text, Pressable, FlatList } from "react-native";
import {
  MARGIN_T,
  NORMAL_FONTSIZE,
  NORMAL_IMAGE,
  PADDING_H,
  SCREEN_WIDTH, SQUARE_IMAGE,
  SQUARE_ITEM_HEIGHT, TITLE_FONTSIZE,
} from "../../../../utils/dimensions";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import TinyImage from "../../../tiny-image";

const actions = [
  {
    id: 1,
    key: "price-deposit",
    title: "DEPOSIT_TL",
    image: "tl",
    icon: "arrow-down",
  },
  {
    id: 2,
    key: "price-withdraw",
    title: "WITHDRAW_TL",
    image: "tl",
    icon: "arrow-up",

  },
  {
    id: 5,
    key: "instant-trade",
    title: "INSTANT_TRADE",
    image: "instant-trade",

  },
  {
    id: 3,
    key: "crypto-deposit",
    title: "DEPOSIT_CRYPTO",
    image: "crypto",
    icon: "arrow-down",

  },
  {
    id: 4,
    key: "crypto-withdraw",
    title: "WITHDRAW_CRYPTO",
    image: "crypto",
    icon: "arrow-up",

  },
];

const WalletActionTab = (props) => {
  const { handleAction } = props;
  const { activeTheme, language } = useSelector(state => state.globalReducer);

  const card = ({ item }) => {

    return (
      <Pressable onPress={() => handleAction(item)}
                 style={({ pressed }) => [
                   styles(activeTheme).item,
                   {
                     backgroundColor: pressed ? activeTheme.inActiveListBg : activeTheme.darkBackground,
                   },
                 ]}>
        <TinyImage parent={"shortcuts/"} name={item.image}
                   style={styles(activeTheme).img}
        />
        <Text style={styles(activeTheme).text}>{getLang(language, item.title)}</Text>

        {
          item.icon ? <View style={styles(activeTheme).iconW}>
            <TinyImage parent={"shortcuts/"} name={item.icon}
                       style={styles(activeTheme).arr}
            />
          </View> : null
        }


      </Pressable>
    );
  };


  return (
    <View
      style={styles(activeTheme).wrapper}>
      <View style={[styles(activeTheme).innerWrapper]}>
        <FlatList
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
          numColumns={5}
          showsHorizontalScrollIndicator={false}
          data={actions}
          renderItem={card}
          keyExtractor={(item, index) => index}
        />
      </View>
    </View>

  );
};

export default WalletActionTab;


const styles = (props) => StyleSheet.create({
  wrapper: {
    paddingHorizontal: PADDING_H,
    marginVertical: MARGIN_T,
  },
  innerWrapper: {
    width: "100%",
    height: SQUARE_ITEM_HEIGHT + 5,
  },

  shadow: {},
  image: {
    width: NORMAL_IMAGE - 2,
    height: NORMAL_IMAGE - 2,
  },
  iconW: {
    position: "absolute",
    top: 0,
    right: 0,
    height: 20,
    width: 18,
    backgroundColor: props.borderGray,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 4,
    paddingLeft: 2,
  },
  icon: {
    width: 20,
    height: 20,
  },
  text: {
    fontFamily: "CircularStd-Book",
    fontSize: NORMAL_FONTSIZE - 2,
    textAlign: "center",
    color: props.appWhite,
  },


  item: {
    backgroundColor: props.darkBackground,
    width: (SCREEN_WIDTH - (PADDING_H * 2 + (PADDING_H * 2))) / 5,
    height: (SCREEN_WIDTH - (PADDING_H * 2 + (PADDING_H * 6))) / 5,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "space-around",
    marginRight: 4,
    marginVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: props.borderGray,
  },
  annWrapper: {
    paddingHorizontal: PADDING_H,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 8,
    maxHeight: 50,
    height: 50,

  },
  annIcon: { marginRight: 4, width: "10%" },
  txtA: {
    fontSize: TITLE_FONTSIZE,
    color: props.appWhite,
    fontFamily: "CircularStd-Book",
    width: "99%",
    maxWidth: "99%",
  },

  img: {
    width: 20,
    height: 20,
  },
  imgH: {
    width: 22,
    height: 22,
  },
  arr: {
    width: 12,
    height: 12,
  },
  iconA: {
    width: 24,
    height: 28,
  },
});


