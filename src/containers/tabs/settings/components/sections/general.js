import React, { useEffect, useState } from "react";
import ScreenSaver from "../screen-saver";
import ThemeSelector from "../theme-selector";
import FontSizeView from "../font-size/font-size-view";
import ColorOption from "../color-option";
import BuySellApprove from "../buysell-approve";
import LanguageItem from "../../components/language-item";
import { Modal, StyleSheet, Text, NativeModules, View, TouchableOpacity } from "react-native";
import TinyImage from "../../../../../tiny-image";
import { getLang } from "../../../../../helpers/array-helper";
import { useSelector } from "react-redux";
import { LIST_MARGIN_T, PADDING_H, PADDING_V, TITLE_FONTSIZE } from "../../../../../../utils/dimensions";
import NavigationListItem from "../../../../../components/navigation-list-item";
import NImage from "../../../../../components/image/index.tsx";
import Loading from "../../../../../providers/Loading";
import LocalStorage from "../../../../../providers/LocalStorage";

const item = {
  id: 2,
  key: "LANGUAGE_SETTINGS",
  type: "language",
  page: null,
  image: "language",
};


// const navItem = {
//   id: 2,
//   key: "CHANGE_APP_ICON",
//   type: "modal",
//   page: null,
//   image: "app-icon",
// };

const icons = [
  { id: 2, key: "CLASSIC_LOGO", image: "iconclassic.png", action: "classic" },
  { id: 3, key: "BLACK_LOGO", image: "iconblack.png", action: "black" },
  { id: 1, key: "WHITE_LOGO", image: "iconwhite.png", action: "white" },
];
const GeneralSection = (props) => {

  const {authenticated} = props
  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const [showModal, setShowModal] = useState(false);
  const [activeIcon, setActiveIcon] = useState("classic");
  const onAction = () => {
    setShowModal(true);
  };

  useEffect(() => {
    if (showModal) {
      const ac = LocalStorage.getItem("activeIcon", null);
      if (ac && ac !== activeIcon) {
        setActiveIcon(ac);
      }
    }
  }, [showModal]);

  const handleApprove = (item) => {
    Loading.show();

    setTimeout(() => {
      try {
        NativeModules.IconModule.callNativeEvent(item.action, (err, key) => {
          if (!err) {
            LocalStorage.setItem("activeIcon", key);
            setActiveIcon(key);
          }
          setTimeout(() => {
            Loading.hide();
          }, 500);
        });
      } catch (e) {
        console.log(e);
      }
    }, 500);
  };
  return (
    <>
      <ThemeSelector />
      <FontSizeView />
      <ColorOption />

      <LanguageItem item={item} />
      {/*<NavigationListItem*/}
      {/*  onAction={onAction}*/}
      {/*  item={navItem} isStatic={false} />*/}

      {
        authenticated && <>
          <BuySellApprove />

          <ScreenSaver />
        </>
      }



      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          // this.closeButtonFunction()
        }}>
        <View
          style={styles(activeTheme).w1}>
          <TouchableOpacity onPress={() => setShowModal(false)} activeOpacity={.6}
                            style={[styles(activeTheme).dismissButton]}>
            <TinyImage parent={"rest/"} name={"cancel"} style={styles(activeTheme).icon2} />
          </TouchableOpacity>

          <Text style={styles(activeTheme).headerText}>{getLang(language, "CHOOSE_YOU_APP_ICON")}</Text>

          <View style={styles(activeTheme).c3}>


            {
              icons.map(item => {
                const isActive = activeIcon === item.action;
                return (
                  <TouchableOpacity
                    activeOpacity={.6}
                    key={item.key}
                    onPress={() => handleApprove(item)}
                    style={styles(activeTheme).i0}>
                    <View style={[styles(activeTheme).i1, {
                      backgroundColor: isActive ? activeTheme.actionColor : activeTheme.borderGray,
                    }]}>
                      <NImage
                        style={styles(activeTheme).ic}
                        source={{ uri: "https://images.coinpara.com/files/mobile-assets/" + item.image }}
                        useFastImage={true} resizeMode={"cover"} />
                    </View>

                    <Text style={styles(activeTheme).txt}>{getLang(language, item.key)}</Text>
                  </TouchableOpacity>

                );
              })
            }


          </View>


        </View>
      </Modal>

    </>

  );
};


export default React.memo(GeneralSection);

const styles = (props, fontSizes) => StyleSheet.create({
  wrapper: {
    width: "100%",
    marginTop: LIST_MARGIN_T,
    flexDirection: "row",
    paddingVertical: PADDING_V,
    paddingHorizontal: PADDING_H,
    borderRadius: 8,
    backgroundColor: props.darkBackground,
    borderWidth: 1,
    borderColor: props.borderGray,
  },

  image: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: props.appWhite,
  },

  title: {
    fontFamily: "CircularStd-Book",
    fontSize: fontSizes?.BIG_TITLE_FONTSIZE,
    color: props.appWhite,
    backgroundColor: "red",
  },

  rightWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  svT: {
    color: props.secondaryText,
    marginTop: 2,
    // marginBottom: 16,
    fontSize: fontSizes?.NORMAL_FONTSIZE - 2,
    paddingHorizontal: PADDING_H,
  },

  icon: {
    width: 22,
    height: 22,
  },

  icon2: {
    width: 18,
    height: 18,
  },

  headerText: {
    fontFamily: "CircularStd-Book",
    color: props.appWhite,
    fontSize: TITLE_FONTSIZE,
  },

  txt: {
    fontFamily: "CircularStd-Book",
    color: props.secondaryText,
    fontSize: TITLE_FONTSIZE,
  },

  dismissButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: PADDING_V,
  },
  i1: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  i0: {
    alignItems: "center",
    justifyContent: "center",
  },
  ic: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  c3: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },
  w1: {
    height: "40%",
    marginTop: "auto",
    paddingTop: PADDING_V * 2,
    backgroundColor: props.darkBackground,
    alignItems: "center",
    borderTopWidth: 12,
    borderTopColor: props.actionColor,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
});
