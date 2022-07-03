import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import ModalProvider, { setModalRef } from "../../../providers/ModalProvider";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import HapticProvider from "../../../providers/HapticProvider";
import { DIMENSIONS } from "../../../../utils/dimensions";
import TinyImage from "../../../tiny-image";
import { setNonUser } from "../../../actions/auth-actions";

let isActive = false;
const GeneralModal = forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));


  const dispatch = useDispatch();
  const { activeTheme } = useSelector(state => state.globalReducer);
  const { userToken } = useSelector(state => state.authenticationReducer);
  const modalRef = useRef();
  const [visible, setVisible] = useState(false);
  const [showDismiss, setShowDismiss] = useState(true);
  const [content, setContent] = useState(null);

  const show = (cont, dismiss = true, pr) => {
    isActive = true;
    setVisible(true);
    setContent(cont);
    setShowDismiss(dismiss);
  };

  const hide = () => setVisible(false);
  const onHide = () => setVisible(false);

  const hideModal = () => {
    HapticProvider.trigger();
    ModalProvider.hide();
    setVisible(false);
  };

  useEffect(() => {
    if (isActive && userToken === "null" && !visible) {
      // TODO SET FOR CANCELED LOCK SCREEN
      dispatch(setNonUser());
    }
  }, [userToken, visible]);


  return (
    <Modal ref={modalRef}
           hideModalContentWhileAnimating={true}
           useNativeDriver={false}
           animationType={"slide"}
           presentationStyle={"overFullScreen"}
           transparent={false}
           visible={visible}
           onRequestClose={onHide}
           statusBarTranslucent
    >
      <View
        style={{ zIndex: 999, flex: 1, backgroundColor: activeTheme.backgroundApp, paddingTop: DIMENSIONS.PADDING_H }}>
        {
          content
        }
      </View>

      {
        showDismiss && <Pressable style={styles(activeTheme).dismissButton} onPress={hideModal}>
          <TinyImage parent={"rest/"} name={"cancel"} style={styles(activeTheme).icon} />
        </Pressable>
      }

    </Modal>
  );
});

const CustomActionSheetComp = () => {
  return (
    <GeneralModal
      ref={(ref) => setModalRef(ref)}
    />
  );
};

export default CustomActionSheetComp;


const ww = DIMENSIONS.SCREEN_WIDTH * 0.2;

const styles = () => StyleSheet.create({
  dismissButton: {
    fontFamily: "CircularStd-Bold",
    color: "#fff",
    position: "absolute",
    bottom: 30,
    width: ww,
    height: ww,
    borderRadius: ww / 2,
    left: DIMENSIONS.SCREEN_WIDTH / 2 - ww / 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999999,
  },
  icon: {
    width: 22,
    height: 22,
  },
});
