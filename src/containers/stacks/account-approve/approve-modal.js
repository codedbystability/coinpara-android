import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import CustomButton from "../../../components/button";
import GovernmentIdStep from "./goverment-id";
import SelfieImage from "./selfie-image";
import SelfieVideo from "./selfie-video";
import AddressImage from "./address-image";
import { isIphoneX } from "../../../../utils/devices";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import { SCREEN_HEIGHT } from "../../../../utils/dimensions";
import DropdownAlert from "../../../components/shell-components/DropdownAlert/DropdownAlert";

const ApproveModal = (props) => {

  const {
    type,
    step,
    handleStep,
    handleShowAction,
    identityFrontImage,
    identityBackImage,
    addressImage,
    selfieImage,
    selfieVideo,
    handleClearImage,
    onHide,
    total,
  } = props;


  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const getDynamicContent = () => {
    switch (type) {
      case "government-id":
        return <GovernmentIdStep handleShowAction={handleShowAction}
                                 identityFrontImage={identityFrontImage}
                                 language={language}
                                 identityBackImage={identityBackImage}
                                 handleClearImage={handleClearImage}
        />;

      case "selfie-image":
        return <SelfieImage handleShowAction={handleShowAction}
                            handleClearImage={handleClearImage}
                            language={language}
                            image={selfieImage} />;

      case "address-image":
        return <AddressImage handleShowAction={handleShowAction}
                             handleClearImage={handleClearImage}
                             language={language}
                             image={addressImage} />;

      case "selfie-video":
        return <SelfieVideo handleShowAction={handleShowAction}
                            language={language}
                            handleClearImage={handleClearImage}
                            image={selfieVideo} />;

      default:
        return null;
    }
  };

  const renderContent = () => (
    <View style={styles(activeTheme).headerWrapper}>
      <View style={styles(activeTheme).wrapper}>
        <View style={styles(activeTheme).header}>
          <Text style={styles(activeTheme).title}>{step >= total ? total : step} / {total}</Text>
          <Text style={styles(activeTheme).title} />
          <Pressable onPress={onHide} style={styles(activeTheme).pressAble}>
            <Text style={styles(activeTheme).xT}>X</Text>
          </Pressable>
        </View>

        {
          getDynamicContent()
        }

      </View>
      {
        footerComponent()
      }
    </View>
  );

  const footerComponent = () => {
    return (
      <View style={styles(activeTheme).buttonWrapper}>
        {
          [2, 3, 4].includes(step) && <CustomButton text={getLang(language, "BACK", "BACK")}
                                                    style={{ width: "30%", backgroundColor: activeTheme.secondaryText }}
                                                    filled={false}
                                                    isSecondary={true}
                                                    onPress={() => handleStep(step, "prev")} />
        }
        <CustomButton text={getLang(language, step === 3 ? "FINISH" : "NEXT")}
                      style={{
                        backgroundColor: activeTheme.actionColor,
                        width: [2, 3, 4].includes(step) ? "70%" : "100%",
                      }}
                      filled={true}
                      onPress={() => handleStep(step, "next")} />

      </View>
    );
  };

  return (
    <>
      {
        renderContent()
      }
      <DropdownAlert />
    </>
  );
};


export default ApproveModal;


const styles = (props) => StyleSheet.create({
  wrapper: {
    zIndex: 99,
    height: SCREEN_HEIGHT - 60 - 40,
  },

  header: {
    height: 60,
    width: "100%",
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: props.darkBackground,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderBottomColor: props.borderGray,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: "CircularStd-Bold",
    color: props.appWhite,
    fontSize: 14,
  },

  scrollView: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  desc: {
    color: props.appWhite,
    fontFamily: "CircularStd-Book",
    textAlign: "center",
    fontSize: 12,
  },

  line: {
    height: 1,
    width: "100%",
    backgroundColor: props.borderGray,
  },
  image: {
    height: 160,
    width: "100%",
    marginTop: 20,
  },
  buttonWrapper: {
    // height: 80,
    flexDirection: "row",
    width: "100%",
    // paddingBottom: isIphoneX ? 12 : 0,
    zIndex: 99,
    position: "absolute",
    bottom: 0,
  },
  pressAble: {
    paddingHorizontal: 5,
  },
  xT: {
    fontSize: 18,
    color: props.appWhite,
    fontFamily: "CircularStd-Bold",
  },
  modal: {
    paddingVertical: isIphoneX ? 20 : 4,
    backgroundColor: props.darkBackground,
    zIndex: 99,
  },
  headerWrapper: {
    flex: 1,
    zIndex: 99,
    // paddingTop: isIphoneX ? 30 : 20,
    backgroundColor: props.darkBackground,
  },
});
