import React from "react";
import { NORMAL_FONTSIZE, PADDING_H } from "../../../utils/dimensions";
import { Pressable, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { getLang } from "../../helpers/array-helper";


const RadioOptions = (props) => {

  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const { isSelected, option, onPress } = props;

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}>
      <View style={[{
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: activeTheme.borderGray,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 6,
      }, props.style]}>
        {
          isSelected &&
          <View style={{
            height: 10,
            width: 10,
            borderRadius: 5,
            backgroundColor: activeTheme.actionColor,
          }} />
        }

      </View>
      <Text style={{
        fontFamily: "CircularStd-Book",
        fontSize: NORMAL_FONTSIZE,
        color: activeTheme.secondaryText,
      }}>{getLang(language, option.lang)}</Text>
    </Pressable>
  );

};


export default React.memo(RadioOptions);
