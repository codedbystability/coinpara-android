import * as React from "react";
import { ScrollView, View, StyleSheet, Pressable, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { DIMENSIONS } from "../../../../utils/dimensions";
import GeneralSection from "../../tabs/settings/components/sections/general";
import { useEffect, useState } from "react";
import TabNavigationHeader from "../../../components/page-components/tab-navigation-header";
import { getLang } from "../../../helpers/array-helper";
import generalServices from "../../../services/general-services";
import { setActiveTheme, setClassicColors, setColorOption, setFontSize } from "../../../actions/global-actions";
import LocalStorage from "../../../providers/LocalStorage";
import FloatingAction from "../../../components/page-components/floating-action";

const SystemSettingsScreen = (props) => {

  const dispatch = useDispatch();
  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const { authenticated } = useSelector(state => state.authenticationReducer);
  const [param, setParam] = useState("");


  useEffect(() => {
    if (props.route && props.route.params && props.route.params.param) {
      setParam(props.route.params.param);
    }
  }, [props.route]);


  const handleResetSettings = () => {
    generalServices.getColors("classic").then((response) => {
      if (response && response.IsSuccess) {
        LocalStorage.setItem("activeTheme", "classic");
        LocalStorage.setItem("COLOR_OPTION", "SYSTEM");

        dispatch(setClassicColors(response.Data));
        dispatch(setActiveTheme("classic", response.IconColor));
        dispatch(setFontSize(11));
        dispatch(setColorOption("SYSTEM"));
      }
    });
  };

  return (

    <>
      <TabNavigationHeader
        {...props}
        backAble={true}
        options={{
          title: getLang(language, param === "system" ? "SYSTEM_SETTINGS" : "SECURITY_SETTINGS"),
        }}
      />

      <View style={styles(activeTheme).wrapper}>


        <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles(activeTheme).scroll}>

          <GeneralSection authenticated={authenticated} />

          <Pressable
            onPress={handleResetSettings}
            style={styles(activeTheme).wrapper2}>
            <Text style={styles(activeTheme).text}>
              {getLang(language, "RESET_SETTINGS")}
            </Text>
          </Pressable>
        </ScrollView>


      </View>

      <FloatingAction />

    </>

  );
};


export default React.memo(SystemSettingsScreen);


const styles = props => StyleSheet.create({
  wrapper: {
    flex: 1, backgroundColor: props.backgroundApp,
    paddingHorizontal: DIMENSIONS.PADDING_H, paddingVertical: 40,
  },
  wrapper2: {
    marginTop: 60,
  },
  text: {
    textAlign: "center",
    fontFamily: "CircularStd-Bold",
    color: props.secondaryText,
  },
});
