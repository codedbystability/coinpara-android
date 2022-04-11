import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import {
  BIG_TITLE_FONTSIZE, PADDING_H,
  PADDING_V,
  TITLE_FONTSIZE,
} from "../../../../../utils/dimensions";
import { isIphoneX } from "../../../../../utils/devices";
import { useSelector } from "react-redux";
import constantServices from "../../../../services/constant-services";
import ModalProvider from "../../../../providers/ModalProvider";
import VideosPlaceholder from "./videos-placeholder";
import HapticProvider from "../../../../providers/HapticProvider";
import TinyImage from "../../../../tiny-image";
import NImage from "../../../../components/image/index.tsx";


const Videos = () => {
  const { activeLanguage } = useSelector(state => state.languageReducer);

  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const [items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setIsFetching(true);
    if (activeLanguage.Id) {
      constantServices.getVideos(activeLanguage.Id, false).then((response) => {
        if (response && response.IsSuccess) {
          setItems(response.Data.filter(dataItem => dataItem.EmbedLink && dataItem.EmbedLink.includes("youtube")));
          setIsFetching(false);
        }
      });
    }
  }, [activeLanguage]);

  function getUrlParameter(url, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    const results = regex.exec(url);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  const handleModal = (item) => {
    HapticProvider.trigger();
    const vi = getUrlParameter(item.EmbedLink, "v");
    setTimeout(() => ModalProvider.show(() => <RenderContent url={"https://www.youtube.com/embed/" + vi} />), 100);
  };

  function Card({ item }) {
    if (!item.Thumbnail) {
      return null;
    }
    return (
      <Pressable onPress={() => handleModal(item)}>
        <View style={styles(activeTheme).item}>
          <NImage
            style={styles(activeLanguage).img}
            resizeMode={"contain"}
            source={{ uri: item.Thumbnail }} useFastImage={true} />

          <Text style={styles(activeTheme).text} numberOfLines={3}>{item.Title}</Text>

          <TinyImage style={styles(activeLanguage).icon}
                     parent={"rest/"} name={"video-play"} />
        </View>
      </Pressable>

    );
  }

  const RenderContent = ({ url }) => {

    const [loaded, setLoaded] = useState(false);
    return (
      <View style={styles(activeTheme).loadingWrapper}>
        {!loaded && (
          <ActivityIndicator
            color={activeTheme.secondaryText}
            style={styles(activeTheme).loading}
            size="small"
          />
        )}
        <WebView
          onLoad={() => setLoaded(true)}
          javaScriptEnabled={true}
          scrollEnabled={false}
          allowsFullscreenVideo={true}
          style={{ backgroundColor: activeTheme.darkBacground }}
          source={{ uri: url }}
        />
      </View>

    );
  };
  if (isFetching) {
    return <VideosPlaceholder />;
  }

  return (

      <View style={styles(activeTheme).container}>
        <FlatList
          contentContainerStyle={{ marginTop: 10 }}
          showsHorizontalScrollIndicator={false}
          data={items}
          renderItem={(item) => <Card item={item.item} />}
          keyExtractor={item => item.RowNumber.toString()}
          horizontal={true}
        />
      </View>
  );
};


export default React.memo(Videos);
const styles = (props) => StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: PADDING_H,
  },
  item: {
    width: 168,
    height: 90,
    marginRight: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: props.darkBackground,
    borderWidth: 1,
    borderColor: props.borderGray,

  },
  image: {
    width: 26,
    height: 26,
    marginBottom: 10,
  },
  text: {
    fontFamily: "CircularStd-Bold",
    fontSize: TITLE_FONTSIZE,
    color: props.appWhite,
    width: "80%",
  },

  modal: {
    backgroundColor: props.backgroundApp,
    marginTop: 20,
  },
  title: {
    fontFamily: "CircularStd-Book",
    fontSize: BIG_TITLE_FONTSIZE,
    color: props.appWhite,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: props.backgroundApp,
  },
  web: {
    // width: "100%",
    // height: "100%",
    flex: 1,
    backgroundColor: props.backgroundApp,
  },
  container2: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    position: "absolute",
    top: isIphoneX ? 10 : 0,
    right: 20,
    zIndex: 99999,
    paddingTop: 50,
  },
  close: {
    marginTop: PADDING_V,
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    position: "absolute",
    width: 90,
    height: 80,
    bottom: 0,
    right: 10,
  },

  loadingWrapper: {
    flex: 1,
    backgroundColor: "red",
  },
  icon: {
    width: 30,
    height: 30,
  },

});
