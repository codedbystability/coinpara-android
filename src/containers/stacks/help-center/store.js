import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList, Image,
  KeyboardAvoidingView, Linking,
  Pressable, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import {
  INPUT_HEIGHT,
  MARGIN_T, NORMAL_FONTSIZE,
  PADDING_H, SCREEN_WIDTH,
  TITLE_FONTSIZE,
} from "../../../../utils/dimensions";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import TinyImage from "../../../tiny-image";
import SelectInput from "../../../components/select-input";
import generalServices from "../../../services/general-services";
import FormInput from "../../../components/form-input";
import CustomButton from "../../../components/button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ActionSheetComProvider from "../../../providers/ActionSheetComProvider";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { options } from "../account-approve/constants";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import DropdownAlert from "../../../providers/DropdownAlert";
import { apiPostWithTokenAndImage } from "../../../services/fetch-instance";
import Loading from "../../../providers/Loading";
import FloatingAction from "../../../components/floating-action";
import { navigationRef } from "../../../providers/RootNavigation";
import { useRoute } from "@react-navigation/native";


const StoreHelpRequest = props => {

  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const { activeLanguage } = useSelector(state => state.languageReducer);
  const route = useRoute();

  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeDepartment, setActiveDepartment] = useState("");
  const [activePriority, setActivePriority] = useState("");
  const [catOptions, setCatOptions] = useState([]);
  const [depOptions, setDepOptions] = useState([]);
  const [priorityOptions, setPriorityOptions] = useState([]);

  useEffect(() => {
    if (activeLanguage && activeLanguage.Id) {
      getCategories();
      getDepartments();
      getPriorities();
    }
  }, [activeLanguage]);

  const getCategories = () => {
    generalServices.getSupportCategories(activeLanguage.Id).then((response) => {
      if (response && response.IsSuccess) {
        // setCatOptions(response.Data.map(itm => itm.Name));
        setCatOptions(response.Data);
      }
    });
  };

  const getDepartments = () => {
    generalServices.getSupportDepartments(activeLanguage.Id).then((response) => {
      if (response && response.IsSuccess) {
        // setDepOptions(response.Data.map(itm => itm.Title));
        setDepOptions(response.Data);
      }
    });
  };

  const getPriorities = () => {
    generalServices.getSupportPriorities(activeLanguage.Id).then((response) => {
      if (response && response.IsSuccess) {
        // setPriorityOptions(response.Data.map(itm => itm.Name));
        setPriorityOptions(response.Data);
      }
    });
  };

  const handleAction = (index) => {
    if (index > 1) {
      return false;
    }

    if (index === 1) {
      selectImage();
    } else if (index === 0) {
      requestCameraPermission().then(r => null);
    }

  };
  const takePicture = () => {
    // if (type === "selfie-video") {
    //   return ModalProvider.show(<CameraModalize
    //     onHide={() => ModalProvider.hide()}
    //     onRecordVideo={onRecordVideo} />);
    // }
    launchCamera(options, response => {
      if (!response.didCancel && !response.error && !response.customButton) {
        if (response && response.assets && response.assets.length >= 1) {
          const asset = response.assets[0];
          let source = {
            uri: asset.uri,
            width: asset.width,
            height: asset.height,
            size: asset.fileSize,

          };

          setImages([...images, source]);

          // setRelatedUpload(source);
        }
      }
    });
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

        setImages([...images, source]);
      }
    });
  }

  const askUpload = () => {
    ActionSheetComProvider.show({
      title: "-",
      options: [getLang(language, "USE_CAMERA"), getLang(language, "CHOOSE_FROM_GALLERY"), getLang(language, "CANCEL")],
      onAction: (index) => handleAction(index),
    });
  };

  const onSelect = (item, key) => {
    switch (key) {
      case "cat":
        return setActiveCategory(catOptions.find(itm => itm.Name === item));

      case "dep":
        return setActiveDepartment(depOptions.find(itm => itm.Title === item));

      case "priority":
        return setActivePriority(priorityOptions.find(itm => itm.Name === item));
    }
  };

  const handleStore = () => {

    if (
      !activeCategory || !activeCategory.Id ||
      !activeDepartment || !activeDepartment.Id ||
      !activePriority || !activePriority.Id
    ) {
      return DropdownAlert.show("info", getLang(language, "ERROR"), getLang(language, "PLEASE_FILL_ALL_BLANKS"));
    }

    if (images.length <= 0) {
      return storeInstance([]);
    }

    const validatedA = [];
    Loading.show();
    images.map((image, i) => {
      const formData = new FormData();
      formData.append("file", {
        uri: image.uri,
        type: "image/jpeg",
        name: "photo.jpg",
      });
      apiPostWithTokenAndImage("https://apiv2.coinpara.com/api/HelpDesk/attachments", formData).then((response) => {
        if (response && response.IsSuccess) {
          validatedA.push(response);
        }

        if (i === images.length - 1) {
          storeInstance(validatedA);
        }
      });
    });

  };


  const storeInstance = img => {
    const instance = {
      HelpCategoryId: activeCategory.Id,
      HelpDepartment: activeDepartment.Id,
      HelpPriority: activePriority.Id,
      HelpMessage: message,
      HelpTitle: title,
      HelpAttachment: img,
    };

    generalServices.createHelpRequest(instance).then(res => {
      if (res && res.IsSuccess) {
        setTitle("");
        setMessage("");
        setActiveDepartment("");
        setActivePriority("");
        setActiveCategory("");
        setImages([]);

        DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "SUPPORT_REQUEST_CREATED"));

        navigationRef.current.goBack()
        route.params?.getSupportRequests();
      }
    });
  };


  return (
    <>
      <TabNavigationHeader
        {...props}
        backAble={true}
        isBack={true}
        options={{ title: getLang(language, "SUPPORT_REQUEST_FORM") }}
      />


      {/*<KeyboardAvoidingView*/}

      {/*  behavior={"padding"}*/}
      {/*  style={{*/}
      {/*    flex: 1, paddingTop: MARGIN_T * 2, paddingHorizontal: PADDING_H,*/}
      {/*    backgroundColor: "red",*/}
      {/*    paddingBottom: MARGIN_T * 10,*/}
      {/*  }}>*/}

      <KeyboardAwareScrollView
        extraScrollHeight={100}
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          paddingTop: MARGIN_T,
          paddingHorizontal: PADDING_H,
          paddingBottom: 100,
          // paddingBottom: MARGIN_T * 10,
        }}>


        <SelectInput
          title={getLang(language, "CATEGORY")}
          options={[...catOptions.map(itm => itm.Name), getLang(language, "CANCEL")]}
          selectedOption={activeCategory.Name || ""}
          onSelect={(item) => onSelect(item, "cat")}
        />

        <SelectInput
          title={getLang(language, "DEPARTMENT")}
          options={[...depOptions.map(itm => itm.Title), getLang(language, "CANCEL")]}
          selectedOption={activeDepartment.Title || ""}
          onSelect={(item) => onSelect(item, "dep")}
        />


        <SelectInput
          title={getLang(language, "PRIORITY")}
          options={[...priorityOptions.map(itm => itm.Name), getLang(language, "CANCEL")]}
          selectedOption={activePriority.Name || ""}
          onSelect={(item) => onSelect(item, "priority")}
        />

        <FormInput autoComplete={"off"}
                   placeholder={"SUPPORT_TITLE"}
                   value={title}
                   keyboardType={"email-address"}
                   onChange={setTitle}
                   returnKey={"done"}
        />

        <TextInput
          style={styles(activeTheme).mInput}
          value={message}
          placeholder={getLang(language, "ENTER_SUPPORT_MESSAGE")}
          onChangeText={setMessage}
          placeholderTextColor={activeTheme.secondaryText}
          multiline={true}
          underlineColorAndroid="transparent"
          textAlignVertical={"top"}
          returnKeyType={"done"}
          autoCorrect={false}
          autoCompleteType={"off"}
          keyboardType={"email-address"}
          keyboardAppearance={"dark"}
        />


        {
          images.length >= 1 ?
            <FlatList
              showsVerticalScrollIndicator={false}
              data={images}
              horizontal={true}
              contentContainerStyle={{
                marginVertical: 8,
              }}
              renderItem={({ item }) => {
                return (
                  <View style={{

                    width: SCREEN_WIDTH / 4,
                    height: SCREEN_WIDTH / 6,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 8,
                  }}>
                    <Image
                      resizeMethod={"scale"}
                      useFastImage={true}
                      source={{ uri: item.uri }} style={styles(activeTheme).image} resizeMode={"contain"} />

                    <TouchableOpacity
                      onPress={() => setImages(images.filter(mm => mm.uri !== item.uri))}
                      activeOpacity={.8}
                      style={[styles(activeTheme).dismissButton, {}]}>
                      <TinyImage parent={"rest/"} name={"cancel"} style={styles(activeTheme).icon} />
                    </TouchableOpacity>

                  </View>
                );
              }}
              keyExtractor={item => item.uri}
            />


            : null
        }


        <TouchableOpacity
          onPress={askUpload}
          activeOpacity={.8}
          style={{
            height: INPUT_HEIGHT,
            width: "100%",
            backgroundColor: activeTheme.backgroundApp,
            marginVertical: 8,
            flexDirection: "row",
            borderWidth: 1,
            borderColor: activeTheme.borderGray,
            borderRadius: 4,
          }}>

          <View style={{
            height: "100%",
            width: "14%",
            backgroundColor: activeTheme.actionColor,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
          }}>

            <TinyImage parent={"rest/"} name={"upload"}
                       style={styles(activeTheme).icon} />


          </View>


          <View style={{
            height: "100%",
            width: "86%",
            justifyContent: "center",
            paddingHorizontal: PADDING_H,
          }}>

            <Text style={{
              fontFamily: "CircularStd-Book",
              fontSize: NORMAL_FONTSIZE,
              color: activeTheme.secondaryText,
            }}>{getLang(language, "UPLOAD_YOUR_PHOTO")}</Text>

          </View>
        </TouchableOpacity>
      </KeyboardAwareScrollView>


      <CustomButton text={getLang(language, "NEW_MESSAGE")}
                    filled={true}
                    onPress={handleStore}
                    style={{
                      backgroundColor: activeTheme.actionColor,
                    }} />

      <FloatingAction isButton={true} />

    </>
  );


};


