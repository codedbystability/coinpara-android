import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import {
  LIST_ITEM_HEIGHT, NORMAL_FONTSIZE,
  PADDING_H,
  TITLE_FONTSIZE,
} from "../../../../utils/dimensions";
import CustomList from "../../../components/custom-list";
import NavigationListItem from "../../../components/navigation-list-item";
import TinyImage from "../../../tiny-image";
import generalServices from "../../../services/general-services";
import FloatingAction from "../../../components/floating-action";
import { navigationRef } from "../../../providers/RootNavigation";
import ModalProvider from "../../../providers/ModalProvider";
import SupportCenterFilterScreen from "./filter";


const SupportCenter = props => {

  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const { activeLanguage } = useSelector(state => state.languageReducer);
  const [statics1, setStatics1] = useState([
    {
      id: 77,
      topId: 1,
      key: "TL Yatırma İşlemleri",
      type: "navigation",
      items: [],
    },
    {
      id: 0,
      topId: 2,
      key: "TL Cekme İşlemleri",
      type: "navigation",
      items: [],

    },
    {
      id: 1,
      topId: 3,
      key: "Kripto Para Çekme/Yatırma İşlemleri",
      type: "navigation",
      items: [],

    },
    {
      id: 2,
      topId: 5,
      key: "Güvenlik",
      type: "navigation",
      items: [],

    },
    {
      id: 3,
      topId: 6,
      key: "Hesap Onayı ve Seviyeler",
      type: "navigation",
      items: [],

    },

    {
      id: 4,
      topId: 7,
      key: "Sıkça Sorulan Sorular",
      type: "navigation",
      items: [],

    },

    {
      id: 5,
      topId: 8,
      key: "Mobil Uygulama",
      type: "navigation",
      items: [],

    },

    {
      id: 6,
      topId: 117,
      key: "Sözleşmeler ve Politikalar",
      type: "navigation",
      items: [],

    },

    {
      id: 7,
      topId: 118,
      key: "Kurumsal Hesap",
      type: "navigation",
      items: [],

    },


    {
      id: 8,
      topId: 119,
      key: "Limitler ve Komisyonlar",
      type: "navigation",
      items: [],

    },


    {
      id: 9,
      topId: 143,
      key: "Kripto Para Alış/Satış İşlemleri",
      type: "navigation",
      items: [],

    },

    {
      id: 10,
      topId: 144,
      key: "Diğer Sorular",
      type: "navigation",
      items: [],

    },

    {
      id: 11,
      topId: 158,
      key: "Coinpara'da Desteklenen Ağlar",
      type: "navigation",
      items: [],
    },

  ]);
  const [loading, setLoading] = useState(true);
  const [topItems, setTopItems] = useState([]);
  const [allSubItems, setAllSubItems] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {


    if (activeLanguage && activeLanguage.Id) {
      generalServices.getHelpCenterContent(activeLanguage.Id, true).then((response) => {
        setStatics1(statics1.map(stat => {
          const topItems = response.Data.filter(dt => dt.TopId === stat.topId);
          stat["items"] = topItems;
          stat["Title"] = topItems.length >= 1 ? topItems[0].CategoryTitle : stat.title;
          return stat;
        }));

        setTimeout(() => setTops(statics1), 500);
        setLoading(false);
      });
    }

  }, [activeLanguage]);


  const getIcon = index => {
    switch (index) {
      case 0:
        return "password-check";
      case 1:
        return "lock";
      case 2:
        return "google";
      case 3:
        return "sms-edit";
      case 4:
        return "moneys";
      default:
        return "lock";
    }
  };

  const setTops = (statics1) => {
    const allSubs = [];
    statics1.map(itm => itm.items.map(ii => allSubs.push(ii)));
    if (statics1[0].items.length >= 1) {
      const myItems = statics1.filter((itm, i) => i <= 5).map(stat => stat.items[0]).filter((itm, i) => i <= 5);
      myItems.map((item, i) => {
        item.image = getIcon(i);
        return item;
      });
      setTopItems(myItems);
    }

    setAllSubItems(allSubs);
  };

  const keyExtractor = (_, i) => `support-center-index-${i}`;

  const handleShowFilter = () => {
    setSearchText("");
    ModalProvider.show(() => <SupportCenterFilterScreen data={allSubItems} />);
  };


  const handleOnPress = (item) => {
    navigationRef.current.navigate("SupportCenterInnerScreen", {
      item,
      allStatics: allSubItems,
    });
  };

  const handleDetail = (item) => {
    return navigationRef.current.navigate("Static", {
      title: item.Title,
      url: item.url,
      content: item.Description,
      param: null,
      isSupport: true,
      allStatics: allSubItems,
    });
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => handleDetail(item)}
        activeOpacity={.8}
        style={styles(activeTheme).tWrap}
      >

        <TinyImage parent={"faq/"} name={item.image} style={styles(activeTheme).img1} />

        <Text style={[styles(activeTheme).t1, {
          fontSize: NORMAL_FONTSIZE - 2,
        }]}>{getLang(language, item.Title)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TabNavigationHeader
        {...props}
        backAble={true}
        isBack={true}
        options={{ title: getLang(language, "HELP_CENTER") }}
      />


      <CustomList
        contentStyle={styles(activeTheme).l1}
        borderGray={"transparent"}
        data={loading ? [] : statics1}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <>


            <Pressable
              onPress={handleShowFilter}
              style={styles(activeTheme).inputV}>
              <View style={styles(activeTheme).searchIcon}>
                <TinyImage parent={"rest/"} name={"search"} style={styles(activeTheme).icon} />
              </View>
              <Text style={styles(activeTheme).t1}>
                {getLang(language, "SEARCH")}
              </Text>
            </Pressable>


            <View style={{ marginTop: PADDING_H * 2 }}>
              <Text style={styles(activeTheme).t2}>{getLang(language, "FREQUENTLY_ASKED_QUESTIONS")}</Text>

              <Text style={styles(activeTheme).d1}>
                {getLang(language, "FREQUENTLY_ASKED_QUESTIONS_DESC")}
              </Text>
            </View>


            <FlatList
              numColumns={3}
              showsVerticalScrollIndicator={false}
              data={topItems}
              renderItem={renderItem}
              keyExtractor={item => item.Id}
            />

          </>
        }
        itemHeight={LIST_ITEM_HEIGHT}
        renderItem={({ item }) => <NavigationListItem isStatic={false}
                                                      isWrap={true}
                                                      key={item.id}
                                                      handleOnPress={handleOnPress}
                                                      item={item} />}
        onEndReached={null}
      />


      <FloatingAction />
    </>
  );


};


