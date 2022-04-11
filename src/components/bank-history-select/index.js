import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { getLang } from "../../helpers/array-helper";
import { NORMAL_FONTSIZE, PADDING_H, PADDING_V, TITLE_FONTSIZE } from "../../../utils/dimensions";
import moment from "moment";
import TinyImage from "../../tiny-image";


const BankHistorySelect = (props) => {
  const { data, handleSelect, handleDeleteBank } = props;

  const { language, activeTheme } = useSelector(state => state.globalReducer);


  const renderItem = ({ item }) => {
    return (
      <Pressable
        onPress={() => handleSelect(item)}
        style={[styles(activeTheme).item]}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ width: "70%" }}>
            <Text style={styles(activeTheme).text}>{item.Account}</Text>
            <Text style={styles(activeTheme).title}>{item.BankName}</Text>
          </View>


          <View style={{
            flexDirection: "row",
            alignItems: "center",
            width: "30%",
          }}>
            <View style={{ width: "70%", alignItems: "flex-end", marginRight: 10 }}>
              <Text
                style={[styles(activeTheme).title, { fontSize: NORMAL_FONTSIZE }]}>{moment(item.Timestamp).utc().local().format("YYYY-MM-DD")}</Text>
              <Text
                style={[styles(activeTheme).text, { fontSize: NORMAL_FONTSIZE }]}>{moment(item.Timestamp).utc().local().format("HH:mm")}</Text>
            </View>

            <Pressable
              onPress={() => handleDeleteBank(item)}
              style={{ width: "20%", alignItems: "flex-end" }}>
              <TinyImage parent={"rest/"} name={"dismiss"} style={styles(activeTheme).icon} />
            </Pressable>
          </View>
        </View>
      </Pressable>
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
    marginTop: PADDING_V,
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
    paddingHorizontal: PADDING_H,
    paddingVertical: 8,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: props.darkBackground,
  },
  title: {
    fontSize: TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
    color: props.appWhite,
    marginTop: 6,
  },
  text: {
    fontSize: NORMAL_FONTSIZE,
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
    top: PADDING_V,
    padding: 8,
    // marginVertical: 12,
  },
  ttt: {
    fontSize: TITLE_FONTSIZE,
    color: props.appWhite,
    textAlign: "center",
    marginBottom: PADDING_V,
  },
  ww: {
    paddingHorizontal: PADDING_H,
    flex: 1,
  },
  icon: {
    width: 12,
    height: 12,
  },
});

