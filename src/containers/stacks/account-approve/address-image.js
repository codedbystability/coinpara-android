import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import CustomButton from "../../../components/button";
import UploadedValidItem from "../../../components/uploaded-image";
import NImage from "../../../components/image/index.tsx";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import { PADDING_H, TITLE_FONTSIZE } from "../../../../utils/dimensions";
import { apiPostWithTokenAndImage } from "../../../services/fetch-instance";
import LocalStorage from "../../../providers/LocalStorage";
import DropdownAlert from "../../../providers/DropdownAlert";


const AddressImage = ({ image, language, handleShowAction, handleClearImage }) => {
  const { activeTheme } = useSelector(state => state.globalReducer);
  const [firstFetching, setFirstFetching] = useState(false);

  const getDynamicButtonContent = () => {

    if (firstFetching) {
      return <ActivityIndicator color={activeTheme.appWhite} />;
    }


    if (image) {

      if (firstFetching === null) {
        return <CustomButton onPress={() => handleButtonAction("address-image")}
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
        <CustomButton onPress={() => handleButtonAction("address-image")}
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
      <CustomButton onPress={() => handleButtonAction("address-image")}
                    isBorder={true} filled={true} isRadius={true}
                    text={getLang(language, "UPLOAD")}
      />
    );

  };

  const handleButtonAction = (key) => {

    if (firstFetching === null) {
      return null;
    }
    image ? handleUpload("user/UserAddressUpdate") : handleShowAction(key);
  };

  const handleUpload = (param) => {
    setFirstFetching(true);
    const formData = new FormData();
    formData.append("file", {
      uri: image.uri,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    apiPostWithTokenAndImage( "https://apiv2.coinpara.com/api/" + param, formData).then((response) => {


      if (!response || !response.IsSuccess) {
        setFirstFetching(false);
        return;
      }

      if (response.IsSuccess) {
        setFirstFetching(null);
        DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "UPLOADED_SUCCESSFULLY"));
      }
    });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles(activeTheme).scrollView}>
      <View>
        <Text style={styles(activeTheme).title}>{getLang(language, "ADDRESS_APPROVAL")}</Text>
        <Text style={styles(activeTheme).desc}>{getLang(language, "ADDRESS_APPROVAL_MESSAGE")}</Text>


        {
          image ?
            <UploadedValidItem
              imageKey={"address-image"}
              onClear={handleClearImage}
              uploadedImage={image} />

            : <NImage
              useFastImage={true}
              source={{
                uri: "https://images.coinpara.com/files/mobile-assets/address.jpg",
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
export default AddressImage;

const styles = props => StyleSheet.create({

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
    color: props.appWhite,
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
    height: 200,
    width: "100%",
    marginTop: 20,
  },
  buttonWrapper: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

