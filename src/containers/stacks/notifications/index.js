import React, { useEffect, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { View, FlatList, Linking } from "react-native";
import userServices from "../../../services/user-services";
import { useSelector } from "react-redux";
import UserLogListItem from "../../../components/user-log-list-item";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import { LIST_MARGIN_T, PADDING_H, PADDING_V, SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../../utils/dimensions";
import EmptyContainer from "../../../components/empty-container";
import DropdownAlert from "../../../providers/DropdownAlert";
import { getLang } from "../../../helpers/array-helper";
import ActionSheetComProvider from "../../../providers/ActionSheetComProvider";
import AnimatedTab from "../../../components/animated-tab";
import SwipeAbleItem from "../../../components/swipe-list/components/item";
import Loading from "../../../components/loading";
import FloatingAction from "../../../components/floating-action";

const refRow = [];
let prevOpenedRow;
const headers = [
  { id: 1, key: "notifications", title: "NOTIFICATIONS" },
  { id: 2, key: "announcements", title: "ANNOUNCEMENTS" },
];
const Notifications = (props) => {
  const { language } = useSelector(state => state.globalReducer);
  const { activeLanguage } = useSelector(state => state.languageReducer);

  const [notifications, setNotifications] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [announcements, setAnnouncements] = useState([]);

  const [activeHeaderKey, setActiveHeaderKey] = useState("notifications");
  const [selectedItem, setSelectedItem] = useState({});

  useEffect(() => {
    if (props.route && props.route.params && props.route.params.type) {
      setActiveHeaderKey(props.route.params.type);
    }
  }, [props.route]);

  useEffect(() => {
    // setIsFetching(true);
    if (activeLanguage && activeLanguage.Id) {
      activeHeaderKey === "announcements" ? fetchAnnouncements() : fetchNotifications();
    }
  }, [activeHeaderKey, activeLanguage]);

  const closeAll = () => prevOpenedRow && prevOpenedRow.close();

  const closeRow = (index) => {
    if (index === null) {
      return closeAll();
    }
    if (prevOpenedRow && prevOpenedRow !== refRow[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = refRow[index];
  };

  const fetchNotifications = () => {
    setIsFetching(true);

    userServices.getNotifications().then((response) => {
      if (response && response.IsSuccess) {
        setNotifications(response.Data);
        setIsFetching(false);
      }
    });
  };

  const fetchAnnouncements = () => {
    setIsFetching(true);

    userServices.getAnnouncements(activeLanguage.Id).then((response) => {
      if (response.IsSuccess) {
        setAnnouncements(response.Data);
        setIsFetching(false);
      }
    });
  };

  const handleDeleteNotification = (index) => {
    closeAll();
    if (!selectedItem || !selectedItem.Guid || index !== 0) {
      return;
    }
    const instance = {
      guid: selectedItem.Guid,
    };

    userServices.deleteNotification(instance).then((response) => {
      if (response.IsSuccess) {
        setNotifications(notifications.filter(not => not.Guid !== instance.guid));
        closeAll();
        return DropdownAlert.show("info", getLang(language, "INFO"), getLang(language, "NOTIFICATION_DELETED_SUCCESSFULLY"));
      }
    });
  };

  const handleSetHeader = (header) => setActiveHeaderKey(header.key);

  const showActionSheet = () => ActionSheetComProvider.show({
    title: getLang(language, "DO_YOU_WANT_TO_DELETE_NOTIFICATION"),
    options: [getLang(language, "DELETE_NOTIFICATION"), getLang(language, "CANCEL")],
    onAction: (index) => handleDeleteNotification(index),
  });

  const handleAnnouncementDetail = (item) => {
    if (item.Link) {
      Linking.openURL(item.Link).then(r => null);
    }
  };

  const onItemPressed = (item) => {
    activeHeaderKey === "announcements" && handleAnnouncementDetail(item);
  };

  useEffect(() => {
    if (activeHeaderKey === "notifications" && selectedItem.Guid) {
      showActionSheet();
    }
  }, [selectedItem]);
  const onItemDeleted = (item) => setSelectedItem(item);


  const data = activeHeaderKey === "notifications" ? notifications : announcements;

  return (
    <>

      <TabNavigationHeader
        {...props}
        backAble={true}
        options={{
          presentation: "modal",
          title: getLang(language, "NOTIFICATIONS"),
        }}
      />
      <View style={styles.container}>

        <View style={{ paddingHorizontal: PADDING_H }}>


          <AnimatedTab {...{
            activeKey: activeHeaderKey,
            headers: headers,
            width: `50%`,
            onChange: handleSetHeader,
          }} />
        </View>

        {
          isFetching ? <Loading /> : data.length <= 0 ? <View style={{
              width: SCREEN_WIDTH,
              paddingTop: (SCREEN_HEIGHT / 4) - 20,
            }}>
              <EmptyContainer
                icon={"fav-empty"}
                text={getLang(language, activeHeaderKey === "notifications" ? "NO_NOTIFICATION_FOUND" : "NO_ANNOUNCEMENT_FOUND")} />
            </View> :
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.wrapper}
              data={data}
              renderItem={({ item, index }) =>
                <SwipeAbleItem {...{ item }}
                               style={{ marginVertical: LIST_MARGIN_T  }}
                               onSwipe={onItemDeleted}
                               swipeAble={activeHeaderKey === "notifications"}
                               Layout={() => <UserLogListItem
                                 index={index}
                                 ref={ref => refRow[index] = ref}
                                 item={item} onItemPressed={onItemPressed}
                                 closeRow={closeRow}
                                 showDelete={activeHeaderKey === "notifications"}
                                 titleKey={"Title"}
                                 descKey={activeHeaderKey === "notifications" ? "Description" : "Details"}
                                 dateKey={"TimeStamp"}
                               />}
                />
              }
              keyExtractor={item => activeHeaderKey === "notifications" ? item.Guid : item.TimeStamp}
            />


        }


      </View>
      <FloatingAction />

    </>

  );
};
const NotificationsScreen = styledHigherOrderComponents(Notifications);
export default NotificationsScreen;

const styles = {
  wrapper: {
    paddingVertical: PADDING_V,
    paddingHorizontal: PADDING_H,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
  },


};
