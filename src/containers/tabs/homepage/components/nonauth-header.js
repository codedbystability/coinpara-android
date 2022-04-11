import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { BIG_TITLE_FONTSIZE, LIST_ITEM_HEIGHT, PADDING_H, SCREEN_WIDTH } from "../../../../../utils/dimensions";
import { navigationRef } from "../../../../providers/RootNavigation";
import NImage from "../../../../components/image/index.tsx";
import TinyImage from "../../../../tiny-image";


class NonAuthHeader extends React.PureComponent {

  constructor() {
    super();
    this.handleNavigation = this.handleNavigation.bind(this);
  }

  handleNavigation = () => navigationRef.current.navigate("LoginRegister");


  render() {
    const { activeTheme, activeThemeKey } = this.props;

    return (
      <View style={styles(activeTheme).wrapper}>
        <View style={styles(activeTheme).content}>

          <View style={styles(activeTheme).inner}>
            <NImage
              useFastImage={true}
              style={{
                width: SCREEN_WIDTH / 3.2,
                height: LIST_ITEM_HEIGHT / 1.4,
              }}
              resizeMode={"contain"}
              source={{
                uri: `https://images.coinpara.com/files/mobile-assets/${activeThemeKey}-logo.png`,
              }} />
          </View>

          <Pressable onPress={this.handleNavigation}>
            <TinyImage style={styles(activeTheme).icon} parent={"rest/"} name={"user"} />
          </Pressable>

        </View>
      </View>
    );
  }
}


export default NonAuthHeader;

const styles = (props) => StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  content: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: PADDING_H,
  },
  welcome: {
    fontFamily: "CircularStd-Bold",
    fontSize: BIG_TITLE_FONTSIZE,
    color: props.appWhite,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon:{
    width:22,
    height:22,
  }
});
