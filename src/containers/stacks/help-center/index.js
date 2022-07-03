import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import TabNavigationHeader from "../../../components/page-components/tab-navigation-header";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import { DIMENSIONS } from "../../../../utils/dimensions";
import CustomList from "../../../components/page-components/custom-list";
import TinyImage from "../../../tiny-image";
import generalServices from "../../../services/general-services";
import AnimatedTab from "../../../components/page-components/animated-tab";
import moment from "moment";
import { navigationRef } from "../../../providers/RootNavigation";
import FloatingAction from "../../../components/page-components/floating-action";
import Intercom from "@intercom/intercom-react-native";


const headers = [
  { id: 1, key: 1, title: "ACTIVE" },
  { id: 2, key: 2, title: "CLOSED_SUPPORT_REQUESTS" },
];

const HelpCenter = props => {

  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const { user, authenticated } = useSelector(state => state.authenticationReducer);
  const [loading, setLoading] = useState(true);
  const [activeHeaderKey, setActiveHeaderKey] = useState(1);
  const [openRequests, setOpenRequests] = useState([]);

  useEffect(() => {

    getSupportRequests();

  }, [activeHeaderKey]);

  const getSupportRequests = () => {
    generalServices.getOpenSupportRequests(activeHeaderKey).then((response) => {
      if (response && response.IsSuccess) {
        setOpenRequests(response.Data);
        setLoading(false);
      }
    });
  };


  const handleNavigation = (item) => {
    if (item === "CREATE_SUPPORT_REQUEST") {
      return navigationRef.current.navigate("StoreHelpRequest", {
        getSupportRequests,
      });
    } else if (item === "CONTACT_SUPPORT") {
      if (authenticated) {
        Intercom.registerIdentifiedUser({
          userId: user.Id,
          email: user.Email,
        }).then(null);
      } else {
        Intercom.registerUnidentifiedUser().then(r => console.log("intercom - ", r));
      }
      Intercom.displayMessenger().then(null);
    }
  };

  const handleDetail = (item) => {
    navigationRef.current.navigate("HelpCenterDetail", {
      item,
    });
  };

  const renderRequestItem = (item) => {
    return (
      <TouchableOpacity
        onPress={() => handleDetail(item)}
        activeOpacity={.8}
        style={styles(activeTheme).tWrapR}
      >

        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
        }}>
          {/*<Text style={styles(activeTheme).id}>ID #{item.Id}</Text>*/}
          <View style={{
            width: "33%",
          }}>
            <Text style={styles(activeTheme).idT}>{getLang(language, "CATEGORY")}</Text>
            <Text style={styles(activeTheme).id}>{item.HelpCategoryName}</Text>
          </View>

          <View style={{
            width: "33%",
            alignItems: "center",
          }}>
            <Text style={styles(activeTheme).idT}>{getLang(language, "PRIORITY")}</Text>
            <Text style={styles(activeTheme).id}>{item.HelpPriorityName}</Text>

          </View>

          <View style={{
            width: "33%",
            alignItems: "flex-end",
          }}>
            <Text style={styles(activeTheme).idT}>{getLang(language, "DEPARTMENT")}</Text>
            <Text style={styles(activeTheme).id}>{item.HelpDepartmentName}</Text>

          </View>
        </View>

        <View style={{
          marginTop: 2,
          marginBottom: 8,
          flexDirection: "row",
          alignItems: "center",
        }}>
          <View style={{
            width: "90%",
          }}>
            <Text style={styles(activeTheme).idT}>{getLang(language, "SUBJECT")}</Text>
            <Text style={[styles(activeTheme).msg, {
              marginTop: 4,
            }]}>{item.HelpMessage.substr(0, 80)}...</Text>
          </View>

          <View style={{
            width: "10%",
            justifyContent: "flex-end",
            alignItems: "center",
            flexDirection: "row",
            height: "100%",
          }}>
            <TinyImage parent={"rest/"} name={"c-right"} style={styles(activeTheme).icon} />
          </View>
        </View>
        <View style={{
          flexDirection: "row",
        }}>
          {
            item.Attachments && item.Attachments.length >= 1 ? item.Attachments.map(img => (

              <View style={{
                // width: SCREEN_WIDTH / 4,
                // height: SCREEN_WIDTH / 6,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
              }}>
                <Image
                  resizeMethod={"scale"}
                  useFastImage={true}
                  source={{ uri: img }} style={styles(activeTheme).image} resizeMode={"contain"} />


              </View>
            )) : null
          }
        </View>

        <View style={{
          flexDirection: "row",
          justifyContent: "flex-end",
        }}>

          <Text style={styles(activeTheme).idT}>{moment.utc(item.Timestamp).format("YYYY-MM-DD HH:mm")}</Text>


        </View>

      </TouchableOpacity>
    );
  };

  const keyExtractor = (_, i) => `help-center-index-${i}`;


  return (
    <>
      <TabNavigationHeader
        {...props}
        backAble={true}
        isBack={false}
        options={{ title: getLang(language, "SUPPORT_CENTER") }}
      />


      <CustomList
        contentStyle={styles(activeTheme).l1}
        borderGray={"transparent"}
        data={loading ? [] : openRequests}
        keyExtractor={keyExtractor}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View style={{ backgroundColor: activeTheme.backgroundApp }}>

            <AnimatedTab {...{
              activeKey: activeHeaderKey,
              headers: headers,
              width: `50%`,
              filled: true,
              onChange: (item) => setActiveHeaderKey(item.key),
            }} />

          </View>
        }
        itemHeight={DIMENSIONS.LIST_ITEM_HEIGHT}
        renderItem={({ item }) => renderRequestItem(item)}
        onEndReached={null}
        iconKey={"empty-orders"}
        emptyMessage={getLang(language, "NO_SUPPORT_REQUEST_FOUND")}

      />

      <View style={styles(activeTheme).w4}>

        <TouchableOpacity
          onPress={() => handleNavigation("CONTACT_SUPPORT")}
          activeOpacity={.8}
          style={styles(activeTheme).ww}>

          <TinyImage parent={"settings/"} name={"support"}
                     style={styles(activeTheme).icon} />

          <Text style={styles(activeTheme).bT}>{getLang(language, "CONTACT_SUPPORT")}</Text>


        </TouchableOpacity>


        <TouchableOpacity
          activeOpacity={.8}
          onPress={() => handleNavigation("CREATE_SUPPORT_REQUEST")}
          style={styles(activeTheme).b1}>

          <TinyImage parent={"rest/"} name={"tick-active"}
                     style={styles(activeTheme).icon} />

          <Text style={styles(activeTheme).bT}>{getLang(language, "CREATE_SUPPORT_REQUEST")}</Text>


        </TouchableOpacity>

      </View>


      <FloatingAction isButton={true} />

    </>
  );


};


