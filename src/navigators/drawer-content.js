import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";

import {
  DrawerContentScrollView, useDrawerStatus,
} from "@react-navigation/drawer";
import { useSelector } from "react-redux";
import AccountsSection from "../containers/tabs/settings/components/sections/accounts";
import { DIMENSIONS } from "../../utils/dimensions";
import UserInfo from "../containers/tabs/settings/components/user-info";
import SettingsLogout from "../containers/tabs/settings/components/settings-logout";
import Animated from "react-native-reanimated";
import NImage from "../components/page-components/image/index.tsx";
import { navigationRef } from "../providers/RootNavigation";


const DrawerContent = (props) => {

  // const dispatch = useDispatch();

  const scrollRef = useRef();
  const { activeTheme, activeThemeKey } = useSelector(state => state.globalReducer);
  const { authenticated } = useSelector(state => state.authenticationReducer);
  const isDrawerOpen = useDrawerStatus() === "open";
  const [currentRouteName, setCurrentRouteName] = useState("");

  useEffect(() => {
    if (isDrawerOpen) {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
      setCurrentRouteName(navigationRef.current?.getCurrentRoute().name);
    }
  }, [isDrawerOpen]);


  return (
    <Animated.View style={{ flex: 1 }}>
      <NImage
        useFastImage={true}
        style={styles(activeTheme).bg}
        source={{
          uri: `https://images.coinpara.com/files/mobile-assets/${activeThemeKey}-drawer-bg.jpg`,
        }}>
      </NImage>

      <DrawerContentScrollView
        ref={scrollRef}
        {...props}>


        <View style={styles(activeTheme).drawerContent}>

          <View style={styles(activeTheme).con}>


            <NImage
              useFastImage={true}
              source={{ uri: `https://images.coinpara.com/files/mobile-assets/${activeThemeKey}-logo.png` }}
              style={{
                width: DIMENSIONS.BIG_IMAGE,
                height: 30,
              }}
              resizeMode={"contain"} />


          </View>


          <View style={styles(activeTheme).con2}>

            {
              authenticated && <UserInfo />
            }

            <AccountsSection
              currentRouteName={currentRouteName}
              authenticated={authenticated} />

          </View>


        </View>
      </DrawerContentScrollView>

      {
        authenticated && <View style={styles(activeTheme).bottomDrawerSection}>
          <SettingsLogout />
        </View>
      }

    </Animated.View>
  );
};

export default React.memo(DrawerContent);


const styles = props => StyleSheet.create({
  bg: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  con: {
    paddingHorizontal: DIMENSIONS.PADDING_H,
    zIndex: 9999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  drawerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: props.borderGray,
    borderTopWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: DIMENSIONS.PADDING_H,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  icon: {
    width: 18,
    height: 18,
  },
  image: {
    width: 14,
    height: 14,
  },
  con2: {
    marginVertical: 15,
    paddingHorizontal: DIMENSIONS.PADDING_H / 2,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  active: {
    paddingHorizontal: DIMENSIONS.PADDING_H * 1.4,
    borderRadius: 12,
    paddingVertical: 6,
    backgroundColor: props.darkBackground,
  },
});
