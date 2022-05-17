import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { INPUT_HEIGHT, NORMAL_FONTSIZE, PADDING_H, TITLE_FONTSIZE } from "../../../utils/dimensions";
import TinyImage from "../../tiny-image";
import { useSelector } from "react-redux";
import ActionSheetComProvider from "../../providers/ActionSheetComProvider";
import { getLang } from "../../helpers/array-helper";


const SelectInput = props => {

  const { activeTheme, language } = useSelector(state => state.globalReducer);

  const {
    options,
    selectedOption,
    title,
    onSelect,
  } = props;

  const handleSelect = () => {

    const selectOptions = options.map(op => getLang(language, op));


    ActionSheetComProvider.show({
      title: getLang(language, "CHANGE_LANGUAGE_POPUP_DESCRIPTION"),
      options: selectOptions,
      onAction: (index) => onItemSelected(index),
    });
  };

  const onItemSelected = (index) => {
    if (index === options.length - 1) {
      return false;
    }

    onSelect(options[index]);


  };
  return (
    <TouchableOpacity
      onPress={handleSelect}
      activeOpacity={.8}
      style={{
        width: "100%",
        height: INPUT_HEIGHT,
        borderWidth: 1,
        borderColor: activeTheme.borderGray,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: PADDING_H,
        marginVertical: 8,
      }}>

      <View>
        <Text style={{
          color: activeTheme.secondaryText,
          fontFamily: "CircularStd-Book",
          fontSize: NORMAL_FONTSIZE,
        }}>{title}</Text>

        {
          selectedOption ? <Text style={{
            color: activeTheme.appWhite,
            fontFamily: "CircularStd-Book",
            fontSize: NORMAL_FONTSIZE,
            marginTop: 4,
          }}>{selectedOption}</Text> : null
        }

      </View>


      <TinyImage parent={"rest/"} name={"c-down"} style={styles(activeTheme).icon} />

    </TouchableOpacity>
  );

};


export default React.memo(SelectInput);
const styles = (props) => StyleSheet.create({

  icon: {
    width: 12,
    height: 12,
  },

});
