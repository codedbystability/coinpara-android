import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { getLang } from "../../../helpers/array-helper";
import RadioOptions from "../../../components/radio-options";
import TinyImage from "../../../tiny-image";
import {
  BIG_TITLE_FONTSIZE, INPUT_HEIGHT, NORMAL_FONTSIZE,
  PADDING_H,
  TITLE_FONTSIZE,
} from "../../../../utils/dimensions";
import DatePicker from "react-native-date-picker";
import CustomButton from "../../../components/button";
import moment from "moment";
import ModalProvider from "../../../providers/ModalProvider";
import MarketSelect from "../../../components/market-select";
import { replaceAll } from "../../../helpers/string-helper";
import DynamicImage from "../../../components/dynamic-image";
import AnimatedTab from "../../../components/animated-tab";

const statusOptions = [
  { id: 1, key: "", title: "ALL" },
  { id: 2, key: "2", title: "APPROVED_NOUN" },
  { id: 3, key: "3", title: "REJECTED_NOUN" },
  { id: 4, key: "1", title: "WAITING_NOUN" },
];
const typeOptions = [
  { id: 2, key: "1", title: "DEPOSIT_NOUN" },
  { id: 3, key: "-1", title: "WITHDRAW_NOUN" },
];

const FROM_DATE = moment().subtract(3, "months").toDate();
const END_DATE = moment().toDate();
const WalletHistoryFilter = (props) => {
  const {
    showFilter,
    setShowFilter,
    activeTheme,
    activeThemeKey,
    language,
    handleShowFilter,
    handleFilterForm,
    parity,
  } = props;
  const [startDate, setStartDate] = useState(FROM_DATE);
  const [endDate, setEndDate] = useState(END_DATE);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDateType, setActiveDateType] = useState("");

  const [activeStatus, setActiveStatus] = useState("");
  const [activeParity, setActiveParity] = useState("all");
  const [selectedItem, setSelectedItem] = useState({});
  const [activeTransactionType, setActiveTransactionType] = useState("1");

  useEffect(() => {
    if (parity) {
      setActiveParity(parity);
    }
  }, [parity]);

  const clearFilter = () => {
    setStartDate(FROM_DATE);
    setEndDate(END_DATE);
    setActiveTransactionType("1");
    setActiveStatus("");
    setActiveParity("all");
    setSelectedItem({});


    const obj = {
      from: moment(FROM_DATE).format("YYYY-MM-DD"),
      to: moment(END_DATE).format("YYYY-MM-DD"),
      type: "1",
      status: "",
      coinId: "",
    };
    handleFilterForm(obj);
    setShowFilter(false);

  };

  useEffect(() => {
    if (activeDateType) {
      setShowDatePicker(true);
    }
  }, [activeDateType]);

  const handleFilterAction = () => {
    const obj = {
      from: moment(startDate).format("YYYY-MM-DD"),
      to: moment(endDate).format("YYYY-MM-DD"),
      type: activeTransactionType,
      status: activeStatus,
      coinId: selectedItem.Id || "",
    };
    handleFilterForm(obj);
    setShowFilter(false);
  };

  const handleCoinSelected = (item) => {
    setSelectedItem(item);
    setActiveParity(item.Code);
    ModalProvider.hide();
    setShowFilter(true);
  };


  const handleSelectParity = () => {
    setShowFilter(false);
    return ModalProvider.show(() => <MarketSelect
      isAll={true}
      isBoth={true}
      type={"WALLET"}
      initialActiveType={"price"}
      setActiveType={() => null}
      isTrending={false}
      handleSelect={handleCoinSelected}
      shouldCheck={true}
    />, true);
  };

  const handleDateConfirm = (date) => {
    setShowDatePicker(false);
    activeDateType === "START_DATE" ? setStartDate(date) : setEndDate(date);
    setActiveDateType("");
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showFilter}

      onRequestClose={() => setShowFilter(false)}>
      <View style={{
        flex: 1,
        backgroundColor: replaceAll(activeTheme.darkBackground, "1)", "0.7)"),
      }}>
        <View
          style={styles(activeTheme).modalView}>
          <Text style={styles(activeTheme).headerText}>{getLang(language, "FILTER_HISTORY")}</Text>

          <View>
            <Text style={[styles(activeTheme).headerText2]}>{getLang(language, "STATUS")}</Text>
            <View style={styles(activeTheme).v1}>
              {/*{*/}
              {/*  statusOptions.map(status => <RadioOptions*/}
              {/*    key={status.id}*/}
              {/*    onPress={() => setActiveStatus(status.key)}*/}
              {/*    isSelected={status.key === activeStatus} option={status} />)*/}
              {/*}*/}

              <AnimatedTab {...{
                activeKey: activeStatus,
                headers: statusOptions,
                width: `50%`,
                filled: true,
                onChange: (e) => setActiveStatus(e.key),
              }} />
            </View>
          </View>


          <View style={{ marginTop: 12 }}>
            <Text style={[styles(activeTheme).headerText2]}>{getLang(language, "TYPE")}</Text>
            <View style={styles(activeTheme).v1}>

              {/*{*/}
              {/*  typeOptions.map(status => <RadioOptions*/}
              {/*    key={status.id}*/}
              {/*    onPress={() => setActiveTransactionType(status.key)}*/}
              {/*    isSelected={status.key === activeTransactionType} option={status} />)*/}
              {/*}*/}

              <AnimatedTab {...{
                activeKey: activeTransactionType,
                headers: typeOptions,
                width: `50%`,
                filled: true,
                onChange: (e) => setActiveTransactionType(e.key),
              }} />
            </View>
          </View>


          <View style={{ marginTop: 12 }}>
            <Text style={[styles(activeTheme).headerText2]}>{getLang(language, "DATE")}</Text>
            <View style={styles(activeTheme).v1}>


              <Pressable
                onPress={() => setActiveDateType("START_DATE")}
                style={styles(activeTheme).inp1}>

                <Text style={styles(activeTheme).dte}>{moment(startDate).format("DD-MM-YYYY")}</Text>

                <TinyImage parent={"rest/"} name={"c-down"} style={styles(activeTheme).a1} />


              </Pressable>


              <Pressable
                onPress={() => setActiveDateType("END_DATE")}
                style={styles(activeTheme).inp1}>
                <Text style={styles(activeTheme).dte}>{moment(endDate).format("DD-MM-YYYY")}</Text>


                <TinyImage parent={"rest/"} name={"c-down"} style={styles(activeTheme).a1} />

              </Pressable>

            </View>
          </View>


          <View style={{ marginTop: 12 }}>
            <Text style={[styles(activeTheme).headerText2]}>{getLang(language, "WALLET")}</Text>
            <View style={styles(activeTheme).v1}>


              <Pressable
                onPress={handleSelectParity}
                style={styles(activeTheme).inp2}>


                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                  {
                    activeParity && activeParity !== "all" &&
                    <DynamicImage market={activeParity} style={styles(activeTheme).image} />
                  }

                  <Text
                    style={styles(activeTheme).dte}>{activeParity === "all" ? getLang(language, "ALL") : activeParity}</Text>
                </View>

                <TinyImage parent={"rest/"} name={"c-down"} style={styles(activeTheme).a1} />


              </Pressable>


            </View>
          </View>

          <Pressable style={styles(activeTheme).dismissButton} onPress={handleShowFilter}>
            <TinyImage parent={"rest/"} name={"dismiss"} style={styles(activeTheme).icon} />
          </Pressable>


          <Pressable
            onPress={clearFilter}
            style={styles(activeTheme).clearV}>
            <Text style={styles(activeTheme).clearT}>{getLang(language, "CLEAR_FILTER")}</Text>
          </Pressable>
        </View>

      </View>

      <DatePicker
        modal
        mode={"date"}
        confirmText={getLang(language, "APPROVE")}
        cancelText={getLang(language, "CANCEL")}
        theme={activeThemeKey === "light" ? "light" : "dark"}
        textColor={activeTheme.appWhite}
        title={getLang(language, activeDateType)}
        // maximumDate={activeDateType === "END_DATE" ? moment().toDate() : startDate}
        open={showDatePicker}
        date={activeDateType === "START_DATE" ? startDate : endDate}
        onConfirm={handleDateConfirm}
        onCancel={() => {
          setActiveDateType("");
          setShowDatePicker(false);
        }}
      />


      <CustomButton text={getLang(language, "FILTER")}
                    filled={true}
                    onPress={handleFilterAction} />
    </Modal>
  );

};


