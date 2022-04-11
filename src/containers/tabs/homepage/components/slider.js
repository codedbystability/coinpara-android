import React, { useCallback, useEffect, useState } from "react";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Text, View, StyleSheet } from "react-native";
import {
  NORMAL_FONTSIZE,
  PADDING_H,
  PADDING_V,
  SCREEN_WIDTH,
} from "../../../../../utils/dimensions";
import generalServices from "../../../../services/general-services";
import { useSelector } from "react-redux";
import NImage from "../../../../components/image/index.tsx";
import { useIsFocused } from "@react-navigation/native";
import Linking from "../../../../providers/Linking";
import PlLoading from "../../../pl-loading";


const HomepageSlider = (props) => {
  const { activeLanguage } = useSelector(state => state.languageReducer);
  const { activeTheme, fontSizes, language } = useSelector(state => state.globalReducer);

  const [data, setData] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();


  useEffect(() => {
    if (isFocused && activeLanguage && Object.keys(activeLanguage).length >= 1 && activeLanguage.Id) {
      getSliders();
    }
  }, [isFocused, activeLanguage]);

  const getSliders = () => {
    generalServices.getSliders(activeLanguage.Id).then((response) => {
      if (response && response.IsSuccess) {
        setData(response.Data);
      }
      setLoading(false);
    });
  };

  const handleOpenUrl = useCallback(async (url) => {
    await Linking.openURL(url);
  }, []);

  const _renderItem = ({ item, index }) => {
    return (
      <View style={styles(activeTheme).wrapper}>

        <View style={styles(activeTheme).linear}>

          <View style={styles(activeTheme).content}>
            <View style={{ width: "70%", paddingVertical: PADDING_V, justifyContent: "space-between" }}>
              <Text style={styles(activeTheme, fontSizes).text}>
                {item.Text1.replace(/<\/?[^>]+(>|$)/g, "")}
              </Text>

              <Text style={[styles(activeTheme, fontSizes).text, { fontSize: NORMAL_FONTSIZE }]}>
                {item.Text2.replace(/<\/?[^>]+(>|$)/g, "")}
              </Text>

              {/*<Pressable*/}
              {/*  onPress={() => handleOpenUrl(item.Button1Link)}*/}
              {/*  style={styles(activeTheme).buttonWrapper}>*/}
              {/*  <Text style={styles(activeTheme).buttonText}>*/}
              {/*    {item.Button1Title}*/}
              {/*  </Text>*/}
              {/*</Pressable>*/}
            </View>

            <View style={styles(activeTheme).imgWrapper}>

              {
                item.ImageLink ? <NImage
                  resizeMode={"contain"}
                  source={{ uri: item.ImageLink }}
                  style={styles(activeTheme).img}
                  useFastImage={true}
                /> : null
              }

            </View>

          </View>


        </View>

      </View>
    );
  };

  if (loading)
    return <PlLoading height={120} />;

  if (data.length <= 0)
    return null;


  const ww = SCREEN_WIDTH - (PADDING_H * 2);
  return (

      <View style={styles(activeTheme).container}>
        <Carousel
          containerCustomStyle={styles(activeTheme).carousel}
          // contentContainerCustomStyle={styles(activeTheme).car}
          removeClippedSubviews={false}
          enableMomentum={false}
          disableIntervalMomentum
          loop
          lockScrollWhileSnapping={false}
          data={data}
          renderItem={_renderItem}
          sliderWidth={ww}
          itemWidth={ww}
          onSnapToItem={(index) => setActiveSlide(index)}
        />

        {
          data.length >= 1 && <View style={styles(activeTheme).pagination}>
            <Pagination
              dotsLength={data.length}
              activeDotIndex={activeSlide}
              dotStyle={styles(activeTheme).dots}
              inactiveDotStyle={styles(activeTheme).inDor}
              inactiveDotOpacity={0.6}
              inactiveDotScale={0.6}
            />
          </View>

        }
      </View>
  );

};

export default React.memo(HomepageSlider);
const styles = (props, fontSizes) => StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    paddingHorizontal: PADDING_H,
  },
  wrapper: {
    borderRadius: 7,
  },
  linear: {
    width: "100%",
    height: 100,
    // paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    backgroundColor: "rgb(7,62,186)",
  },
  content: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    justifyContent: "space-around",
    overflow: "visible",
    paddingHorizontal: PADDING_H,
    flexDirection: "row",
  },
  text: {
    fontFamily: "CircularStd-Bold",
    fontSize: fontSizes?.BIG_TITLE_FONTSIZE,
    letterSpacing: -0.19,
    color: "#ffffff",
  },
  imText: {
    color: "rgb(2,123,238)",
    fontFamily: "CircularStd-Bold",
  },
  buttonWrapper: {
    paddingHorizontal: PADDING_H,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    width: "70%",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "CircularStd-Book",
    color: "#ffffff",
    fontSize: fontSizes?.NORMAL_FONTSIZE,
  },
  imgWrapper: {
    // position: "absolute",
    right: 0,
    // top: "-10%",
    borderRadius: 8,
    width: "30%",
    height: "100%",
    paddingVertical: PADDING_V,
  },
  dots: {
    width: 22,
    height: 8,
    // borderRadius: 4,
    padding: 0,
    margin: 0,
    backgroundColor: props.iconActive,
  },
  inDor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    padding: 0,
    margin: 0,
    backgroundColor: props.secondaryText,
  },
  pagination: {
    // backgroundColor:'red',
    // marginTop: 12,
    height: 8,
    width: 60,
    // alignItems: "center",
    justifyContent: "center",
  },
  img: {
    height: "100%",
    // shadowColor: props.borderGray,
    // shadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
    // shadowRadius: 1,
    // shadowOpacity: 1,
  },
  carousel: {
    overflow: "hidden",
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  car: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: PADDING_H,
  },
});
