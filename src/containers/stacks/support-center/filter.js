import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import TabNavigationHeader from "../../../components/page-components/tab-navigation-header";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import {
  LIST_ITEM_HEIGHT, NORMAL_FONTSIZE,
  PADDING_H,
  TITLE_FONTSIZE,
} from "../../../../utils/dimensions";
import CustomList from "../../../components/page-components/custom-list";
import NavigationListItem from "../../../components/page-components/navigation-list-item";
import TinyImage from "../../../tiny-image";
import generalServices from "../../../services/general-services";
import FloatingAction from "../../../components/page-components/floating-action";
import { navigationRef } from "../../../providers/RootNavigation";
import ModalProvider from "../../../providers/ModalProvider";
import NativeInput from "../../../components/page-components/native-input";
import InputAccessory from "../../../components/page-components/input-accessory";


const SupportCenterFilter = ({ data }) => {

  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const [filteredSubs, setFilteredSubs] = useState([]);
  const [searchText, setSearchText] = useState("");


  useEffect(() => {
    if (searchText) {
      setFilteredSubs(data.filter(item => item.Title.toLowerCase().includes(searchText.toLowerCase())));
    } else {
      setFilteredSubs(data);
    }
  }, [data, searchText]);

  const keyExtractor = (_, i) => `support-center-index-${i}`;

  const handleDetail = (item) => {
    ModalProvider.hide();
    return navigationRef.current.navigate("Static", {
      title: item.Title,
      url: item.url,
      content: item.Description,
      param: null,
      isStatic:true,
      allStatics:data
    });
  };

  return (

    <>
      <CustomList
        contentStyle={styles(activeTheme).l1}
        borderGray={"transparent"}
        data={filteredSubs}
        keyExtractor={keyExtractor}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View style={{
            marginBottom: PADDING_H * 2,
          }}>
            <NativeInput {...{
              searchText,
              setSearchText,
              autoFocus: true,
              autoCapitalize: "none",
              placeholder: getLang(language, "SEARCH"),
            }} />
          </View>
        }
        iconKey={"empty-orders"}
        emptyMessage={getLang(language, "NO_CONTENT_FOUND")}
        itemHeight={LIST_ITEM_HEIGHT}
        renderItem={({ item }) => <NavigationListItem isStatic={true}
                                                      key={item.id}
                                                      handleOnPress={handleDetail}
                                                      item={item} />}
        onEndReached={null}
      />

      <InputAccessory />
    </>
  );


};


const SupportCenterFilterScreen = styledHigherOrderComponents(SupportCenterFilter);
export default SupportCenterFilterScreen;


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
