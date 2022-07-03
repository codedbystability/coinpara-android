import React from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import CustomButton from "../../../components/page-components/button";
import NImage from "../../../components/page-components/image/index.tsx";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import { DIMENSIONS } from "../../../../utils/dimensions";
import moment from "moment";
import TinyImage from "../../../tiny-image";


const SelfieVideo = ({ image, handleShowAction, language, handleClearImage }) => {
  const { activeTheme } = useSelector(state => state.globalReducer);

  return (

    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles(activeTheme).scrollView}>
      <View>
        <Text style={styles(activeTheme).title}>{getLang(language, "VIDEO_SELFIE")}</Text>

        <Text style={styles(activeTheme).desc}>{getLang(language, "VIDEO_SELFIE_MESSAGE")}</Text>

        {
          image ?
            <View style={styles(activeTheme).wrap}>

              <NImage
                useFastImage={true}
                source={{
                  uri: "https://images.coinpara.com/files/mobile-assets/fulled-video.png",
                }} style={styles(activeTheme).image}
                resizeMode={"contain"}
              />

              <Pressable
                onPress={() => handleClearImage("selfie-video")}
                activeOpacity={1}
                style={styles(activeTheme).prs}>
                <TinyImage parent={'rest/'} name={'cancel'} style={styles(activeTheme).icon}/>
              </Pressable>
            </View>

            : <NImage
              useFastImage={true}
              source={{
                uri: "https://images.coinpara.com/files/mobile-assets/selfie-image.png",
              }} style={styles(activeTheme).image}
              resizeMode={"contain"}
            />

        }
        <Text
          style={[styles(activeTheme).title, { marginVertical: 10 }]}>{getLang(language, "YOU_NEED_TO_RECORD_VIDEO").replace(/DATE/g, moment().format("DD-MM-yyyy"))}</Text>


        <CustomButton onPress={() => handleShowAction("selfie-video")}
                      isBorder={true} filled={true} isRadius={true}
                      text={getLang(language, "UPLOAD")} />

        <Text style={styles(activeTheme).imageDesc}>{getLang(language, "UPLOAD_IMAGE_INFO")}</Text>

        <View style={styles(activeTheme).line} />
      </View>


    </ScrollView>

  );
};

const styles = props => StyleSheet.create({
  scrollView: {
    paddingTop: DIMENSIONS.PADDING_H * 2,
    paddingHorizontal: DIMENSIONS.PADDING_H,
  },

  title: {
    color: props.appWhite,
    fontFamily: "CircularStd-Bold",
    textAlign: "center",
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
  },
  desc: {
    marginVertical: DIMENSIONS.PADDING_H,
    color: props.secondaryText,
    fontFamily: "CircularStd-Book",
    textAlign: "center",
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
  },
  imageTitle: {
    color: "rgb(255,255,255)",
    fontFamily: "CircularStd-Book",
    textAlign: "center",
    marginVertical: 20,
    fontSize: 12,
  },
  imageDesc: {
    color: props.secondaryText,
    fontFamily: "CircularStd-Book",
    textAlign: "center",
    marginVertical: 20,
    fontSize: 12,
  },
  line: {
    height: 1,
    width: "100%",
    backgroundColor: "rgba(255,255,255,.1)",
  },
  image: {
    height: 220,
    marginLeft: 12,
    width: "100%",
    marginTop: DIMENSIONS.MARGIN_T,
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  vid: {
    width: 260,
    height: 200,
  },
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 12,
  },
  prs: {
    position: "absolute",
    // right: 20,
    top: 5,
    left: DIMENSIONS.SCREEN_WIDTH / 2 - 60 + 100,
  },
  icon:{
    width:18,
    height:18,
  }
});

export default SelfieVideo;
