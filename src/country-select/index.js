import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import * as Animatable from "react-native-animatable";
import { BIG_TITLE_FONTSIZE, PADDING_H, PADDING_V } from "../../utils/dimensions";
import { getLang } from "../helpers/array-helper";
import NativeInput from "../components/native-input";
import ModalProvider from "../providers/ModalProvider";
import TinyImage from "../tiny-image";
import NImage from "../components/image/index.tsx";

const itemToShow = 80;
const CountrySelect = (props) => {
  const { handleSelectCountry, activeCountry, showPhone = true } = props;


  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const { language, activeTheme } = useSelector(state => state.globalReducer);

  useEffect(() => {
    if (countries.length <= 0) {
      fetch("https://w-validator.coinpara.com/api/countries", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then(res => res.json())
        .then(response => {
          if (response && response.status === 200) {
            setCountries(response.data);
          }
        });
    }
  }, [countries]);

  useEffect(() => {
    let myCountries2 = countries;
    if (searchText) {
      myCountries2 = myCountries2.filter(itm => itm.name.toUpperCase().includes(searchText.toUpperCase()) || itm.dial_code.toUpperCase().includes(searchText.toUpperCase()));
    }

    setFilteredCountries(myCountries2);

  }, [countries, searchText]);

  const awesomeChildListRenderItem =
    ({ item }) => {
      return (
        <Animatable.View easing={"ease"} animation={"fadeInUp"}>
          <Pressable
            onPress={() => handleSelectCountry(item)}
            style={[styles(activeTheme).item, { borderBottomColor: activeCountry.code === item.code ? activeTheme.actionColor : activeTheme.borderGray }]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ marginRight: PADDING_H }}>
                <NImage
                  style={{
                    width: 20,
                    height: 16,
                  }}
                  useFastImage={true}
                  source={{ uri: `https://images.coinpara.com/files/mobile-assets/countries/${item.code.toLowerCase()}.png` }}
                />

              </View>
              <View>
                <Text numberOfLines={1} style={styles(activeTheme).title}>{item.name}</Text>
                {
                  showPhone && <Text style={styles(activeTheme).text}>{item.dial_code}</Text>
                }
              </View>
            </View>

            {
              activeCountry.code === item.code &&
              <TinyImage parent={"rest/"} name={"success"} style={styles(activeTheme).icon} />
            }
          </Pressable>
        </Animatable.View>
      );
    };

  const awesomeChildListKeyExtractor = (item, i) => `country-item-${i}`;


  const onEndReached = () => setPage(page + 1);

  const data = filteredCountries.slice(0, itemToShow * page);

  return (
    <View style={styles(activeTheme).content}>

      <View style={styles(activeTheme).container}>

        <Text style={styles(activeTheme).ttt}>{getLang(language, "SELECT_COUNTRY")}</Text>


        <View style={{
          paddingHorizontal: 16,
          // paddingVertical: 12,
          flex: 1,
        }}>

          <View style={styles(activeTheme).innerWrapper}>

            <View style={{ width: "90%" }}>
              <NativeInput {...{
                searchText, setSearchText,
                placeholder: getLang(language, "SEARCH"),
              }} />
            </View>

            <Pressable onPress={() => ModalProvider.hide()} style={styles(activeTheme).iconWrapper}>
              <TinyImage parent={"rest/"} name={"dismiss"} style={styles(activeTheme).icon} />
            </Pressable>
          </View>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={awesomeChildListRenderItem}
            onEndReachedThreshold={0.5}
            onEndReached={onEndReached}
            keyExtractor={awesomeChildListKeyExtractor}
          />
        </View>

      </View>
    </View>

  );
};

export default CountrySelect;


const styles = (props) => StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    borderBottomWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontFamily: "CircularStd-Book",
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
    top: PADDING_V,
    padding: 8,
    // marginVertical: 12,
  },
  innerWrapper: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  ttt: {
    fontSize: BIG_TITLE_FONTSIZE,
    fontFamily: "CircularStd-Bold",
    color: props.appWhite,
    textAlign: "center",
    marginBottom: PADDING_V,
  },
  icon: {
    width: 16,
    height: 16,
  },
});

