import React, { useEffect, useState } from "react";
import {
  Image, KeyboardAvoidingView, Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import TabNavigationHeader from "../../../components/page-components/tab-navigation-header";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import { DIMENSIONS } from "../../../../utils/dimensions";
import CustomList from "../../../components/page-components/custom-list";
import TinyImage from "../../../tiny-image";
import generalServices from "../../../services/general-services";
import CustomButton from "../../../components/page-components/button";
import InputAccessory from "../../../components/page-components/input-accessory";
import moment from "moment";


const HelpCenterDetail = props => {

  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({});
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [showText, setShowText] = useState(false);
  const [messages, setMessages] = useState([]);
  const getHelpDetails = () => {
    generalServices.getHelpDetails(item.Id).then((response) => {
      if (response && response.IsSuccess) {
        console.log("item - ", item);
        const items = [{ ...item, ReplyType: 1 }].concat(response.Data);
        setMessages(items);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (item && item.Id) {


      getHelpDetails();
    }
  }, [item]);

  useEffect(() => {
    if (image) {
      setShowImage(true);
    } else {
      setShowImage(false);
    }
  }, [image]);

  useEffect(() => {
    if (props.route && props.route.params) {
      setItem(props.route.params.item);
    }
  }, [props.route]);


  const renderRequestItemAdmin = (item) => {
    console.log(item);
    return (

      <View style={{
        flexDirection: "row",
        paddingVertical: DIMENSIONS.PADDING_H,

      }}>
        <View style={{
          width: "10%",
          alignItems: "flex-start",
          justifyContent: "center",
        }}>
          <Image
            source={{
              uri: "https://images.coinpara.com/files/mobile-assets/logo.png",
            }}
            style={[styles(activeTheme).icon, { tintColor: activeTheme.appWhite }]}
            resizeMode={"contain"} />
        </View>
        <View style={{
          width: "90%",
          backgroundColor: activeTheme.darkBackground,
          borderRadius: 8,
          paddingBottom: DIMENSIONS.PADDING_H * 2,
          paddingTop: DIMENSIONS.PADDING_H,
          paddingHorizontal: DIMENSIONS.PADDING_H,
        }}>
          <Text style={{
            fontFamily: "CircularStd-Book",
            fontSize: DIMENSIONS.NORMAL_FONTSIZE,
            color: activeTheme.appWhite,
          }}>{item.Message || item.HelpMessage}</Text>

          {
            item.Attachments && item.Attachments.length >= 1 ? <ScrollView
              contentContainerStyle={{
                paddingTop: DIMENSIONS.PADDING_H,
              }}

              horizontal={true}>

              {
                item.Attachments.filter(ii => ii !== "").map(img => <Pressable
                  key={img}
                  onPress={() => setImage(img)}>
                  <Image source={{
                    uri: img,
                  }}
                         style={{
                           height: 60,
                           width: 60,
                           marginRight: DIMENSIONS.PADDING_H,
                           borderRadius: 8,
                           borderWidth: 1,
                           borderColor: activeTheme.appWhite,
                         }}
                  />
                </Pressable>)
              }
            </ScrollView> : null
          }

          <Text style={{
            position: "absolute",
            right: DIMENSIONS.PADDING_H,
            bottom: 4,
            fontFamily: "CircularStd-Book",
            fontSize: DIMENSIONS.NORMAL_FONTSIZE,
            color: activeTheme.secondaryText,

          }}>
            {
              moment.utc(item.TimeStamp).format("YYYY-MM-DD HH:mm")
            }
          </Text>
        </View>


      </View>
    );
  };
  const renderRequestItemUser = (item) => {
    return (
      <View style={{
        // height: DIMENSIONS.LIST_ITEM_HEIGHT * 2,
        flexDirection: "row",
        paddingVertical: DIMENSIONS.PADDING_H,
      }}>
        <View style={{
          width: "90%",
          backgroundColor: activeTheme.darkBackground,
          borderRadius: 8,
          paddingBottom: DIMENSIONS.PADDING_H * 2,
          paddingTop: DIMENSIONS.PADDING_H,
          paddingHorizontal: DIMENSIONS.PADDING_H,
        }}>
          <Text style={{
            fontFamily: "CircularStd-Book",
            fontSize: DIMENSIONS.NORMAL_FONTSIZE,
            color: activeTheme.appWhite,
          }}>{item.Message || item.HelpMessage}</Text>

          {
            item.Attachments && item.Attachments.length >= 1 ? <ScrollView
              contentContainerStyle={{
                paddingTop: DIMENSIONS.PADDING_H,
              }}

              horizontal={true}>

              {
                item.Attachments.filter(ii => ii !== "").map(img => <Pressable
                  key={img}
                  onPress={() => setImage(img)}>
                  <Image source={{
                    uri: img,
                  }}
                         style={{
                           height: 60,
                           width: 60,
                           marginRight: DIMENSIONS.PADDING_H,
                           borderRadius: 8,
                           borderWidth: 1,
                           borderColor: activeTheme.appWhite,
                         }}
                  />
                </Pressable>)
              }
            </ScrollView> : null
          }

          <Text style={{
            position: "absolute",
            right: DIMENSIONS.PADDING_H,
            bottom: 4,
            fontFamily: "CircularStd-Book",
            fontSize: DIMENSIONS.NORMAL_FONTSIZE,
            color: activeTheme.secondaryText,

          }}>
            {
              moment.utc(item.TimeStamp).format("YYYY-MM-DD HH:mm")
            }
          </Text>
        </View>

        <View style={{
          width: "10%",
          alignItems: "flex-end",
          justifyContent: "center",
        }}>
          <TinyImage style={styles(activeTheme).icon} parent={"rest/"} name={"user"} />

        </View>
      </View>
    );
  };

  const keyExtractor = (_, i) => `help-center-index-${i}`;
  const handleShowText = () => {
    if (message) {
      handleInsert();
    } else {
      setShowText(!showText);
    }

  };


  const handleInsert = () => {
    //HelpGuid
    if (!message) {
      return;
    }
    const instance = {
      HelpDeskGuid: item.HelpGuid,
      Message: message,
      Type: 2,
    };
    generalServices.insertHelp(instance).then((response) => {
      console.log(response);
      if (response.IsSuccess) {
        getHelpDetails();

        setMessage("");
        setShowText(false);
        setShowImage(false);


      }
    });
  };
  return (
    <>
      <TabNavigationHeader
        {...props}
        backAble={true}
        isBack={true}
        options={{ title: getLang(language, "SUPPORT_CENTER") }}
      />


      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={"padding"}>
        <CustomList
          contentStyle={styles(activeTheme).l1}
          borderGray={"transparent"}
          data={loading ? [] : messages}
          keyExtractor={keyExtractor}
          itemHeight={DIMENSIONS.LIST_ITEM_HEIGHT * 2}
          renderItem={({ item }) => item.ReplyType === 0 ? renderRequestItemAdmin(item) : renderRequestItemUser(item)}
          onEndReached={null}
          iconKey={"empty-orders"}
          emptyMessage={getLang(language, "NO_SUPPORT_REQUEST_FOUND")}

        />

        {
          showText ?
            <View style={{
              padding: DIMENSIONS.PADDING_H,
              paddingBottom: 80,
            }}>
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
                autoFocus={true}
                autoCompleteType={"off"}
                keyboardType={"email-address"}
                keyboardAppearance={"dark"}
              />

              <CustomButton text={getLang(language, "SUBMIT")}
                            filled={true}
                            isRadius={true}
                            onPress={handleInsert}
                            style={{
                              marginTop: DIMENSIONS.PADDING_H,
                              backgroundColor: activeTheme.actionColor,
                            }} />
            </View> : null

        }

      </KeyboardAvoidingView>

      {
        item && item.Status === 1 ? <>
          <CustomButton text={getLang(language, showText ? "CLOSE" : "GIVE_ANSWER")}
                        filled={true}
                        onPress={handleShowText}
                        style={{
                          backgroundColor: showText ? activeTheme.borderGray : activeTheme.actionColor,
                        }} />
          <InputAccessory />
        </> : null
      }


      <Modal
        animationType="slide"
        transparent={true}
        visible={showImage}
        onRequestClose={() => {
          // this.closeButtonFunction()
        }}>
        <View
          style={{
            height: "60%",
            marginTop: "auto",
            backgroundColor: activeTheme.darkBackground,
            alignItems: "center",
            justifyContent: "center",
            borderTopWidth: 5,
            borderTopColor: activeTheme.actionColor,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}>

          <Image
            source={{
              uri: image,
            }}
            style={styles(activeTheme).img}
            resizeMode={"contain"}
          />

          <Pressable style={styles(activeTheme).dismissButton} onPress={() => setShowImage(false)}>
            <TinyImage parent={"rest/"} name={"cancel"} style={styles(activeTheme).icon} />
          </Pressable>

        </View>
      </Modal>
    </>
  );


};


const HelpCenterDetailScreen = styledHigherOrderComponents(HelpCenterDetail);
export default HelpCenterDetailScreen;
const ww = DIMENSIONS.SCREEN_WIDTH * 0.2;


const styles = (props) => StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingVertical: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  l1: {
    paddingTop: DIMENSIONS.PADDING_H,
    paddingBottom: 120,
    paddingHorizontal: DIMENSIONS.PADDING_H,
  },
  container: {
    flex: 1,
    backgroundColor: "#98B3B7",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "black",
    fontSize: 18,
    padding: 26,
  },
  noteHeader: {
    backgroundColor: "#42f5aa",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  footer: {
    flex: 1,
    backgroundColor: "#ddd",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  textInput: {
    alignSelf: "stretch",
    color: "black",
    padding: 20,
    backgroundColor: "#ddd",
    borderTopWidth: 2,
    borderTopColor: "#ddd",
  },
  addButton: {
    position: "absolute",
    zIndex: 11,
    right: 20,
    bottom: 90,
    backgroundColor: "#98B3B7",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  img: {
    width: DIMENSIONS.SCREEN_WIDTH - DIMENSIONS.PADDING_H * 2,
    height: DIMENSIONS.SCREEN_WIDTH / 1.4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: props.appWhite,
  },

  dismissButton: {
    fontFamily: "CircularStd-Bold",
    color: "#fff",
    position: "absolute",
    bottom: 30,
    width: ww,
    height: ww,
    borderRadius: ww / 2,
    left: DIMENSIONS.SCREEN_WIDTH / 2 - ww / 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999999,
  },
  mInput: {
    padding: DIMENSIONS.PADDING_H,
    paddingTop: DIMENSIONS.PADDING_H,
    paddingVertical: 12,
    marginVertical: 8,
    width: "100%",
    borderWidth: 1,
    height: 200,
    borderRadius: 4,
    borderColor: props.borderGray,
    color: props.appWhite,
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.NORMAL_FONTSIZE,
    backgroundColor: props.darkBackground,
  },

});
