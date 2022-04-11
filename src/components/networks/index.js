import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PADDING_H, PADDING_V, TITLE_FONTSIZE } from "../../../utils/dimensions";
import { getLang } from "../../helpers/array-helper";
import { useSelector } from "react-redux";
import TinyImage from "../../tiny-image";


const Networks = (props) => {

  const { activeNetwork, onSelect, networks = [] } = props;

  const { language, activeTheme } = useSelector(state => state.globalReducer);

  if (networks.length <= 0) {
    return null;
  }

  return (
    <View style={styles(activeTheme).wrapper}>
      <View style={styles(activeTheme).titleWrapper}>
        <Text style={styles(activeTheme).title}
              numberOfLines={1}
        >{getLang(language, "NETWORK", "Network")}</Text>
      </View>

      <View style={styles(activeTheme).itemWrapper}>
        {
          networks.map(network => {

            const isActive = activeNetwork === network.Id;

            return (
              <Pressable
                onPress={() =>  onSelect(network.Id, network.CoinNetwork,network)}
                key={network.Id}
                style={[styles(activeTheme).item, {
                  borderWidth: isActive ? 1 : 0,
                  backgroundColor: isActive ? activeTheme.activeListBg : "transparent",
                }]}>
                <Text style={[styles(activeTheme).txt, {
                  color: isActive ? activeTheme.appWhite : activeTheme.borderGray,
                }]}>
                  {network.CoinNetwork}
                </Text>

                {
                  isActive && <TinyImage parent={'rest/'} name={'success'} style={styles(activeTheme).icon}/>
                }

              </Pressable>
            );
          })
        }


      </View>


    </View>
  );

};


export default Networks;

const styles = (props) => StyleSheet.create({
  wrapper: {
    width: "100%",
    // marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    // minHeight: 70,
  },

  itemWrapper: {
    flexDirection: "row",
    // justifyContent: "space-between",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: PADDING_V,
    paddingHorizontal: PADDING_H,
    borderRadius: 24,
    marginRight: PADDING_H,
    borderColor: props.borderGray,

    // maxWidth: 120,
    // minWidth: "26%",
  },
  titleWrapper: {
    // backgroundColor:'blue',
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    paddingVertical: PADDING_V,
    width: "20%",
  },
  title: {
    marginBottom: PADDING_V,
    color: props.appWhite,
    fontFamily: "CircularStd-Bold",
    fontSize: TITLE_FONTSIZE,
    marginTop: 12,
  },
  txt: {
    marginRight: 6,
    fontFamily: "CircularStd-Book",
  },

  icon:{
    width:18,
    height:18,
  }
});
