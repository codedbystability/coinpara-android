import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Text, Pressable, FlatList, ActivityIndicator } from "react-native";
import transferServices from "../../../services/transfer-services";
import { useSelector } from "react-redux";
import {
  NORMAL_FONTSIZE,
  NORMAL_IMAGE,
  PADDING_BV,
  PADDING_H,
  TITLE_FONTSIZE,
} from "../../../../utils/dimensions";
import NImage from "../../../components/image/index.tsx";
import { getLang } from "../../../helpers/array-helper";
import NativeInput from "../../../components/native-input";
import EmptyContainer from "../../../components/empty-container";
import TinyImage from "../../../tiny-image";


const BankSelect = ({ handleItemSelect, handleClose, selectedBank, type = "deposit" }) => {
  const [banks, setBanks] = useState([]);
  const [initialBanks, setInitialBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const { activeTheme, activeThemeKey, language } = useSelector(state => state.globalReducer);

  //NameSurname
  useEffect(() => {
    if (searchText) {
      setBanks(initialBanks.filter(bank => bank.BankName.toLowerCase().includes(searchText.toLowerCase())));
    } else {
      setBanks(initialBanks);
    }
  }, [searchText]);

  useEffect(() => {
    if (type === "deposit") {
      transferServices.getBankList().then((response) => {
        if (response && response.IsSuccess) {
          setBanks(response.Data);
          setInitialBanks(response.Data);
        }
        setLoading(false);
      });
    } else {
      transferServices.getBankNames().then((response) => {
        if (response && response.IsSuccess) {
          setBanks(response.Data);
          setInitialBanks(response.Data);
        }
        setLoading(false);
      });
    }

  }, []);


  const awesomeChildListRenderItem = useCallback(({ item }) => {

    const LogoPath = item.BankName.toLowerCase()
      .replace(/ı/, "i")
      .replace(/ü/, "u")
      .replace(/ş/, "s")
      .replace(/ö/, "o")
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const KEY = activeThemeKey === "light" ? "light" : "dark";
    return (
      <Pressable
        key={item.Iban}
        onPress={() => handleItemSelect(item)}
        style={selectedBank && selectedBank.Id === item.Id ? styles(activeTheme).actItem : styles(activeTheme).item}>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: PADDING_H,
        }}>
          <NImage
            useFastImage={false}
            source={{ uri: "https://images.coinpara.com/files/banks/" + LogoPath + "-" + KEY + ".png" }}
            resizeMode={"contain"}
            style={styles(activeTheme).img}
          />
          <Text style={styles(activeTheme).title}>{item.BankName}
            {
              item.Iban && <Text style={styles(activeTheme).title}>
                {item.Iban}
              </Text>
            }
          </Text>

        </View>


        <TinyImage parent={"rest/"} name={"c-right"} style={styles(activeTheme).icon} />

      </Pressable>
    );
  }, []);

  const renderHeader = () => (
    <View style={styles(activeTheme).filterWrapper}>

      <View style={{ width: "90%" }}>
        <NativeInput {...{
          searchText,
          setSearchText: (val) => setSearchText(val),
          placeholder: getLang(language, "SEARCH"),
        }} />
      </View>

      <Pressable onPress={handleClose} style={styles(activeTheme).dismiss}>
        <TinyImage parent={"rest/"} name={"cancel"} style={styles(activeTheme).icon} />
      </Pressable>
    </View>
  );

  const awesomeChildListKeyExtractor = useCallback((item, index) => `banks-index-${index}`, []);

  return (

    <View style={styles(activeTheme).container}>

      <Text style={styles(activeTheme).title}>{getLang(language, "SELECT_BANK")}</Text>

      {
        loading ? <ActivityIndicator /> :
          !loading && initialBanks.length <= 0 ? <EmptyContainer text={getLang(language, "NO_DATA_FOUND")} />
            :
            <FlatList
              ListHeaderComponent={renderHeader}
              style={styles(activeTheme).list}
              contentContainerStyle={styles(activeTheme).flatList}
              showsVerticalScrollIndicator={false}
              data={banks}
              renderItem={awesomeChildListRenderItem}
              keyExtractor={awesomeChildListKeyExtractor}
            />
      }
    </View>
  );
};

const styles = (props) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: props.backgroundApp,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: PADDING_BV,
  },
  item: {
    borderColor: props.borderGray,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: PADDING_H,
    paddingVertical: 4,
    marginVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actItem: {
    borderColor: props.actionColor,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: PADDING_H,
    // paddingVertical: 4,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: TITLE_FONTSIZE - 1,
    fontFamily: "CircularStd-Book",
    color: props.appWhite,
    marginTop: 2,
  },

  text: {
    fontSize: NORMAL_FONTSIZE,
    fontFamily: "CircularStd-Book",
    color: props.secondaryText,
  },
  filterWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: props.backgroundApp,
    marginBottom: PADDING_BV,

  },
  dismiss: {
    width: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  flatList: {
    // paddingBottom: 120,
    // paddingTop: isIphoneX ? 38 : 20,
    paddingHorizontal: PADDING_H,
    // backgroundColor: 'green',
    paddingBottom: 100,
    paddingTop: 12,

  },
  modal: {
    backgroundColor: props.backgroundApp,
    flex: 1,
  },
  list: {
    width: "100%",
  },
  img: {
    height: NORMAL_IMAGE * 1.2, width: NORMAL_IMAGE * 3, marginBottom: PADDING_H / 2,
    marginRight: PADDING_H,
  },

  icon: {
    width: 16,
    height: 16,
  },
});


export default BankSelect;
