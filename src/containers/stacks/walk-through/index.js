import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";

import Carousel, { Pagination } from "react-native-snap-carousel";
import { itemWidth, sliderWidth } from "./SliderEntry.style";
import { BIG_TITLE_FONTSIZE, PADDING_H, PADDING_V, SCREEN_HEIGHT, TITLE_FONTSIZE } from "../../../../utils/dimensions";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import { navigationRef } from "../../../providers/RootNavigation";
import LocalStorage from "../../../providers/LocalStorage";
import Checkbox from "../../../components/checkbox";
import { isIphoneX } from "../../../../utils/devices";

export const ENTRIES1 = [

  {
    id: 1,
    title: "WALK_THROUGH_T1",
    subtitle: "WALK_THROUGH_D1",
  },
  {
    id: 2,
    title: "WALK_THROUGH_T2",
    subtitle: "WALK_THROUGH_D2",
  },

  {
    id: 3,
    title: "WALK_THROUGH_T3",
    subtitle: "WALK_THROUGH_D3",
  },

];

const WalkThrough2 = () => {

  const carRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const { language } = useSelector(state => state.globalReducer);
  const { activeLanguage } = useSelector(state => state.languageReducer);


  const _renderItem = ({ item, index }) => {
    return (
      <View key={index} style={styles.slideInnerContainer}>
        <Text style={styles.title2}>{getLang(language, item.title)}</Text>

        <Text style={styles.subtitle}>{getLang(language, item.subtitle)}</Text>

        <View style={[[styles.imageContainer, { height: SCREEN_HEIGHT * .5 }]]}>
          <Image
            useFastImage={false}
            source={{ uri: "https://images.coinpara.com/files/mobile-slider/" + activeLanguage.Slug + "/" + item.id + ".png" }}
            resizeMode={"contain"}
            style={{
              ...StyleSheet.absoluteFillObject,
              // height: SCREEN_HEIGHT * .5,
              // width: "100%",
            }}
          />
        </View>
      </View>
    );
  };

  useEffect(() => {
    LocalStorage.setItem("walkThroughSeen", "true");
  }, []);


  useEffect(() => {
    carRef.current?.snapToItem(activeSlide);
  }, [activeSlide]);

  const handleNext = () => {

    if (activeSlide === ENTRIES1.length - 1) {
      return navigationRef.current.navigate("Tab");
    }

    setActiveSlide(activeSlide < ENTRIES1.length ? activeSlide + 1 : ENTRIES1.length - 1);
  };
  const handlePrev = () => setActiveSlide(activeSlide >= 1 ? activeSlide - 1 : 0);

  const handleSkip = () => navigationRef.current.navigate("Tab");
  const customExample = () => {

    // Do not render examples on Android; because of the zIndex bug, they won't work as is
    return (
      <View style={[styles.exampleContainer]}>

        <Carousel
          ref={carRef}
          data={ENTRIES1}
          renderItem={_renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          contentContainerCustomStyle={styles.sliderContentContainer}
          onSnapToItem={(index) => setActiveSlide(index)}
          activeAnimationType="decay"
          loop={false}
          autoplay={false}>

        </Carousel>

        {
          ENTRIES1.length >= 1 && <View style={styles.pagination}>
            <Pagination
              dotsLength={ENTRIES1.length}
              activeDotIndex={activeSlide}
              dotStyle={styles.dots}
              inactiveDotStyle={styles.inDor}
              inactiveDotOpacity={0.6}
              inactiveDotScale={0.6}
            />
          </View>
        }
      </View>
    );
  };

  if (Object.keys(activeLanguage).length <= 0)
    return null;

  return (
    <View style={styles.safeArea}>
      <ImageBackground
        source={{
          uri: "https://images.coinpara.com/files/mobile-slider/classic-bg1.jpg",
        }}
        style={styles.container}>

        {
          activeSlide !== 2 &&    <Pressable onPress={handleSkip}
                                             style={styles.dismiss}>
            <Text style={styles.disText}>{getLang(language, "SKIP")}</Text>
          </Pressable>
        }



        <View style={styles.dismiss2}>
          <Checkbox />
        </View>


        <View style={{ flex: .9 }}>

          {
            customExample()
          }
        </View>

        <View style={styles.nextCon}>

          <Pressable onPress={handlePrev} style={styles.w1}>
            {
              activeSlide > 0 && <Text style={styles.next}>{getLang(language, "BACK")}</Text>
            }
          </Pressable>


          <Pressable onPress={handleNext} style={styles.w2}>
            <Text
              style={styles.next}>{getLang(language, activeSlide === ENTRIES1.length - 1 ? "FINISH" : "NEXT")}</Text>
          </Pressable>


        </View>

      </ImageBackground>
    </View>
  );

};

const WalkThrough = styledHigherOrderComponents(WalkThrough2);
export default WalkThrough;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },

  exampleContainer: {
    paddingBottom: isIphoneX ? 24 : 8,
    paddingTop: "16%",
    alignItems: "center",
    paddingHorizontal: PADDING_H,
  },
  title2: {
    fontFamily: "CircularStd-Bold",
    fontSize: 20,
    textAlign: "center",
    paddingHorizontal: "6%",
    color: "rgb(255,255,255)",
    marginBottom: "5%",
    // width: '40%',
  },
  subtitle: {
    marginVertical: "12%",
    fontFamily: "CircularStd-Book",
    fontSize: TITLE_FONTSIZE + 1,
    textAlign: "center",
    color: "#fff",
    // marginBottom: PADDING_H * 4,
  },
  dismiss: {
    position: "absolute",
    top: 20,
    right: 0,
    padding: 16,
    zIndex: 999999,
  },
  dismiss2: {
    position: "absolute",
    top: 20,
    left: 0,
    padding: 16,
    zIndex: 999999,
  },
  disText: {
    fontFamily: "CircularStd-Bold",
    fontSize: BIG_TITLE_FONTSIZE,
    color: "#bdbdbd",
  },
  exampleContainerLight: {
    backgroundColor: "white",
  },
  title: {
    paddingHorizontal: 30,
    backgroundColor: "transparent",
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  slider: {},
  sliderContentContainer: {
    paddingVertical: 10, // for custom animation
  },
  paginationContainer: {
    paddingVertical: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
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
    backgroundColor: "rgb(0,123,238)",

  },
  inDor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    padding: 0,
    margin: 0,
    backgroundColor: "rgb(78,92,102)",
  },
  next: {
    fontFamily: "CircularStd-Bold",
    fontSize: BIG_TITLE_FONTSIZE + 2,
    color: "#fff",
  },
  nextCon: {
    flex: .1,
    width: "100%",
    height: "100%",
    alignItems: "flex-end",
    // justifyContent: "flex",
    flexDirection: "row",
    paddingBottom: 24,
    paddingHorizontal: PADDING_H * 2,
  },
  w1: {
    width: "50%",
  },
  w2: {
    width: "50%",
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
});
