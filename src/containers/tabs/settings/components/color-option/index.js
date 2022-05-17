import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { getLang } from "../../../../../helpers/array-helper";
import RealAnimatedTab from "../../../../../components/real-animated-tab";
import { useDispatch, useSelector } from "react-redux";
import LocalStorage from "../../../../../providers/LocalStorage";
import { setColorOption } from "../../../../../actions/global-actions";
import DropdownAlert from "../../../../../providers/DropdownAlert";
import { PADDING_H } from "../../../../../../utils/dimensions";

const ColorOption = () => {
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
    if (activeColorOption) {
      setActiveType(activeColorOption);
    }
  }, [activeColorOption]);


  useEffect(() => {
    if (colorOptions.length >= 1) {
      setHeaders([{
        id: 1, key: "SYSTEM", title: "SYSTEM", colors: {
          bidText: activeTheme.changeGreen,
          askText: activeTheme.changeRed,
        },
      }, ...colorOptions]);
    }
  }, [colorOptions]);


  const onChange = (val) => {
    if (val !== activeType) {
      LocalStorage.setItem("COLOR_OPTION", val);
      dispatch(setColorOption(val));
      DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "COLOR_OPTION_UPDATED"), {
        duration: 1000,
      });
    }
  };
  return (
    <View>
      <Text
        style={{
          fontFamily: "CircularStd-Book",
          fontSize: fontSizes?.SUBTITLE_FONTSIZE,
          color: activeTheme.secondaryText,
          marginTop: 12,
          paddingHorizontal: PADDING_H,
        }}>{getLang(language, "YOU_CAN_CUSTOMIZE_COLORS")}</Text>

      <RealAnimatedTab {...{
        activeKey: activeType,
        headers: headers,
        width: `25%`,
        filled: true,
        onChange,
      }} />


    </View>
  );

};


export default React.memo(ColorOption);
