import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSelector } from "react-redux";
import styles from "./styles";
import { navigationRef } from "../../../../providers/RootNavigation";
import WalletTotal from "../../../../components/wallet-total";
import { getLang } from "../../../../helpers/array-helper";
import TinyImage from "../../../../tiny-image";
import { PADDING_H } from "../../../../../utils/dimensions";
import { useNavigation } from "@react-navigation/native";


const AuthHeader = ({ refreshing }) => {

  const navigation = useNavigation();
  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const { user } = useSelector(state => state.authenticationReducer);

  const handleNavigation = (type) => navigationRef.current.navigate(type);

  const handleDrawer = () => {
    navigation.toggleDrawer();
  };

  return (
    <View style={styles(activeTheme).wrapper}>

      <View style={styles(activeTheme).headerContainer}>

        <View style={{ flexDirection: "row", alignItems: "center" }}>

          <Pressable onPress={handleDrawer} style={{ padding: 5, paddingHorizontal: 8 }}>
            <TinyImage style={styles(activeTheme).iconA} parent={"rest/"} name={"drawer"} />
          </Pressable>


          <Pressable onPress={() => handleNavigation("ScanScreen")} style={{ padding: 5, paddingHorizontal: 8 }}>
            <TinyImage style={styles(activeTheme).imgH} parent={"rest/"} name={"qr-login"} />
          </Pressable>


        </View>

        <Pressable
          onPress={() => handleNavigation("AccountInformation")}
          style={{
            paddingVertical: PADDING_H,
            flexDirection: "row",
            alignItems: "center",
          }}>


          <Text
            style={styles(activeTheme).nameText}>
            <Text
              style={styles(activeTheme).nameText}>
              {getLang(language, "DEAR_SHORT")} </Text>
            {user.Name[0].toUpperCase() + user.Name.toLowerCase().substring(1)} {user.Surname[0].toUpperCase() + user.Surname.toLowerCase().substring(1)}
          </Text>


          <View style={{ paddingVertical: 5 }}>
            <TinyImage style={styles(activeTheme).iconA} parent={"rest/"} name={"user"} />
          </View>
        </Pressable>


      </View>

      <WalletTotal refreshing={refreshing} />

    </View>

  );
};


export default React.memo(AuthHeader);