const HelpCenterScreen = styledHigherOrderComponents(HelpCenter);
export default HelpCenterScreen;


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

  icon: {
    width: 16,
    height: 16,
  },
  bT: {
    fontSize: DIMENSIONS.NORMAL_FONTSIZE - 1,
    color: props.appWhite,
    fontFamily: "CircularStd-Book",
    marginTop: 4,
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
    paddingHorizontal: DIMENSIONS.PADDING_H,
    paddingVertical: 8,
  },
  id: {
    fontFamily: "CircularStd-Book",
    color: props.appWhite,
    fontSize: DIMENSIONS.NORMAL_FONTSIZE - 2,
  },
  idT: {
    fontFamily: "CircularStd-Book",
    color: props.secondaryText,
    fontSize: DIMENSIONS.NORMAL_FONTSIZE - 2,
  },
  msg: {
    fontFamily: "CircularStd-Book",
    color: props.appWhite,
    fontSize: DIMENSIONS.NORMAL_FONTSIZE - 1,

  },
  img1: {
    width: 18,
    height: 18,
    marginBottom: 8,
  },
  t1: {
    fontSize: DIMENSIONS.NORMAL_FONTSIZE - 1,
    color: props.appWhite,
    fontFamily: "CircularStd-Book",
  },
  l1: {
    paddingTop: DIMENSIONS.PADDING_H,
    paddingBottom: 120,
    paddingHorizontal: DIMENSIONS.PADDING_H,
  },
  d1: {
    fontFamily: "CircularStd-Book",
    color: props.secondaryText,
    fontSize: DIMENSIONS.NORMAL_FONTSIZE - 2,
    marginTop: DIMENSIONS.PADDING_H,
    marginBottom: DIMENSIONS.PADDING_H * 2,
  },
  t2: {
    fontFamily: "CircularStd-Bold",
    color: props.appWhite,
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
  },
  image: {
    width: 40,
    height: 40,
  },

  ww: {
    height: "100%",
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: props.darkBackground,
  },
  w4: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    backgroundColor: props.backgroundApp,
    minHeight: DIMENSIONS.INPUT_HEIGHT + 6,
  },
  b1: {
    height: "100%",
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: props.actionColor,
  },
});