const StoreHelpRequestScreen = styledHigherOrderComponents(StoreHelpRequest);
// const StoreHelpRequestScreen = StoreHelpRequest;
export default StoreHelpRequestScreen;


const styles = (props) => StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingVertical: 10,
  },
  left: { flexDirection: "row", justifyContent: "space-between" },
  title: {
    fontFamily: "CircularStd-Book",
    fontSize: 14,
    lineHeight: 32,
    color: props.secondaryText,
  },
  searchContainer: {
    height: 40,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: props.darkBackground,
    marginBottom: 10,
  },
  input: {
    height: "100%",
    backgroundColor: props.darkBackground,
    borderRadius: 8,
    paddingHorizontal: 0,
    paddingVertical: 8,
    flex: 1,
    color: "#8a96a6",
    alignSelf: "stretch",
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
  },

  searchIcon: { paddingHorizontal: 10 },
  icon: {
    width: 16,
    height: 16,
  },
  tWrap: {
    backgroundColor: props.darkBackground,
    height: 70,
    marginHorizontal: 1,
    marginVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    flex: 1,
  },
  tWrapR: {
    backgroundColor: props.darkBackground,
    // height: 80,
    marginVertical: 6,
    borderRadius: 8,
    paddingHorizontal: PADDING_H,
    paddingVertical: 8,
  },
  id: {
    fontFamily: "CircularStd-Book",
    color: props.secondaryText,
    fontSize: NORMAL_FONTSIZE - 2,
  },
  msg: {
    fontFamily: "CircularStd-Book",
    color: props.appWhite,
    fontSize: NORMAL_FONTSIZE - 1,

  },
  img1: {
    width: 18,
    height: 18,
    marginBottom: 8,
  },
  t1: {
    fontSize: NORMAL_FONTSIZE - 1,
    color: props.appWhite,
    fontFamily: "CircularStd-Book",
  },
  l1: {
    paddingTop: PADDING_H,
    paddingBottom: PADDING_H * 4,
    paddingHorizontal: PADDING_H,
  },
  d1: {
    fontFamily: "CircularStd-Book",
    color: props.secondaryText,
    fontSize: NORMAL_FONTSIZE - 2,
    marginTop: PADDING_H,
    marginBottom: PADDING_H * 2,
  },
  t2: {
    fontFamily: "CircularStd-Bold",
    color: props.appWhite,
    fontSize: TITLE_FONTSIZE,
  },
  mInput: {
    padding: PADDING_H,
    paddingTop: PADDING_H,
    paddingVertical: 12,
    marginVertical: 8,
    width: "100%",
    borderWidth: 1,
    height: 200,
    borderRadius: 4,
    borderColor: props.borderGray,
    color: props.appWhite,
    fontFamily: "CircularStd-Book",
    fontSize: NORMAL_FONTSIZE,
  },

  image: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
  },

  size: {
    fontSize: NORMAL_FONTSIZE,
    fontFamily: "CircularStd-Bold",
    color: "#fff",
    position: "absolute",
  },
  dismissButton: {
    width: "100%",
    alignItems: "center",
  },
});
