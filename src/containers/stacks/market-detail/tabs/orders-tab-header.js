import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { DIMENSIONS } from "../../../../../utils/dimensions";
import { useSelector } from "react-redux";
import { getLang } from "../../../../helpers/array-helper";

const titles = [
  { id: 1, key: "QUANTITY_BID", title: "QUANTITY_BID", isto: true },
  { id: 2, key: "bid", title: "BID_PRICE" },
  { id: 3, key: "ask", title: "ASK_PRICE" },
  { id: 4, key: "QUANTITY_ASK", title: "QUANTITY_ASK", isto: true },
];

const OrdersTabHeader = ({ toSym }) => {

  const { activeTheme, language } = useSelector(state => state.globalReducer);

  return (
    <View style={styles(activeTheme).titleContainer}>
      {
        titles.map((title, key) => <Text key={title.id}
                                         numberOfLines={1}
                                         style={[styles(activeTheme).title,
                                           {
                                             textAlign: key === 0 || key === 2 ? "left" : "right",
                                             width: key === 1 || key === 2 ? "30%" : "20%",
                                           }]}>
          {
            getLang(language, title.title)
          }

          {
            !title.isto && <Text>({toSym})</Text>
          }

        </Text>)
      }
    </View>
  );
};

export default OrdersTabHeader;

const styles = (props) => StyleSheet.create({
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    borderBottomColor: props.borderGray,
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
  contentWrapper: {
    // width: "100%",
    flexDirection: "row",
    flex: 1,
  },
  title: {
    textAlign: "left",
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.TITLE_FONTSIZE - 2,
    color: props.appWhite,
    paddingHorizontal: 6,
  },
  priceText: {
    fontFamily: "CircularStd-Book",
  },
});
