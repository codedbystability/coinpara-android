import React from "react";
import TinyImage from "../../../tiny-image";
import { StyleSheet, TouchableOpacity } from "react-native";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { useSelector } from "react-redux";


const EditButton = (props) => {

  const { activeTheme } = useSelector(state => state.globalReducer);
  const { onPress, isButton } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={.8}
      style={styles(activeTheme, isButton).butt}>

      <TinyImage parent={"rest/"} name={"filter"} style={styles(activeTheme, isButton).icn} />

    </TouchableOpacity>
  );


};


export default React.memo(EditButton);


const styles = (props, isButton) => StyleSheet.create({
  butt: {
    height: 40,
    width: 40,
    borderRadius: 20,
    position: "absolute",
    right: DIMENSIONS.PADDING_H,
    bottom: isButton ? 72 : DIMENSIONS.PADDING_H * 2,
    alignItems: "center",
    justifyContent: "center",
    padding: DIMENSIONS.PADDING_H,
    backgroundColor: props.darkBackground,
    borderWidth: 1,
    borderColor: props.appWhite,
    zIndex: 99,
  },
  icn: {
    width: 16,
    height: 16,
  },

});
