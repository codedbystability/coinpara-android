import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { getLang } from "../../../../../helpers/array-helper";
import RealAnimatedTab from "../../../../../components/real-animated-tab";
import { useDispatch, useSelector } from "react-redux";
import LocalStorage from "../../../../../providers/LocalStorage";
import { setColorOption } from "../../../../../actions/global-actions";

const ColorOption = (props) => {
  const {
    activeTheme,
    colorOptions,
    activeColorOption,
    fontSizes,
    language,
  } = useSelector(state => state.globalReducer);

  const dispatch = useDispatch();
  const [activeType, setActiveType] = useState("");
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    if (activeType === "") {
      setActiveType(activeColorOption);
    }
  }, [activeColorOption]);


  useEffect(() => {
    LocalStorage.setItem("COLOR_OPTION", activeType);
    dispatch(setColorOption(activeType));
  }, [activeType]);

  useEffect(() => {
    if (colorOptions.length >= 1) {
      setHeaders([{
        id: 1, key: "SYSTEM", title: "SYSTEM", colors: {
          green: activeTheme.changeGreen,
          red: activeTheme.changeRed,
        },
      }, ...colorOptions]);
    }
  }, [colorOptions]);


  return (
    <View>
      <Text
        style={{
          fontFamily: "CircularStd-Book",
          fontSize: fontSizes?.TITLE_FONTSIZE,
          color: activeTheme.secondaryText,
          marginTop: 12,
        }}>{getLang(language, "YOU_CAN_CUSTOMIZE_COLORS")}</Text>

      <RealAnimatedTab {...{
        activeKey: activeType,
        headers: headers,
        width: `25%`,
        filled: true,
        onChange: setActiveType,
      }} />


    </View>
  );

};


export default ColorOption;
