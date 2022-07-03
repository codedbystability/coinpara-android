import React from "react";
import { FlatList, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import { DIMENSIONS } from "../../../../utils/dimensions";
import * as Animatable from "react-native-animatable";
import TinyImage from "../../../tiny-image";


const LanguageSelect = (props) => {
  const { handleSelect } = props;

  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const { languages, activeLanguage } = useSelector(state => state.languageReducer);


  const renderItem = ({ item }) => {
    return (
      <Animatable.View easing={"ease"} animation={"fadeInUp"}>
        <Pressable
          onPress={() => handleSelect(item)}
          style={[styles(activeTheme).item, { borderBottomColor: activeLanguage.ISO === item.ISO ? activeTheme.actionColor : activeTheme.borderGray }]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View>
              <Text style={styles(activeTheme).title}>{item.Name}</Text>
              <Text style={styles(activeTheme).text}>{item.ISO}</Text>
            </View>
          </View>

          {
            activeLanguage.ISO === item.ISO &&
            <TinyImage parent={"rest/"} name={"checkmark"} style={styles(activeTheme).icon} />
          }
        </Pressable>
      </Animatable.View>

    );
  };

  return (
    <View style={styles(activeTheme).content}>

      <View style={styles(activeTheme).container}>

        <Text style={styles(activeTheme).tt}>{getLang(language, "SELECT_LANGUAGE")}</Text>


        <View style={styles(activeTheme).list}>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={languages}
            renderItem={renderItem}
            keyExtractor={item => item.Id}
          />
        </View>

      </View>
    </View>

  );
};

export default LanguageSelect;


const styles = (props) => StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    borderBottomWidth: 1,
    borderRadius: 12,
    paddingHorizontal: DIMENSIONS.PADDING_H,
    paddingVertical: 8,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontFamily: "CircularStd-Bold",
    color: props.appWhite,
  },
  text: {
    fontSize: 14,
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
  },
  tt: {
    fontSize: DIMENSIONS.BIG_TITLE_FONTSIZE,
    fontFamily: "CircularStd-Bold",
    color: props.appWhite,
    textAlign: "center",
    marginBottom: DIMENSIONS.PADDING_V,
  },
  list: {
    paddingHorizontal: DIMENSIONS.PADDING_H,
    flex: 1,
  },
  icon: {
    width: 18,
    height: 18,
  },
});

