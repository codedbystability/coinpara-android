import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator } from "react-native";
import CustomButton from "../../../components/button";
import UploadedValidItem from "../../../components/uploaded-image";
import NImage from "../../../components/image/index.tsx";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import { MARGIN_T, PADDING_H, TITLE_FONTSIZE } from "../../../../utils/dimensions";
import { apiPostWithTokenAndImage } from "../../../services/fetch-instance";
import DropdownAlert from "../../../providers/DropdownAlert";


const SelfieImage = ({ handleShowAction, image, language, handleClearImage }) => {

  const { activeTheme } = useSelector(state => state.globalReducer);
  const [firstFetching, setFirstFetching] = useState(false);
  const getDynamicButtonContent = () => {

    if (firstFetching) {
      return <ActivityIndicator color={activeTheme.appWhite} />;
    }


    if (image) {

      if (firstFetching === null) {
        return <CustomButton onPress={() => handleButtonAction("selfie-image")}
                             isBorder={true} filled={true} isRadius={true}
                             text={getLang(language, "IMAGE_IS_UPLOADED")}
                             style={{
                               backgroundColor: activeTheme.backgroundApp,
                             }}
                             textStyles={{
                               color: activeTheme.changeGreen,
                             }}
        />;
      }

      return (
        <CustomButton onPress={() => handleButtonAction("selfie-image")}
                      isBorder={true} filled={true} isRadius={true}
                      text={getLang(language, "UPLOAD_THE_IMAGE")}
                      style={{
                        backgroundColor: activeTheme.backgroundApp,
                      }}
                      textStyles={{
                        color: activeTheme.changeGreen,
                      }}
        />
      );

    }


    return (
      <CustomButton onPress={() => handleButtonAction("selfie-image")}
                    isBorder={true} filled={true} isRadius={true}
                    text={getLang(language, "UPLOAD")}
      />
    );

  };

  const handleButtonAction = (key) => {

    if (firstFetching === null) {
      return null;
    }
    image ? handleUpload("user/UserSelfyUpdate") : handleShowAction(key);
  };

  const handleUpload = (param) => {
    setFirstFetching(true);
    const formData = new FormData();
    formData.append("file", {
      uri: image.uri,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    apiPostWithTokenAndImage("https://apiv2.coinpara.com/api/" + param, formData).then((response) => {
      if (!response || !response.IsSuccess) {
        setFirstFetching(false);
        return;
      }
      setFirstFetching(null);
      DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "UPLOADED_SUCCESSFULLY"));
    });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}
                contentContainerStyle={styles(activeTheme).scrollView}>


      <View>
        <Text style={styles(activeTheme).title}>{getLang(language, "SELFIE_WITH_SIGNATURE")}</Text>
        <Text style={styles(activeTheme).desc}>{getLang(language, "SELFIE_WITH_SIGNATURE_MESSAGE")}</Text>

        {
          image ?
            <UploadedValidItem uploadedImage={image}
                               showCancel={firstFetching !== null}
                               imageKey={"selfie-image"}
                               onClear={handleClearImage}
            />

            : <NImage
              useFastImage={true}
              source={{
                uri: "https://images.coinpara.com/files/mobile-assets/selfie-image.png",
              }} style={styles(activeTheme).image}
              resizeMode={"contain"}
            />
        }


        <Text style={styles(activeTheme).imageTitle}>{}</Text>

        {
          getDynamicButtonContent()
        }

        <Text style={styles(activeTheme).imageDesc}>{getLang(language, "UPLOAD_IMAGE_INFO")}</Text>

        <View style={styles(activeTheme).line} />
      </View>


    </ScrollView>
  );
};

const styles = (props) => StyleSheet.create({
  scrollView: {
    paddingTop: PADDING_H * 2,
    paddingHorizontal: PADDING_H,
  },

  title: {
    color: props.appWhite,
    fontFamily: "CircularStd-Bold",
    textAlign: "center",
    fontSize: TITLE_FONTSIZE,
  },
  desc: {
    marginVertical: PADDING_H,
    color: props.secondaryText,
    fontFamily: "CircularStd-Book",
    textAlign: "center",
    fontSize: TITLE_FONTSIZE,
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
    marginTop: MARGIN_T,
  },
  buttonWrapper: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

export default SelfieImage;
