import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";

import CustomButton from "../../../components/page-components/button";
import UploadedValidItem from "../../../components/page-components/uploaded-image";
import { DIMENSIONS } from "../../../../utils/dimensions";
import NImage from "../../../components/page-components/image/index.tsx";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import { apiPostWithTokenAndImage } from "../../../services/fetch-instance";
import DropdownAlert from "../../../providers/DropdownAlert";

const items = [
  {
    id: 1,
    key: "identity-front",
    title: "GOVERNMENT_ID_APPROVAL_MESSAGE",
    image: "https://images.coinpara.com/files/mobile-assets/identity-front.png",
    imageTitle: "ID_FRONT",
    imageDesc: "",
  },
  {
    id: 2,
    key: "identity-back",
    image: "https://images.coinpara.com/files/mobile-assets/identity-back.png",
    imageTitle: "ID_BACK",
    imageDesc: "",
  },
];
const GovernmentIdStep = ({ handleShowAction, language, identityFrontImage, identityBackImage, handleClearImage }) => {

  const { activeTheme } = useSelector(state => state.globalReducer);
  const [firstFetching, setFirstFetching] = useState(false);
  const [secondFetching, setSecondFetching] = useState(false);

  const handleClearUploadedImage = (type) => handleClearImage(type);
  const getUploadContent = (item) => {

    if (item.key === "identity-front") {
      if (identityFrontImage) {
        return (
          <UploadedValidItem
            showCancel={firstFetching !== null}
            imageKey={item.key}
            onClear={handleClearUploadedImage}
            uploadedImage={identityFrontImage}
          />
        );
      } else {
        return (
          <NImage
            useFastImage={true}
            source={{ uri: item.image }} style={styles(activeTheme).image}
            resizeMode={"contain"}
          />
        );
      }
    } else if (item.key === "identity-back") {
      if (identityBackImage) {
        return (
          <UploadedValidItem
            showCancel={secondFetching !== null}
            imageKey={item.key}
            onClear={handleClearUploadedImage}
            uploadedImage={identityBackImage} />
        );
      } else {
        return (
          <NImage
            useFastImage={true}
            source={{ uri: item.image }}
            style={styles(activeTheme).image}
            resizeMode={"contain"}
          />
        );
      }
    }
  };

  const handleButtonAction = (key) => {
    if (key === "identity-front") {
      if (firstFetching === null) {
        return null;
      }
      return identityFrontImage ? handleUpload("user/UserIdCopyUpdate") : handleShowAction(key);
    } else if (key === "identity-back") {
      if (secondFetching === null) {
        return null;
      }
      return identityBackImage ? handleUpload("user/UserIdCopyBackUpdate") : handleShowAction(key);
    }

  };


  const handleUpload = (param) => {
    param === "user/UserIdCopyUpdate" ? setFirstFetching(true) : setSecondFetching(true);
    const formData = new FormData();
    formData.append("file", {
      uri: param === "user/UserIdCopyUpdate" ? identityFrontImage.uri : identityBackImage.uri,
      type: "image/jpeg",
      name: "photo.jpg",
    });


    apiPostWithTokenAndImage("https://apiv2.coinpara.com/api/" + param, formData).then((response) => {
      if (!response || !response.IsSuccess) {
        param === "user/UserIdCopyUpdate" ? setFirstFetching(false) : setSecondFetching(false);
        return;
      }
      param === "user/UserIdCopyUpdate" ? setFirstFetching(null) : setSecondFetching(null);
      DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "UPLOADED_SUCCESSFULLY"));
    });
  };


  const getDynamicButtonContent = (item) => {
    if (item.key === "identity-front") {
      if (firstFetching) {
        return <ActivityIndicator color={activeTheme.appWhite} />;
      }
      if (firstFetching === null) {
        return (
          <CustomButton onPress={() => handleButtonAction(item.key)}
                        isBorder={true} filled={true} isRadius={true}
                        text={getLang(language, "IMAGE_IS_UPLOADED")}
                        style={{
                          backgroundColor: activeTheme.backgroundApp,
                        }}
                        textStyles={{
                          color: activeTheme.changeGreen,
                        }}
          />
        );
      }
      if (identityFrontImage) {
        return (
          <CustomButton onPress={() => handleButtonAction(item.key)}
                        isBorder={true} filled={true} isRadius={true}
                        text={getLang(language, "UPLOAD_THE_IMAGE")}
                        style={{
                          backgroundColor: activeTheme.backgroundApp,
                        }}
          />
        );
      } else {
        return <CustomButton onPress={() => handleButtonAction(item.key)}
                             isBorder={true} filled={true} isRadius={true}
                             text={getLang(language, "UPLOAD")}
        />;
      }
    } else if (item.key === "identity-back") {
      if (secondFetching) {
        return <ActivityIndicator color={activeTheme.appWhite} />;
      }
      if (secondFetching === null) {
        return (
          <CustomButton onPress={() => handleButtonAction(item.key)}
                        isBorder={true} filled={true} isRadius={true}
                        text={getLang(language, "IMAGE_IS_UPLOADED")}
                        style={{
                          backgroundColor: activeTheme.backgroundApp,
                        }}
                        textStyles={{
                          color: activeTheme.changeGreen,
                        }}
          />
        );
      }
      if (identityBackImage) {
        return (
          <CustomButton onPress={() => handleButtonAction(item.key)}
                        isBorder={true} filled={true} isRadius={true}
                        text={getLang(language, "UPLOAD_THE_IMAGE")}
                        style={{
                          backgroundColor: activeTheme.backgroundApp,
                        }}
          />
        );
      } else {
        return <CustomButton onPress={() => handleButtonAction(item.key)}
                             isBorder={true} filled={true} isRadius={true}
                             text={getLang(language, "UPLOAD")}
        />;
      }

    }
  };


  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles(activeTheme).scrollView}>

      <Text style={styles(activeTheme).title}>{getLang(language, "GOVERNMENT_ID")}</Text>


      {
        items.map(item => {
          return (
            <View key={item.id}>
              {
                item.title && <Text style={styles(activeTheme).desc}>{getLang(language, item.title)}</Text>
              }

              {
                getUploadContent(item)
              }


              <Text style={styles(activeTheme).imageTitle}>{getLang(language, item.imageTitle)}</Text>

              {
                getDynamicButtonContent(item)
              }


              <Text style={styles(activeTheme).imageDesc}>{item.imageDesc}</Text>
              <Text style={styles(activeTheme).imageDesc}>{getLang(language, "UPLOAD_IMAGE_INFO")}</Text>


              {
                item.id === 1 && <View style={styles(activeTheme).line} />
              }
            </View>
          );
        })
      }


    </ScrollView>

  );
};

const styles = (props) => StyleSheet.create({

  scrollView: {
    paddingTop: DIMENSIONS.PADDING_H * 2,
    paddingHorizontal: DIMENSIONS.PADDING_H,
    // paddingBottom: 60,
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
    color: props.appWhite,
    fontFamily: "CircularStd-Book",
    textAlign: "center",
    marginVertical: 20,
    fontSize: DIMENSIONS.NORMAL_FONTSIZE,
  },
  imageDesc: {
    color: props.secondaryText,
    fontFamily: "CircularStd-Book",
    textAlign: "center",
    marginVertical: DIMENSIONS.MARGIN_T,
    fontSize: DIMENSIONS.NORMAL_FONTSIZE,
  },
  line: {
    height: 1,
    width: "100%",
    backgroundColor: props.appWhite,
  },
  image: {
    height: DIMENSIONS.BIG_IMAGE,
    width: "auto",
    marginTop: DIMENSIONS.MARGIN_T,
  },

});

export default GovernmentIdStep;
