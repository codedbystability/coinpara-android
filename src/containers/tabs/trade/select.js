import * as React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import DynamicImage from "../../../components/page-components/dynamic-image";
import { getLang } from "../../../helpers/array-helper";
import { useState } from "react";
import ModalProvider from "../../../providers/ModalProvider";
import MarketSelect from "../../../components/page-components/market-select";
import { useSelector } from "react-redux";
import { DIMENSIONS } from "../../../../utils/dimensions";
import HapticProvider from "../../../providers/HapticProvider";
import TinyImage from "../../../tiny-image";

const TradeSelect = (props) => {

  const {
    selectedMarket,
    handleSelect,
  } = props;

  const {
    language,
    activeTheme,
  } = useSelector(state => state.globalReducer);

  const [coinType, setCoinType] = useState("crypto");

  const handleItemSelect = (item) => {
    handleSelect(item);
    ModalProvider.hide();
  };

  const showModal = () => {
    HapticProvider.trigger();
    ModalProvider.show(() => <MarketSelect
      isBoth={false}
      isTrending={true}
      initialActiveType={coinType}
      type={"MARKETS"}
      setActiveType={setCoinType}
      handleSelect={handleItemSelect}
    />, true);
  };


  return (
    <View style={styles(activeTheme).wrapper}>
      <Pressable
        onPress={showModal}
        style={styles(activeTheme).selectContainer}>
        {
          selectedMarket && selectedMarket.to ?
            <View style={styles(activeTheme).conn}>
              <View style={styles(activeTheme).mid}>
                <DynamicImage style={styles(activeTheme).img} market={selectedMarket.to} />

                <Text style={styles(activeTheme).text}>
                  {selectedMarket.to.toUpperCase()}
                </Text>
              </View>

              <View style={styles(activeTheme).icon}>
                <TinyImage parent={'rest/'} name={'c-down'} style={styles(activeTheme).icn}/>
              </View>
            </View>
            :
            <>
              <Text style={styles(activeTheme).text}>
                {getLang(language, "CHOOSE")}
              </Text>
              <TinyImage parent={'rest/'} name={'c-down'} style={styles(activeTheme).icn}/>
            </>
        }
      </Pressable>
    </View>
  );
};


export default React.memo(TradeSelect);
const styles = (props) => StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
  },
  selectContainer: {
    height: 50,
    width: DIMENSIONS.SCREEN_WIDTH / 3,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: props.actionColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: props.appWhite,
    fontFamily: "CircularStd-Book",
  },
  img: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
  icon: {
    right: 8,
  },
  icon2: {
    position: "absolute",
    right: 10,
  },
  icn:{
    width:14,
    height:16,
  },
  mid: {
    flexDirection: "row", alignItems: "center",
  },
  conn: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
