import React, { useEffect, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { WebView } from "react-native-webview";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import Loading from "../../../providers/Loading";
import { getLang } from "../../../helpers/array-helper";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import FloatingAction from "../../../components/floating-action";
import { NORMAL_FONTSIZE, PADDING_H, SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../../utils/dimensions";
import TinyImage from "../../../tiny-image";
import ModalProvider from "../../../providers/ModalProvider";
import SupportCenterFilterScreen from "../support-center/filter";


const Static = (props) => {

  const content = props.route.params.content;
  const { activeTheme, language } = useSelector(state => state.globalReducer);

  const [ready, setReady] = useState(false);
  const [isStatic, setIsStatic] = useState(false);
  const [allStatics, setAllStatics] = useState([]);
  const [validContent, setValidContent] = useState("");
  const [searchText, setSearchText] = useState("");

  const handleOnLoad = () => {
    setTimeout(() => {
      setReady(true);
      Loading.hide();
    }, 1000);
  };

  useEffect(() => {
    Loading.show();
  }, []);

  useEffect(() => {
    if (props.route && props.route.params) {
      setIsStatic(props.route.params.isStatic || false);
      setAllStatics(props.route.params.allStatics || []);
    }
  }, [props.route]);

  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string


  useEffect(() => {
    if (content) {
      const img = content.replace(new RegExp(escapeRegExp(`<img`), "g"), `<img style="width: 100;"`);
      const p = img.replace(new RegExp(escapeRegExp(`<p`), "g"), `<p style="color: ${activeTheme.appWhite};"`);
      const h1 = p.replace(new RegExp(escapeRegExp(`<h1>`), "g"), `<h1 style="color: ${activeTheme.appWhite};">`);
      const h2 = h1.replace(new RegExp(escapeRegExp(`<h2>`), "g"), `<h2 style="color: ${activeTheme.appWhite};">`);
      const h3 = h2.replace(new RegExp(escapeRegExp(`<h3>`), "g"), `<h3 style="color: ${activeTheme.appWhite};">`);
      const h4 = h3.replace(new RegExp(escapeRegExp(`<h4>`), "g"), `<p style="color: ${activeTheme.appWhite};">`);
      const h5 = h4.replace(new RegExp(escapeRegExp(`<h6>`), "g"), `<h6 style="color: ${activeTheme.appWhite};">`);
      const h6 = h5.replace(new RegExp(escapeRegExp(`<h6>`), "g"), `<h6 style="color: ${activeTheme.appWhite};">`);
      const red = h6.replace(new RegExp(escapeRegExp(`<p>`), "g"), `<p style="color: ${activeTheme.secondaryText};">`);
      const strong = red.replace(new RegExp(escapeRegExp(`<strong>`), "g"), `<strong style="color: ${activeTheme.appWhite}">`);
      const liis = strong.replace(new RegExp(escapeRegExp(`<li>`), "g"), `<li style="color: ${activeTheme.appWhite};">`);
      setValidContent(
        `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
          <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
          </head>
              <body style="background-color:  ${activeTheme.backgroundApp}">
                <div style="background-color: ${activeTheme.backgroundApp};overflow: scroll;left: 0;padding: 12px 12px 80px 12px;">
                     ${liis}          
                </div> 
              </body>
        </html>    
        `,
      );
    } else {
      setValidContent(
        `<!DOCTYPE html><html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
          <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
          </head>
              <body style="background-color: ${activeTheme.backgroundApp}">
                <div style="background-color: ${activeTheme.backgroundApp};overflow: scroll;left: 0;padding: 12px 12px 80px 12px;">
                 <p style="color: ${activeTheme.appWhite}">${getLang(language, "AN_UNKNOWN_ERROR_OCCURED")}</p>
                 </div> 
              </body>
        </html>`,
      );
    }
  }, [content]);


  const handleShowFilter = () => {
    setSearchText("");
    ModalProvider.show(() => <SupportCenterFilterScreen data={allStatics} />);
  };


  return (
    <>
      <View style={styles(activeTheme).view}>
        <TabNavigationHeader
          {...props}
          isBack={true}
          backAble={true}
          options={{ title: props.route.params.Title }}
        />

        {
          isStatic ? <View style={{
            paddingHorizontal: PADDING_H,
          }}>
            <Pressable
              onPress={handleShowFilter}
              style={styles(activeTheme).inputV}>
              <View style={styles(activeTheme).searchIcon}>
                <TinyImage parent={"rest/"} name={"search"} style={styles(activeTheme).icon} />
              </View>
              <Text style={styles(activeTheme).t1}>
                {getLang(language, "SEARCH")}
              </Text>
            </Pressable>
          </View> : null
        }


        <WebView
          onLoadEnd={handleOnLoad}
          source={{ html: validContent }}
          javaScriptEnabled={false}
          domStorageEnabled={false}
          startInLoadingState={false}
          scalesPageToFit={false}
          scrollEnabled={true}
          injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=0.5, maximum-scale=0.5, user-scalable=2.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
          // scalesPageToFit={false}
          style={[styles(activeTheme).view, { opacity: !ready ? 0 : 1 }]}
        />
      </View>

      <FloatingAction />
    </>

  );
};


const StaticScreen = styledHigherOrderComponents(Static);

export default StaticScreen;

const styles = (props) => StyleSheet.create({
  view: {
    backgroundColor: props.backgroundApp,
    flex: 1,
  },
  inputV: {
    height: 36,
    backgroundColor: props.darkBackground,
    borderRadius: 8,
    paddingHorizontal: PADDING_H / 2,
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    marginVertical: PADDING_H,
  },
  searchIcon: { paddingHorizontal: 10 },
  icon: { width: 18, height: 18 },
  t1: {
    fontSize: NORMAL_FONTSIZE,
    color: props.appWhite,
    fontFamily: "CircularStd-Book",
    textAlign: "center",
  },
});
