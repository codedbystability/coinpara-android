import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { DIMENSIONS } from "../../../../../utils/dimensions";
import TinyImage from "../../../../tiny-image";


const MarketDetailHeader = (props) => {

  const { handleHeaderAction, market, preventGoBack, handleShowMarketList } = props;
  const { authenticated } = useSelector(state => state.authenticationReducer);
  const { activeTheme } = useSelector(state => state.globalReducer);


  const handleFav = () => handleHeaderAction("favorite");
  return (
    <View
      style={[styles(activeTheme).container, {
        height: DIMENSIONS.HEADER_HEIGHT,
        backgroundColor: activeTheme.darkBackground,
      }]}>

      <Pressable onPress={preventGoBack}
                 style={styles(activeTheme).backButtonContainer}>
        <TinyImage parent={"rest/"} name={"c-left"} style={styles(activeTheme).icon} />
      </Pressable>


      <Pressable
        onPress={handleShowMarketList}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          flexDirection: "row",
          alignItems: "center",
        }}>
        <TinyImage parent={"rest/"} name={"refresh"} style={styles(activeTheme).icon} />

        <Text style={styles(activeTheme).title}>{market.to + "/" + market.fs}</Text>
      </Pressable>


      {
        authenticated && <View style={styles(activeTheme).headerRightWrapper}>
          <View>
            <Pressable style={styles(activeTheme).padding} onPress={handleFav}>
              <TinyImage parent={"rest/"} name={market.if ? "fav-active" : "fav"}
                         style={styles(activeTheme).icon2} />
            </Pressable>
          </View>
        </View>

      }
    </View>
  );


};

export default MarketDetailHeader;

const styles = (props) => StyleSheet.create({
  headerRightWrapper: {
    position: "absolute",
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  icon: {
    width: 18,
    height: 18,
  },
  icon2: {
    width: 22,
    height: 22,
  },
  alert: {
    width: DIMENSIONS.NORMAL_IMAGE * 0.6,
    height: DIMENSIONS.NORMAL_IMAGE * 0.6,
    tintColor: props.appWhite,
  },
  padding: { padding: 10 },
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
    paddingVertical: 10,
    paddingHorizontal: DIMENSIONS.PADDING_H,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  dismissButtonContainer: {
    position: "absolute",
    left: 10,
    bottom: 8,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "CircularStd-Bold",
    color: props.appWhite,
    fontSize: DIMENSIONS.HEADER_TITLE_FONTSIZE,
    marginLeft: 10,
  },
});