export default React.memo(WalletHistoryFilter);


const styles = (props) => StyleSheet.create({

  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: props.appWhite,
    fontSize: BIG_TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
    padding: 26,
    textAlign: "center",
  },
  headerText2: {
    color: props.appWhite,
    fontSize: TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
    textAlign: "left",
  },
  noteHeader: {
    backgroundColor: "#42f5aa",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  modalView: {
    height: "auto",
    marginTop: "auto",
    backgroundColor: props.darkBackground,
    paddingHorizontal: PADDING_H,
    borderTopColor: props.actionColor,
    borderTopWidth: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingBottom: PADDING_H * 2,


  },

  dismissButton: {
    fontFamily: "CircularStd-Bold",
    position: "absolute",
    top: PADDING_H,
    right: PADDING_H,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999999,
    padding: PADDING_H * 1.4,
  },
  inp1: {
    width: "49%",
    height: INPUT_HEIGHT / 1.2,
    borderColor: props.borderGray,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: PADDING_H,
    flexDirection: "row",
  },
  inp2: {
    width: "100%",
    height: INPUT_HEIGHT / 1.2,
    borderColor: props.borderGray,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: PADDING_H,
    flexDirection: "row",
  },
  dte: {
    color: props.appWhite,
    fontFamily: "CircularStd-Bold",
    fontSize: TITLE_FONTSIZE,
  },
  icon: {
    width: 14,
    height: 14,
  },
  a1: {
    width: 12,
    height: 12,
  },
  v1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: PADDING_H,
  },
  clearV: {
    paddingVertical: PADDING_H * 2,
  },
  clearT: {
    fontSize: NORMAL_FONTSIZE,
    color: props.changeRed,
    fontFamily: "CircularStd-Book",
    textAlign: "center",
  },
  image: {
    width: INPUT_HEIGHT / 2,
    height: INPUT_HEIGHT / 2,
    marginRight: 8,
  },
});
