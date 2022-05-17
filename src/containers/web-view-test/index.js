import React, { useState } from "react";
import WebView from "react-native-webview";


const WebViewTest = (props) => {

  const [sCookies, setSCookies] = useState({});
  const [webViewUrl, setWebViewUrl] = useState("");

  const onNavigationStateChange = (webViewState: { url: string }) => {

    const { url } = webViewState;
    console.log('onNavigationStateChange - ',url)

    // when WebView.onMessage called, there is not-http(s) url
    if (url.includes("http")) {
      setWebViewUrl(url);
    }
  };

  const _checkNeededCookies = () => {
    const { cookies, webViewUrl } = this.state;

    if (webViewUrl === "SUCCESS_URL") {
      if (cookies["cookie-name-for-jwt"]) {
        alert(cookies["cookie-name-for-jwt"]);
        // do your magic...
      }
    }
  };

  const _onMessage = (event) => {
    console.log('_onMessage - ',event)
    const { data } = event.nativeEvent;
    const cookies = data.split(";"); // `csrftoken=...; rur=...; mid=...; somethingelse=...`

    cookies.forEach((cookie) => {
      const c = cookie.trim().split("=");

      const new_cookies = sCookies;
      new_cookies[c[0]] = c[1];

      setSCookies(new_cookies);
    });

    _checkNeededCookies();
  };
  const jsCode = "window.postMessage(document.cookie)";

  return (
    <WebView
      source={{ uri: "https://coinpara.com/" }}
      onNavigationStateChange={onNavigationStateChange}
      onMessage={_onMessage}
      injectedJavaScript={jsCode}
      style={{ flex: 1 }}
    />
  );
};


export default React.memo(WebViewTest);
