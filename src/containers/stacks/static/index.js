import React, { useEffect, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { WebView } from "react-native-webview";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import Loading from "../../../providers/Loading";
import { getLang } from "../../../helpers/array-helper";
import TabNavigationHeader from "../../../components/tab-navigation-header";


const Static = (props) => {

  const content = props.route.params.content;
  const { activeTheme, language } = useSelector(state => state.globalReducer);

  const [ready, setReady] = useState(false);
  const [validContent, setValidContent] = useState("");
  const handleOnLoad = () => {
    setTimeout(() => {
      setReady(true);
      Loading.hide();
    }, 1000);
  };

  useEffect(() => {
    Loading.show();
  }, []);


  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string


  useEffect(() => {
    if (content) {
      const h1 = content.replace(new RegExp(escapeRegExp(`<h1>`), "g"), `<h1 style="color: ${activeTheme.appWhite};">`);
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
              <body style="background-color:  ${activeTheme.darkBackground}">
                <div style="background-color: ${activeTheme.darkBackground};overflow: scroll;left: 0;padding: 12px 12px 80px 12px;">
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
              <body style="background-color: ${activeTheme.darkBackground}">
                <div style="background-color: ${activeTheme.darkBackground};overflow: scroll;left: 0;padding: 12px 12px 80px 12px;">
                 <p style="color: ${activeTheme.appWhite}">${getLang(language, "AN_UNKNOWN_ERROR_OCCURED")}</p>
                 </div> 
              </body>
        </html>`,
      );
    }
  }, [content]);


  return (
    <View style={styles(activeTheme).view}>
      <TabNavigationHeader
        {...props}
        backAble={true}
        options={{ title: props.route.params.Title }}
      />
      <WebView
        onLoadEnd={handleOnLoad}
        source={{ html: validContent }}
        containerStyle={styles(activeTheme).view}
        style={[styles(activeTheme).view, { opacity: !ready ? 0 : 1 }]}
      />
    </View>
  );
};


const StaticScreen = styledHigherOrderComponents(Static);

export default StaticScreen;

const styles = (props) => StyleSheet.create({
  view: {
    backgroundColor: props.backgroundApp,
    flex: 1,
  },
});
