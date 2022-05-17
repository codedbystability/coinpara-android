import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import {
  PADDING_H,
} from "../../../../utils/dimensions";
import FloatingAction from "../../../components/floating-action";
import LinksSection from "../../tabs/settings/components/sections/links";
import { navigationRef } from "../../../providers/RootNavigation";


const SupportCenterInner = props => {

  const { activeTheme } = useSelector(state => state.globalReducer);
  const [allStatics, setAllStatics] = useState([]);
  const [item, setItem] = useState({
    items: [],
    title: "",
  });
  useEffect(() => {
    if (props.route && props.route.params && props.route.params) {
      setItem(props.route.params.item || item);
      setAllStatics(props.route.params.allStatics || []);
    }
  }, [props.route]);

  const handleOnPress = (item) => {
    return navigationRef.current.navigate("Static", {
      title: item.Title,
      url: item.url,
      content: item.Description,
      param: null,
      isSupport: true,
      allStatics: allStatics,
    });
  };


  return (
    <>
      <TabNavigationHeader
        {...props}
        backAble={true}
        isBack={true}
        options={{ title: item.Title }}
      />


      <ScrollView showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles(activeTheme).scroll}>

        <LinksSection handleOnPress={handleOnPress} statics={item.items} isStatic={true} />

      </ScrollView>

      <FloatingAction />
    </>
  );


};


const SupportCenterInnerScreen = styledHigherOrderComponents(SupportCenterInner);
export default SupportCenterInnerScreen;


const styles = (props) => StyleSheet.create({
  scroll: { paddingHorizontal: PADDING_H, paddingTop: 12, paddingBottom: 120 },

});
