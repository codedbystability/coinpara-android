import React from "react";
import TinyImage from "../../tiny-image";
import { StyleSheet, TouchableOpacity } from "react-native";
import { PADDING_H, SCREEN_WIDTH } from "../../../utils/dimensions";
import { useSelector } from "react-redux";


const EditButton = (props) => {

  const { activeTheme } = useSelector(state => state.globalReducer);
  const { onPress } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={.8}
      style={styles(activeTheme).butt}>

      <TinyImage parent={"rest/"} name={"filter"} style={styles(activeTheme).icn} />

    </TouchableOpacity>
  );


};


export default React.memo(EditButton);


const styles = props => StyleSheet.create({
  butt: {
    height: 40,
    width: 40,
    borderRadius: 20,
    position: "absolute",
    right: PADDING_H,
    bottom: PADDING_H * 2,
    alignItems: "center",
    justifyContent: "center",
    padding: PADDING_H,
    backgroundColor: props.darkBackground,
    borderWidth: 1,
    borderColor: props.appWhite,
  },
  icn: {
    width: 16,
    height: 16,
  },

});
