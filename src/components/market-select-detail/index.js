import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import NativeInput from "../native-input";
import DynamicImage from "../dynamic-image";
import {
  BIG_TITLE_FONTSIZE, LIST_ITEM_HEIGHT, LIST_MARGIN_T,
  MARGIN_T,
  NORMAL_IMAGE,
  PADDING_BH,
  TITLE_FONTSIZE,
} from "../../../utils/dimensions";
import { useSelector } from "react-redux";
import { getLang } from "../../helpers/array-helper";
import marketServices from "../../services/market-services";
import ModalProvider from "../../providers/ModalProvider";
import EmptyContainer from "../empty-container";
import InputAccessory from "../input-accessory";
import TinyImage from "../../tiny-image";


const MarketSelectDetail = (props) => {
  const {
    handleSelect,
  } = props;

  const [coinList, setCoinList] = useState([]);
  const { activeTheme, language, marketDetailList } = useSelector(state => state.globalReducer);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setSearchText("");
    if (marketDetailList.length <= 0) {
      marketServices.getCoins(false).then((response) => {
        console.log("getCoins - RESSSS");
        if (response && response.IsSuccess) {
          setCoinList(response.Data);
        }
      });
    } else {
      setCoinList(marketDetailList);
    }
  }, [marketDetailList]);

  useEffect(() => {
    setCoins(coinList);
    setLoading(false);
  }, [coinList]);

  useEffect(() => {
    setFilteredData(searchText ? coins.filter(item => item.fs.toLowerCase().includes(searchText.toLowerCase()) || item.to.toLowerCase().includes(searchText.toLowerCase())) : coins);
  }, [searchText]);

  useEffect(() => {
    setFilteredData(coins);
  }, [coins]);

  const awesomeChildListRenderItem = ({ item }) => {
    return (
      <View>
        <Pressable
          onPress={() => handleSelect(item)}
          style={styles(activeTheme).item}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
          }}>

            <DynamicImage market={item.to} style={styles(activeTheme).image} />

            <View style={{ width: "60%" }}>
              <Text style={[styles(activeTheme).title]}>{item.to + " / " + item.fs}</Text>
              <Text style={[styles(activeTheme).text]}>{item.sk}</Text>
            </View>

          </View>

        </Pressable>
      </View>
    );
  };


  return (

    <>
      <View style={styles(activeTheme).wrapper}>

        <View style={styles(activeTheme).innerWrapper}>

          <View style={{ width: "90%" }}>
            <NativeInput {...{
              autoCapitalize: "characters",
              searchText, setSearchText,
              placeholder: getLang(language, "SEARCH"),
            }} />
          </View>

          <Pressable onPress={() => ModalProvider.hide()} style={styles(activeTheme).iconWrapper}>
            <TinyImage parent={'rest/'} name={'cancel'} style={styles(activeTheme).icon}/>
          </Pressable>
        </View>


        {
          loading ? <ActivityIndicator style={styles(activeTheme).loading} /> : coins && coins.length >= 1 ?
            <View style={styles(activeTheme).container}>
              <View
                               style={{
                                 flex: 1,
                                 marginVertical: MARGIN_T,
                               }}>

                <Text style={styles(activeTheme).title}>
                  {getLang(language, "SEARCH_RESULTS")}
                </Text>

                <FlatList
                  keyboardShouldPersistTaps={"handled"}
                  showsVerticalScrollIndicator={false}
                  data={filteredData}
                  renderItem={awesomeChildListRenderItem}
                  keyExtractor={(item, i) => i.toString()}
                />
              </View>
            </View>
            : <EmptyContainer text={getLang(language, "NO_DATA_FOUND")} />
        }
      </View>


      <InputAccessory
        inputAccessoryViewID={"inputAccessoryViewIDNative"}
        mailProviders={[]}
        onPress={null}
      />
    </>
  );
};

export default React.memo(MarketSelectDetail);

const styles = (props) => StyleSheet.create({
  wrapper: {
    backgroundColor: props.backgroundApp,
    flex: 1,
    paddingTop: PADDING_BH,
    paddingHorizontal: PADDING_BH,
  },
  container: {
    flex: 1,
    backgroundColor: props.backgroundApp,
  },
  item: {
    borderColor: props.borderGray,
    borderBottomWidth: .3,
    borderRadius: 12,
    // paddingHorizontal: 20,
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: TITLE_FONTSIZE,
    fontFamily: "CircularStd-Bold",
    color: props.appWhite,
    // paddingVertical:PADDING_H
  },

  titleS: {
    fontSize: TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
    color: props.appWhite,
  },
  line: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    textDecorationColor: props.noRed,
  },
  text: {
    fontSize: TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
    color: props.secondaryText,
  },
  mainT: {
    fontSize: TITLE_FONTSIZE - 2,
    fontFamily: "CircularStd-Book",
    color: props.secondaryText,
  },
  typeText: {
    fontFamily: "CircularStd-Bold",
    fontSize: BIG_TITLE_FONTSIZE,
    color: props.appWhite,
    textAlign: "center",
    marginBottom: LIST_MARGIN_T,
  },
  innerWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  iconWrapper: {
    width: "10%",
    height: LIST_ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: NORMAL_IMAGE,
    width: NORMAL_IMAGE,
    marginRight: 16,
  },
  scrollView: {
    flexDirection: "row",
    marginTop: 8,
  },
  smallItem: {
    borderWidth: .8,
    borderColor: props.borderGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  main: {
    color: props.appWhite,
  },
  icon:{
    width:16,
    height:16,
  }
});
