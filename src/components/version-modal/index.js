import * as React from "react";
import { useEffect, useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import {
  BIG_TITLE_FONTSIZE,
  NORMAL_FONTSIZE,
  PADDING_H, SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../../utils/dimensions";
import { getLang } from "../../helpers/array-helper";
import { useSelector } from "react-redux";
import { version } from "../../../package.json";
import Linking from "../../providers/Linking";
import { isIos } from "../../../utils/devices";

const VersionModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const { activeLanguage } = useSelector(state => state.languageReducer);

  const [data, setData] = useState([]);
  const [newVersionTitle, setNewVersionTitle] = useState("");
  const [navigationLink, setNavigationLink] = useState("");
  const [desc, setDesc] = useState("");
  const [isMandatory, setIsMandatory] = useState(false);
  const renderItem = ({ item }) => {
    return (
      <View style={styles(activeTheme).item}>
        <Text style={styles(activeTheme).title}>* {item.title}</Text>
      </View>
    );
  };


  useEffect(() => {
    if (activeLanguage && activeLanguage.Slug) {
      fetch("https://w-validator.coinpara.com/api/mobile/info?lang=" + activeLanguage.Slug, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then(res => res.json())
        .then(response => {
          if (
            response
            && response.iosVersion
            && response.shouldCheck
            && response.iosVersion !== "0.0.0"
          ) {
            if (version < response.iosVersion) {
              if (response.isMandatory) {
                setIsMandatory(true);
              }
              setDesc(response.desc);
              setNavigationLink(isIos ? response.iosLink : response.androidLink);
              setData(response.changes);
              setNewVersionTitle(response.title || "Coinpara");
              setTimeout(() => {
                setModalVisible(true);
              }, 500);
            }
          }
        });
    }
  }, [activeLanguage]);


  const handleOpenUrl = () => {
    if (navigationLink) {
      setModalVisible(false);
      setTimeout(async () => {
        await Linking.openURL(navigationLink);
      }, 500);
    }

  };


  return (

    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      statusBarTranslucent
      onRequestClose={() => setModalVisible(false)}>

      <View style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>


        <View style={styles(activeTheme).con}>

          {/*{*/}
          {/*  !isMandatory && <TouchableOpacity*/}
          {/*    onPress={() => setModalVisible(false)}*/}
          {/*    style={styles(activeTheme).diss}>*/}
          {/*    <Text style={styles(activeTheme).dT}>X</Text>*/}
          {/*  </TouchableOpacity>*/}
          {/*}*/}


          <View style={styles(activeTheme).footer}>

            <View style={{
              height: "35%",
              width: "100%",
              alignItems: "center",
            }}>
              <View style={styles(activeTheme).line} />

              <Text style={styles(activeTheme).big}>{newVersionTitle}</Text>

              <Text style={styles(activeTheme).desc}>{desc}</Text>
            </View>

            <FlatList
              style={styles(activeTheme).list}
              contentContainerStyle={styles(activeTheme).listC}
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />


            <View style={{
              height: "30%",
              width: "100%",
              justifyContent: "flex-end",
            }}>
              <TouchableOpacity
                style={styles(activeTheme).addButton}
                onPress={handleOpenUrl}>
                <Text style={styles(activeTheme).addButtonText}>{getLang(language, "UPDATE")}</Text>
              </TouchableOpacity>


              {
                !isMandatory && <TouchableOpacity
                  style={[styles(activeTheme).addButton, {
                    backgroundColor: activeTheme.secondaryText,
                    marginTop: 12,
                  }]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles(activeTheme).addButtonText}>{getLang(language, "CANCEL")}</Text>
                </TouchableOpacity>
              }

            </View>
          </View>

        </View>

      </View>

    </Modal>

  );
};
export default React.memo(VersionModal);

const styles = (props) => StyleSheet.create({
  con: {
    width: SCREEN_WIDTH - (PADDING_H * 4),
    height: SCREEN_HEIGHT / 2,
    backgroundColor: props.backgroundApp,
    paddingVertical: PADDING_H,
    paddingHorizontal: PADDING_H,
    borderWidth: 1,
    borderColor: props.actionColor,
    borderRadius: 12,

  },
  line: {
    height: 6,
    width: "16%",
    backgroundColor: props.changeRed,
    borderRadius: 12,
    marginVertical: 8,
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    // position: "absolute",
    // zIndex: 11,
    // left: PADDING_H,
    // bottom: 20,
    backgroundColor: props.actionColor,
    width: "100%",
    // height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    marginVertical: 4,
    paddingVertical: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "CircularStd-Book",
  },

  item: {
    marginVertical: 8,
    marginHorizontal: 16,
  },

  big: {
    color: props.appWhite,
    fontSize: BIG_TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
  },
  desc: {
    width: "100%",
    paddingHorizontal: PADDING_H,
    fontSize: NORMAL_FONTSIZE,
    color: props.appWhite,
    marginVertical: "5%",
  },
  title: {
    color: props.appWhite,
    fontSize: NORMAL_FONTSIZE,
    fontFamily: "CircularStd-Book",
  },
  list: {
    width: "100%",
    height: "35%",
  },
  listC: {
    // paddingVertical: PADDING_H * 2,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  diss: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: props.darkBackground,
    borderWidth: 1,
    borderColor: props.borderGray,
    zIndex: 9999,
  },
  dT: {
    fontFamily: "CircularStd-Bold",
    color: props.appWhite,
    fontSize: BIG_TITLE_FONTSIZE * 1.2,
  },
});




