import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { getLang } from "../../../../helpers/array-helper";
import { DIMENSIONS } from "../../../../../utils/dimensions";
import moment from "moment";
import TinyImage from "../../../../tiny-image";


const BankHistorySelect = (props) => {
  const { data, handleSelect, handleDeleteBank } = props;

  const { language, activeTheme } = useSelector(state => state.globalReducer);


  const renderItem = ({ item }) => {
    return (
      <View
        style={[styles(activeTheme).item]}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Pressable
            onPress={() => handleSelect(item)}
            style={{ width: "60%" }}>
            <Text style={styles(activeTheme).title}>{item.BankName}</Text>
            <Text style={styles(activeTheme).text}>{item.Account}</Text>
          </Pressable>


          <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "40%",
          }}>
            <Pressable
              onPress={() => handleSelect(item)}
              style={{ width: "70%", alignItems: "flex-end", marginRight: 10 }}>
              <Text
                style={[styles(activeTheme).title, { fontSize: DIMENSIONS.NORMAL_FONTSIZE }]}>{moment(item.Timestamp).utc().local().format("YYYY-MM-DD")}</Text>
              <Text
                style={[styles(activeTheme).text, { fontSize: DIMENSIONS.NORMAL_FONTSIZE }]}>{moment(item.Timestamp).utc().local().format("HH:mm")}</Text>
            </Pressable>

            <Pressable
              onPress={() => handleDeleteBank(item)}
              style={{
                borderRadius: DIMENSIONS.PADDING_H / 2,
                width: "30%",
                alignItems: "center",
                paddingVertical: DIMENSIONS.PADDING_H / 2,
                height: "100%",
              }}>
              <TinyImage parent={"rest/"} name={"dismiss"} style={styles(activeTheme).icon} />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles(activeTheme).content}>

      <View style={styles(activeTheme).container}>

        <Text style={styles(activeTheme).ttt}>{getLang(language, "BANK_HISTORY")}</Text>

        <View style={styles(activeTheme).ww}>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.Id}
          />
        </View>

      </View>
    </View>
  );
};

export default BankHistorySelect;


const styles = (props) => StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DIMENSIONS.PADDING_V,
  },
  item: {
    borderWidth: 1,
    borderColor: props.borderGray,
    // shadowColor: props.borderGray,
    // shadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
    // shadowRadius: 1,
    // shadowOpacity: 1,
    borderRadius: 12,
    paddingHorizontal: DIMENSIONS.PADDING_H,
    paddingVertical: 8,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: props.darkBackground,
  },
  title: {
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
    color: props.appWhite,
    marginTop: 6,
  },
  text: {
    fontSize: DIMENSIONS.NORMAL_FONTSIZE - 1,
    fontFamily: "CircularStd-Book",
    color: props.secondaryText,
  },
  content: {
    backgroundColor: props.backgroundApp,
    flex: 1,
    paddingTop: 30,
  },
  close: {
    position: "absolute",
    right: 20,
    top: DIMENSIONS.PADDING_V,
    padding: 8,
    // marginVertical: 12,
  },
  ttt: {
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    color: props.appWhite,
    textAlign: "center",
    marginBottom: DIMENSIONS.PADDING_V,
  },
  ww: {
    paddingHorizontal: DIMENSIONS.PADDING_H,
    flex: 1,
  },
  icon: {
    width: 12,
    height: 12,
  },
});

