import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSelector } from "react-redux";
import styles from "./styles";
import { navigationRef } from "../../../../providers/RootNavigation";
import WalletTotal from "../../../../components/wallet-total";
import { getLang } from "../../../../helpers/array-helper";
import TinyImage from "../../../../tiny-image";


const AuthHeader = ({refreshing}) => {

  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const { user } = useSelector(state => state.authenticationReducer);

  const handleNavigation = (type) => navigationRef.current.navigate(type);

  return (
    <View style={styles(activeTheme).wrapper}>

      <View style={styles(activeTheme).headerContainer}>

        <View>

          <Text
            style={styles(activeTheme).nameText}>
            <Text
              style={styles(activeTheme).nameText}>
              {getLang(language, "DEAR_SHORT")} </Text>
            {user.Name[0].toUpperCase() + user.Name.toLowerCase().substring(1)} {user.Surname[0].toUpperCase() + user.Surname.toLowerCase().substring(1)}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={() => handleNavigation("AccountInformation")}
                     style={{ padding: 5, paddingHorizontal: 8 }}>
            <TinyImage style={styles(activeTheme).imgH} parent={"rest/"} name={"user"} />
          </Pressable>

          <Pressable onPress={() => handleNavigation("Notifications")} style={{ padding: 5, paddingHorizontal: 8 }}>
            <TinyImage style={styles(activeTheme).imgH} parent={"rest/"} name={"notifications"} />
          </Pressable>

          <Pressable onPress={() => handleNavigation("ScanScreen")} style={{ padding: 5, paddingHorizontal: 8 }}>
            <TinyImage style={styles(activeTheme).imgH} parent={"rest/"} name={"qr-login"} />
          </Pressable>
        </View>
      </View>

      <WalletTotal refreshing={refreshing}/>

    </View>

  );
};


export default React.memo(AuthHeader);