const SupportCenterScreen = styledHigherOrderComponents(SupportCenter);
export default SupportCenterScreen;


const styles = (props) => StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingVertical: 10,
  },
  left: { flexDirection: "row", justifyContent: "space-between" },
  title: {
    fontFamily: "CircularStd-Book",
    fontSize: 14,
    lineHeight: 32,
    color: props.secondaryText,
  },
  searchContainer: {
    height: 40,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: props.darkBackground,
    marginBottom: 10,
  },
  input: {
    height: "100%",
    backgroundColor: props.darkBackground,
    borderRadius: 8,
    paddingHorizontal: 0,
    paddingVertical: 8,
    flex: 1,
    color: "#8a96a6",
    alignSelf: "stretch",
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
  },

  searchIcon: { paddingHorizontal: 10 },
  icon: {
    width: 16,
    height: 16,
  },
  tWrap: {
    backgroundColor: props.darkBackground,
    height: 90,
    marginHorizontal: 4,
    marginVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    flex: 1,
    paddingHorizontal: PADDING_H / 2,
  },
  img1: {
    width: 18,
    height: 18,
    marginBottom: 8,
  },
  t1: {
    fontSize: NORMAL_FONTSIZE,
    color: props.appWhite,
    fontFamily: "CircularStd-Book",
    textAlign: "center",
  },
  l1: {
    paddingTop: PADDING_H,
    paddingBottom: 120,
    paddingHorizontal: PADDING_H,
  },
  d1: {
    fontFamily: "CircularStd-Book",
    color: props.secondaryText,
    fontSize: NORMAL_FONTSIZE - 2,
    marginTop: PADDING_H,
    marginBottom: PADDING_H * 2,
  },
  t2: {
    fontFamily: "CircularStd-Bold",
    color: props.appWhite,
    fontSize: TITLE_FONTSIZE,
  },


  inputV: {
    height: 36,
    backgroundColor: props.darkBackground,
    borderRadius: 8,
    paddingHorizontal: PADDING_H / 2,
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
  },

});
