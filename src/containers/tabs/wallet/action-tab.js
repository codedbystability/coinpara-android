import React from "react";
import { View, StyleSheet, Text, Pressable, FlatList } from "react-native";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import TinyImage from "../../../tiny-image";

const actions = [
  {
    id: 1,
    key: "price-deposit",
    title: "DEPOSIT_TL",
    image: "tl-deposit",
    icon: "arrow-down",
  },
  {
    id: 2,
    key: "price-withdraw",
    title: "WITHDRAW_TL",
    image: "tl-withdraw",
    icon: "arrow-up",

  },
  {
    id: 5,
    key: "instant-trade",
    title: "INSTANT_TRADE",
    image: "instant-trade-2",

  },
  {
    id: 3,
    key: "crypto-deposit",
    title: "DEPOSIT_CRYPTO",
    image: "crypto-deposit",
    icon: "arrow-down",

  },
  {
    id: 4,
    key: "crypto-withdraw",
    title: "WITHDRAW_CRYPTO",
    image: "crypto-withdraw",
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
                     // backgroundColor: pressed ? activeTheme.inActiveListBg : activeTheme.darkBackground,
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
    paddingHorizontal: DIMENSIONS.PADDING_H,
    marginTop: DIMENSIONS.MARGIN_T,
  },
  innerWrapper: {
    width: "100%",
    height: DIMENSIONS.SQUARE_ITEM_HEIGHT + 5,
  },

  shadow: {},
  image: {
    width: DIMENSIONS.NORMAL_IMAGE - 2,
    height: DIMENSIONS.NORMAL_IMAGE - 2,
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
    width: 22,
    height: 22,
  },
  text: {
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.NORMAL_FONTSIZE - 2,
    textAlign: "center",
    color: props.appWhite,
  },


  item: {
    // backgroundColor: props.darkBackground,
    width: (DIMENSIONS.SCREEN_WIDTH - (DIMENSIONS.PADDING_H * 2 + (DIMENSIONS.PADDING_H * 2))) / 5,
    height: (DIMENSIONS.SCREEN_WIDTH - (DIMENSIONS.PADDING_H * 2 + (DIMENSIONS.PADDING_H * 6))) / 5,
    alignItems: "center",
    justifyContent: "space-around",
    marginRight: 4,
    marginVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 2,
    // borderWidth: 1,
    // borderColor: props.borderGray,
  },
  annWrapper: {
    paddingHorizontal: DIMENSIONS.PADDING_H,
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
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    color: props.appWhite,
    fontFamily: "CircularStd-Book",
    width: "99%",
    maxWidth: "99%",
  },

  img: {
    width: 24,
    height: 24,
  },
  imgH: {
    width: 20,
    height: 20,
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


