import React, { Fragment, useEffect, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { Alert, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import CustomButton from "../../../components/button";
import ApproveModal from "./approve-modal";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { useSelector } from "react-redux";
import userServices from "../../../services/user-services";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import {
  BIG_LIST_MARGIN_T,
  BIG_TITLE_FONTSIZE,
  NORMAL_FONTSIZE,
  PADDING_BH,
  PADDING_BV,
  PADDING_H,
  TITLE_FONTSIZE,
} from "../../../../utils/dimensions";
import { getLang } from "../../../helpers/array-helper";

import ActionSheetComProvider from "../../../providers/ActionSheetComProvider";
import { items, options, optionsVideo } from "./constants";
import { isIphoneX } from "../../../../utils/devices";
import ActionSheetComp from "../../../components/shell-components/ActionSheet/ActionSheetComp";
import TinyImage from "../../../tiny-image";
import { navigationRef } from "../../../providers/RootNavigation";
import NImage from "../../../components/image/index.tsx";
import FloatingAction from "../../../components/floating-action";

const AccountApprove = (props) => {

  const { activeTheme, activeThemeKey, language } = useSelector(state => state.globalReducer);

  const [userApproval, setUserApproval] = useState({});
  const [isAdminApproved, setIsAdminApproved] = useState(true);
  const [fields, setFields] = useState(items);
  const [identityFrontImage, setIdentityFrontImage] = useState(null);
  const [identityBackImage, setIdentityBackImage] = useState(null);
  const [addressImage, setAddressImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [selfieVideo, setSelfieVideo] = useState(null);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [type, setType] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // useEffect(() => {
  //   userServices.getApproval().then((response) => {
  //     if (response.IsSuccess) {
  //       setFields(items.map(item => {
  //         item["isApproved"] = response.Data[item.approveField] === true;
  //         item["isLoaded"] = response.Data[item.isUploaded] === true;
  //         return item;
  //       }));
  //       setUserApproval(response.Data);
  //       setIsAdminApproved(response.Data.AdminApproval === true);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (type && type !== "") {
      setApproveModalVisible(true);
    } else {
      setApproveModalVisible(false);
    }
  }, [type]);

  useEffect(() => {
    if (selectedType) {
      ActionSheetComProvider.show({
        title: "-",
        options: [getLang(language, "USE_CAMERA"), getLang(language, "CHOOSE_FROM_GALLERY"), getLang(language, "CANCEL")],
        onAction: (index) => handleAction(index),
      });
    }
  }, [selectedType]);

  useEffect(() => {
    if (!approveModalVisible) {
      userServices.getApproval().then((response) => {
        if (response.IsSuccess) {
          setFields(items.map(item => {
            item["isApproved"] = response.Data[item.approveField] === true;
            item["isLoaded"] = response.Data[item.isUploaded] === true;
            return item;
          }));
          setUserApproval(response.Data);
          setIsAdminApproved(response.Data.AdminApproval === true);
        }
      });
    }
  }, [approveModalVisible]);

  const handleUploadStep = (item) => setType(item.key);

  const handleAction = (value) => {
    // value === 0 camera || value === 1 gallery
    if (value === 1) {
      selectImage();
    } else if (value === 0) {
      requestCameraPermission().then(r => null);
    }
  };

  const setSelectedTypeOfUSer = (key) => {
    if (key === selectedType) {
      ActionSheetComProvider.show({
        title: "-",
        options: [getLang(language, "USE_CAMERA"), getLang(language, "CHOOSE_FROM_GALLERY"), getLang(language, "CANCEL")],
        onAction: (index) => handleAction(index),
      });
    } else {
      setSelectedType(key);
    }
  };

  const handleStep = (step, theWay) => {

    let test;
    if (theWay === "prev") {
      const rest = step - 1;
      if (!fields[rest - 1].isApproved || !fields[rest - 1].isLoaded) {
        test = rest - 1;
      } else if (rest - 2 > 0 && fields[rest - 2] && (!fields[rest - 2].isApproved || !fields[rest - 2].isLoaded)) {
        test = rest - 2 - 1;
      } else if (rest - 3 > 0 && fields[rest - 3] && (!fields[rest - 3].isApproved || !fields[rest - 3].isLoaded)) {
        test = rest - 2 - 1;
      } else {

        test = null;
      }
    } else {
      if (step === 3) {
        test = null;
      } else {
        test = fields.filter(item => !item.isApproved && !item.isLoaded && item.id > step);
        if (test.length >= 1) {
          test = test[0].id - 1;
        }
      }

      if (test === -1) {
        test = null;
      }
    }


    setType(test !== null && test in fields ? fields[test].key : "");
  };

  // const fetchImage = (imageToUpload, param, isVideo) => {
  //   const formData = new FormData();
  //   formData.append("file", {
  //     uri: imageToUpload.uri,
  //     type: isVideo ? "video/mp4" : "image/jpeg",
  //     name: isVideo ? "video.mp4" : "photo.jpg",
  //   });
  //
  //
  //   apiPostWithTokenAndImage(LocalStorage.getItem("API_URL") + param, formData).then((response) => {
  //     console.log("formData - ", formData);
  //     console.log("API_URL - ", LocalStorage.getItem("API_URL"));
  //     if (response.IsSuccess) {
  //       DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "UPLOADED_SUCCESSFULLY"));
  //     }
  //   });
  // };

  const getStep = () => {
    if (!type) return 1;
    return items.filter(item => !item.isApproved && !item.isLoaded)
      .findIndex(item => item.key === type) + 1;
  };

  const requestCameraPermission = async () => {
    try {
      check(PERMISSIONS.ANDROID.CAMERA)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              // showSettingsAlert();
              break;
            case RESULTS.DENIED:
              request(PERMISSIONS.ANDROID.CAMERA, response => {
                takePicture();
              });
              break;
            case RESULTS.LIMITED:
              takePicture();
              break;
            case RESULTS.GRANTED:
              takePicture();
              break;
            case RESULTS.BLOCKED:
              showSettingsAlert();
              break;
          }
        })
        .catch((error) => {
          // …
        });

    } catch (err) {
      console.warn(err);
    }
  };

  const showSettingsAlert = () => {
    return (
      Alert.alert(
        getLang(language, "INFORMATION"),
        getLang(language, "LET_CAMERA_PERMISSION_FROM_SETTINGS"),
        [
          {
            text: getLang(language, "CANCEL"),
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: getLang(language, "OPEN_SETTINGS"), onPress: () => Linking.openSettings() },
        ],
      )
    );
  };

  const takePicture = () => {
    // if (type === "selfie-video") {
    //   return ModalProvider.show(<CameraModalize
    //     onHide={() => ModalProvider.hide()}
    //     onRecordVideo={onRecordVideo} />);
    // }
    launchCamera(type === "selfie-video" ? optionsVideo : options, response => {
      if (!response.didCancel && !response.error && !response.customButton) {
        if (response && response.assets.length >= 1) {

          const asset = response.assets[0];
          let source = {
            uri: asset.uri,
            width: asset.width,
            height: asset.height,
            size: asset.fileSize,
          };


          setRelatedUpload(source);
        }
      }
    });
  };

  function selectImage() {
    launchImageLibrary(options, response => {

      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        const asset = response.assets[0];
        let source = {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          size: asset.fileSize,
        };
        setRelatedUpload(source);
      }
    });
  }

  const setRelatedUpload = (source) => {
    if (selectedType === "identity-front") {
      setIdentityFrontImage(source);
    } else if (selectedType === "identity-back") {
      setIdentityBackImage(source);
    } else if (selectedType === "address-image") {
      setAddressImage(source);
    } else if (selectedType === "selfie-image") {
      setSelfieImage(source);
    }
  };

  const handleClearImage = (type) => {
    if (type === "identity-front") {
      setIdentityFrontImage(null);
    } else if (type === "identity-back") {
      setIdentityBackImage(null);
    } else if (type === "address-image") {
      setAddressImage(null);
    } else if (type === "selfie-image") {
      setSelfieImage(null);
    } else if (type === "selfie-video") {
      setSelfieVideo(null);
    }
  };


  const approvedField = item => {
    return (
      <View
        style={[styles(activeTheme).activeListItem, styles(activeTheme).shadow]} key={item.id}>
        <View style={{
          width: "90%",
        }}>
          <Text style={[styles(activeTheme).title, { color: "#fff" }]}>{getLang(language, item.title)}</Text>
          {/*<Text style={styles(activeTheme).description}>{getLang(language, item.desc)}</Text>*/}
        </View>

        <View style={{
          width: "10%",
          alignItems: "center",
        }}>
          <TinyImage parent={"rest/"} name={"success"} style={styles(activeTheme).icon2} />
        </View>
      </View>
    );
  };

  const adminWaiting = item => {
    return (
      <View
        style={[styles(activeTheme).activeListItem, {}]} key={item.id}>
        <View style={{
          width: "90%",
        }}>
          <Text style={[styles(activeTheme).title, { color: "#fff" }]}>{getLang(language, item.title)}</Text>

          <Text style={styles(activeTheme).warnText}>{getLang(language, "APPROVE_WAITING")}</Text>
        </View>


        <TinyImage parent={"rest/"} name={item.icon} style={styles(activeTheme).icon3} />
      </View>
    );
  };

  const waitingField = item => {
    return (
      <Pressable
        onPress={() => handleUploadStep(item)}
        style={[styles(activeTheme).listItem, styles(activeTheme).shadow]} key={item.id}>

        {
          userApproval[item.noteField] && <View style={styles(activeTheme).warnCircle} />
        }


        <View style={{ width: "80%" }}>
          <Text style={styles(activeTheme).title}>{getLang(language, item.title)}</Text>

          {
            userApproval[item.noteField] ?
              <Text style={styles(activeTheme).warnText}>{userApproval[item.noteField]}</Text> :
              <Text style={[styles(activeTheme).warnText, {
                color: activeTheme.secondaryText,
              }]}>{getLang(language, item.defaultNote)}</Text>

          }
        </View>

        <TinyImage parent={"rest/"} name={item.icon} style={styles(activeTheme).icon3} />

      </Pressable>
    );
  };

  // const onRecordVideo = (source) => {
  //   ModalProvider.hide();
  //   const param = "api/user/UserVideoSelfy";
  //   const isVideo = true;
  //
  //   setTimeout(() => fetchImage(source, param, isVideo), 500);
  // };

  const modalProps = {
    identityFrontImage,
    identityBackImage,
    addressImage,
    selfieImage,
    selfieVideo,

  };

  if (!userApproval || Object.keys(userApproval).length <= 0) {
    return null;
  }

  return (
    <>
      <Fragment>

        <TabNavigationHeader{...props} backAble={true}
                            options={{ title: getLang(language, "ACCOUNT_VERIFICATION") }}
        />

        {
          isAdminApproved ? <View
            style={styles(activeTheme).active}>

            <NImage
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
              }}
              source={{
                uri: "https://images.coinpara.com/files/mobile-assets/" + activeThemeKey + "/rest/approved-bg.png",
              }} useFastImage={true} resizeMode={"cover"} />

            <View style={{
              flex: 1, alignItems: "center",
              justifyContent: "center",
            }}>
              <Text style={[styles(activeTheme).title, { marginTop: 50 }]}>
                {getLang(language, "YOUR_ACCOUNT_IS_APPROVED")}
              </Text>


              <Text style={[styles(activeTheme).desc, { marginTop: 50 }]}>
                {getLang(language, "YOUR_ACCOUNT_IS_APPROVED_DESC")}
              </Text>
            </View>

          </View> : <ScrollView contentContainerStyle={styles(activeTheme).wrapper}>

            <View style={styles(activeTheme).contentWrapper}>

              <>

                <Text style={[styles(activeTheme).desc]}>
                  {getLang(language, "COMPLETE_FOLLOWINGS_FOR_WITHDRAW")}
                </Text>
                <ScrollView
                  contentContainerStyle={styles(activeTheme).scrollView}
                  showsVerticalScrollIndicator={false}>
                  {
                    items.map(item => userApproval[item.approveField] === true ? approvedField(item) : userApproval[item.approveField] === false && userApproval[item.isUploaded] === true ? adminWaiting(item) : waitingField(item))
                  }
                </ScrollView>
              </>

            </View>

          </ScrollView>
        }


        {
          !isAdminApproved && <CustomButton text={getLang(language, "START")}
                                            filled={true}
                                            style={{ backgroundColor: activeTheme.actionColor }}
                                            onPress={() => {
                                              const myStep = fields.filter(item => !item.isApproved && !item.isLoaded);
                                              if (myStep.length >= 1) {
                                                setType(myStep[0].key);
                                              }
                                            }} />
        }


      </Fragment>


      <Modal
        statusBarTranslucent
        hideModalContentWhileAnimating={true}
        useNativeDriver={true}
        animationType={"slide"}
        presentationStyle={"overFullScreen"}
        transparent={false}
        visible={approveModalVisible}
        onRequestClose={setApproveModalVisible}

      >

        <View style={{ flex: 1 }}>

          <ApproveModal
            type={type}
            step={getStep()}
            total={fields.filter(item => item.isApproved === false && item.isLoaded === false).length}
            handleShowAction={setSelectedTypeOfUSer}
            handleStep={handleStep}
            handleClearImage={handleClearImage}
            handleHide={() => setType("")}
            onHide={() => setType("")}
            {...modalProps}
          />

          <ActionSheetComp />

        </View>

      </Modal>

      <FloatingAction />

    </>
  );
};

