import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { getLang } from "../../../../../helpers/array-helper";
// import RealAnimatedTab from "../../../../../components/page-components/real-animated-tab";
import { useDispatch, useSelector } from "react-redux";
import LocalStorage from "../../../../../providers/LocalStorage";
import { setColorOption, setIconColor } from "../../../../../actions/global-actions";
import DropdownAlert from "../../../../../providers/DropdownAlert";
import { DIMENSIONS } from "../../../../../../utils/dimensions";
import AnimatedTab from "../../../../../components/page-components/animated-tab";
import RealAnimatedTab from "../../../../../components/page-components/real-animated-tab";

const ColorOption = () => {
  const {
    activeTheme,
    activeThemeKey,
    colorOptions,
    activeColorOption,
    fontSizes,
    language,
    iconColor,
  } = useSelector(state => state.globalReducer);

  const dispatch = useDispatch();
  const [activeType, setActiveType] = useState("");
  const [headers, setHeaders] = useState([]);
  const [iconColors, iconColorsSt] = useState([]);

  useEffect(() => {
    if (activeThemeKey === "classic")
      iconColorsSt([{ id: 1, img: "color", key: "color", val: "BTC", title: "COLOR_ICON" },
        { id: 2, img: "white", key: "white", val: "BTC", title: "WHITE_ICON" }]);
    else if (activeThemeKey === "light")
      iconColorsSt([{ id: 3, img: "black", key: "black", val: "BTC", title: "BLACK_ICON" },
        { id: 1, img: "color", key: "color", val: "BTC", title: "COLOR_ICON" },
      ]);
    else if (activeThemeKey === "dark")
      iconColorsSt([{ id: 2, img: "white", key: "white", val: "BTC", title: "WHITE_ICON" },
        { id: 1, img: "color", key: "color", val: "BTC", title: "COLOR_ICON" },
      ]);

    // iconColorsSt(tiCols.filter(itm => itm.key !== iconColor));
  }, [activeThemeKey]);

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
  const onChangeIcon = (val) => {
    if (val !== iconColor) {
      LocalStorage.setItem("iconColor", val);
      dispatch(setIconColor(val));
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
          paddingHorizontal: DIMENSIONS.PADDING_V,
        }}>{getLang(language, "YOU_CAN_CUSTOMIZE_COLORS")}</Text>

      <RealAnimatedTab {...{
        activeKey: activeType,
        headers: headers,
        width: `25%`,
        filled: true,
        onChange,
      }} />


      <Text
        style={{
          fontFamily: "CircularStd-Book",
          fontSize: fontSizes?.SUBTITLE_FONTSIZE,
          color: activeTheme.secondaryText,
          marginTop: 12,
          paddingHorizontal: DIMENSIONS.PADDING_V,
        }}>{getLang(language, "YOU_CAN_CUSTOMIZE_ICON_COLOR")}</Text>


      <RealAnimatedTab {...{
        activeKey: iconColor,
        headers: iconColors,
        width: `50%`,
        filled: true,
        onChange: onChangeIcon,
      }} />


    </View>
  );

};


export default React.memo(ColorOption);
