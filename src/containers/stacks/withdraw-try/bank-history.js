import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import transferServices from "../../../services/transfer-services";
import moment from "moment";
import {
  BIG_TITLE_FONTSIZE,
  NORMAL_FONTSIZE,
  PADDING_H,
  SCREEN_WIDTH,
  TITLE_FONTSIZE,
} from "../../../../utils/dimensions";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import BankHistorySelect from "../../../components/bank-history-select";
import ModalProvider from "../../../providers/ModalProvider";
import userServices from "../../../services/user-services";
import TinyImage from "../../../tiny-image";

const BankHistory = (props) => {
  const { handleSelect } = props;
  const { activeTheme, language } = useSelector(state => state.globalReducer);

  const innerRef = useRef(null);
  const [bankHistory, setBankHistory] = useState([]);

  const handleSelection = (item) => {
    ModalProvider.hide();
    handleSelect(item);
  };
  useEffect(() => {
    getUserBankHistory();
  }, []);

  const getUserBankHistory = () => {
    transferServices.getUserBankHistory().then((response) => {
      if (response && response.IsSuccess) {
        setBankHistory(response.Data);
      }
    });
  };
  const handleDeleteBank = (bankItem) => {
    userServices.removeBankHistory({
      BankAccount: bankItem.Account,
    }).then(res => {
      if (res.IsSuccess) {
        setBankHistory(bankHistory.filter(itm => itm.Account !== bankItem.Account));
        ModalProvider.hide();
      }
    });
  };
  const showBankHistoryModal = () => ModalProvider.show(() => <BankHistorySelect
    {...{
      handleDeleteBank,
      data: bankHistory,
      handleSelect: (item) => handleSelection(item),
    }}
  />);


  return (
    <>
      <View style={styles(activeTheme).wrapper}>

        {bankHistory.length >= 1 && <Pressable
          onPress={showBankHistoryModal}
          style={styles(activeTheme).hiddenWrapper}>
          <View
            ref={innerRef}
            style={styles(activeTheme).click}>
            <TinyImage parent={"settings/"} name={"eye-list"}
                       style={styles(activeTheme).icon} />

          </View>
        </Pressable>}
        <Text style={styles(activeTheme).title}>{getLang(language, "BANK_HISTORY")}</Text>

        <View style={styles(activeTheme).tabsContainer}>
          <Text style={styles(activeTheme).tabTitle}>{getLang(language, "IBAN")}</Text>
          <Text style={styles(activeTheme).tabTitle}>{getLang(language, "BANK")}</Text>
          <Text style={styles(activeTheme).tabTitle}>{getLang(language, "DATE")}</Text>
        </View>

        {
          bankHistory.length >= 1 ?
            bankHistory.slice(0, 2).map(item => (
              <View
                key={item.Id.toString()}
                style={styles(activeTheme).hiddenItem}>
                <Text style={styles(activeTheme).txt}>{item.Account.slice(0, 10)}...</Text>
                <Text style={[styles(activeTheme).txt, {
                  color: activeTheme.secondaryText,
                  textAlign: "center",
                }]}>{item.BankName}</Text>
                <Text
                  style={[styles(activeTheme).txt, styles(activeTheme).txt2]}>{
                  moment.utc(item.Timestamp).format("YYYY-MM-DD HH:mm")
                }</Text>

              </View>
            )) : <View style={styles(activeTheme).iC}>
              <TinyImage parent={"rest/"} name={"empty-face"} style={styles(activeTheme).icon} />
            </View>

        }

      </View>


    </>
  );

};


export default BankHistory;

const styles = (props) => StyleSheet.create({
  wrapper: { paddingVertical: 0 },
  title: {
    color: props.appWhite,
    fontSize: BIG_TITLE_FONTSIZE + 2,
    fontFamily: "CircularStd-Bold",
    marginVertical: 12,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  tabTitle: {
    fontSize: TITLE_FONTSIZE,
    color: props.actionColor,
    fontFamily: "CircularStd-Bold",
  },

  txt2: {
    color: props.secondaryText,
    textAlign: "right",
  },

  txt: {
    width: "33%",
    textAlign: "left",
    fontFamily: "CircularStd-Book",
    color: props.appWhite,
    fontSize: NORMAL_FONTSIZE,
  },

  hiddenItem: {
    flexDirection: "row",
    paddingVertical: 6,
  },
  hiddenWrapper: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
  },
  click: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,.1)",
    paddingHorizontal: PADDING_H,
    borderRadius: 40,
    height: 80,
    width: 80,
    marginTop: 30,
  },
  icon: {
    width: 22,
    height: 22,
  },
  iC: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingRight: 20,
  },
});