const AccountApproveScreen = styledHigherOrderComponents(AccountApprove);
export default AccountApproveScreen;


const styles = (props) => StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingBottom: 80,
  },
  contentWrapper: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: PADDING_BH,
    justifyContent: "space-between",
    // backgroundColor: "red",
  },
  active: {
    flex: 1,

    // marginTop:100,
    width: "100%",
    height: "100%",
    // flex: 1
  },
  desc: {
    fontSize: TITLE_FONTSIZE,
    color: props.appWhite,
    textAlign: "center",
    fontFamily: "CircularStd-Book",
    marginTop: 8,
    paddingHorizontal: "5%",

  },
  listItem: {
    flexDirection: "row",
    // backgroundColr:'red',
    // minHeight: 80,
    paddingVertical: PADDING_BV,
    paddingHorizontal: PADDING_BH,
    borderRadius: 10,
    backgroundColor: props.darkBackground,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: isIphoneX ? BIG_LIST_MARGIN_T * 1.6 : BIG_LIST_MARGIN_T,

  },
  warnCircle: {
    position: "absolute",
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: props.noRed,
    right: 0,
    top: 0,
  },
  activeListItem: {
    minHeight: 80,
    paddingVertical: PADDING_BV,
    paddingHorizontal: PADDING_BH,
    borderRadius: 10,
    backgroundColor: props.actionColor,
    alignItems: "center",
    // justifyContent: "space-around",
    flexDirection: "row",
    marginTop: BIG_LIST_MARGIN_T,


  },
  buttonWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  title: {
    fontFamily: "CircularStd-Bold",
    fontSize: BIG_TITLE_FONTSIZE,
    color: props.appWhite,
  },
  warnText: {
    fontFamily: "CircularStd-Bold",
    fontSize: NORMAL_FONTSIZE,
    color: props.noRed,
    marginTop: PADDING_H,
  },
  description: {
    fontFamily: "CircularStd-Book",
    fontSize: TITLE_FONTSIZE,
    color: props.secondaryText,
    width: "90%",
  },
  scrollView: {
    flex: 1,
    justifyContent: "center",
  },
  shadow: {},
  icon: {
    width: 28,
    height: 28,
  },
  icon2: {
    width: 18,
    height: 18,
  },
  icon3: {
    width: 28,
    height: 24,
  },
});
