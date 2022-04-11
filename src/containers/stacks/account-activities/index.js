import React, { useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { FlatList, StyleSheet, Text, View } from "react-native";
import AccountActivityItem from "../../../components/account-activity-item";
import { useSelector } from "react-redux";
import { navigationRef } from "../../../providers/RootNavigation";


const DATA = [

  {
    id: Math.random(),
    price: "35.367,76 TRY",
    amount: "-0.0000002341 BTC",
    commission: "-0.00002269 BTC",
  },
  {
    id: Math.random(),
    price: "35.367,76 TRY",
    amount: "-0.0000002341 BTC",
    commission: "-0.00002269 BTC",
  },


];


const AccountActivities = (props) => {

  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const handleDetail = () => navigationRef.current.navigate("TransactionDetail");

  const renderItem = ({ item }) => <AccountActivityItem
    handleDetail={handleDetail}
    item={item} activeHistory={activeHistory} />;

  const historyTypes = [
    { id: 1, key: "deposit", name: "DEPOSIT" },
    { id: 2, key: "withdraw", name: "WITHDRAW" },
  ];

  const [activeHistory, setActiveHistory] = useState("deposit");

  const handleChangeTradeType = (item) => {
    setActiveHistory(item.key);
  };

  return (

    <View style={{
      flex: 1,
      padding: 20,
    }}>



      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Tarih</Text>
        <Text style={[styles.titleText, { textAlign: "center" }]}>Fiyat & Miktar</Text>
        <Text style={[styles.titleText, { textAlign: "right" }]}>Komisyon</Text>
      </View>


      <FlatList
        contentContainerStyle={{
          paddingVertical: 20,
        }}
        showsVerticalScrollIndicator={false}
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

    </View>
  );
};

const AccountActivitiesScreen = styledHigherOrderComponents(AccountActivities);
export default AccountActivitiesScreen;


const styles = StyleSheet.create({
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,1)",
    paddingBottom: 20,
  },
  titleText: {
    width: "33%",
    textAlign: "left",
    fontFamily: "CircularStd-Book",
    fontSize: 13,
    color: "#707a81",
  },

  itemText: {
    textAlign: "left",
    fontFamily: "CircularStd-Book",
    fontSize: 12,
    color: "#707a81",
  },


});
