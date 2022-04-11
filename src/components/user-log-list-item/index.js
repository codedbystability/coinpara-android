import React, { forwardRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BIG_TITLE_FONTSIZE, LIST_MARGIN_T, NORMAL_FONTSIZE, TITLE_FONTSIZE } from "../../../utils/dimensions";
import { useSelector } from "react-redux";
import moment from "moment";
import TinyImage from "../../tiny-image";

const UserLogListItem = forwardRef((props, ref) => {

  const { activeTheme,fontSizes } = useSelector(state => state.globalReducer);

  const {
    onItemPressed,
    item,
    titleKey,
    descKey,
    dateKey,
    desc2Key = null,
  } = props;

  return (

    <Pressable
      onPress={onItemPressed}
      style={styles(activeTheme).wrapper}>

      <View style={{ flexDirection: "row" }}>

        <View style={styles(activeTheme).icon}>
          <TinyImage parent={"shortcuts/"} name={"crypto"} style={styles(activeTheme).icon2} />
        </View>

        <View style={styles(activeTheme).bottom}>
          <View style={styles(activeTheme).item}>
            <Text style={styles(activeTheme,fontSizes).title}>{item[titleKey]}</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles(activeTheme,fontSizes).desc}>{item[descKey]}</Text>
              <Text style={styles(activeTheme,fontSizes).desc}>{item[desc2Key]}</Text>
            </View>
            <Text style={styles(activeTheme,fontSizes).date}>
              {
                moment.utc(item[dateKey]).format("YYYY-MM-DD HH:mm:ss")
              }
            </Text>
          </View>
        </View>
      </View>

    </Pressable>

  );
});


export default UserLogListItem;


const styles = (props,fontSizes) => StyleSheet.create({
  wrapper: {
    backgroundColor: props.darkBackground,
    marginVertical: LIST_MARGIN_T ,
    borderRadius: 12,

  },
  item: {
    backgroundColor: props.darkBackground,
    borderRadius: 12,
    paddingRight: 20,
    paddingVertical: 8,
  },
  title: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.TITLE_FONTSIZE,
    lineHeight: 22,
    color: props.appWhite,
  },

  desc: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.NORMAL_FONTSIZE,
    color: props.secondaryText,
    marginTop: 4,
  },

  date: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.NORMAL_FONTSIZE - 1,
    color: props.actionColor,
  },
  swipeContainer: {
    justifyContent: "center",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 20,
  },
  icon: {
    width: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  bottom: {
    width: "90%",
    height: "100%",
  },
  icon2: {
    width: 12,
    height: 12,
  },
});

