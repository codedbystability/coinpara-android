import React, { useEffect, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import userServices from "../../../services/user-services";
import { useSelector } from "react-redux";
import UserLogListItem from "../../../components/page-components/user-log-list-item";
import TabNavigationHeader from "../../../components/page-components/tab-navigation-header";
import { DIMENSIONS } from "../../../../utils/dimensions";
import DropdownAlert from "../../../providers/DropdownAlert";
import { getLang } from "../../../helpers/array-helper";
import ActionSheetComProvider from "../../../providers/ActionSheetComProvider";
import AnimatedTab from "../../../components/page-components/animated-tab";
import SwipeAbleItem from "../../../components/page-components/swipe-list/components/item";
import FloatingAction from "../../../components/page-components/floating-action";
import Linking from "../../../providers/Linking";
import CustomList from "../../../components/page-components/custom-list";

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
  const [announcements, setAnnouncements] = useState([]);
  const [activeHeaderKey, setActiveHeaderKey] = useState("notifications");
  const [selectedItem, setSelectedItem] = useState({});

  useEffect(() => {
    if (props.route && props.route.params && props.route.params.type) {
      setActiveHeaderKey(props.route.params.type);
    }
  }, [props.route]);

  useEffect(() => {
    if (activeLanguage && activeLanguage.Id) {
      activeHeaderKey === "announcements" ? fetchAnnouncements() : fetchNotifications();
    }
  }, [activeHeaderKey, activeLanguage]);

  useEffect(() => {
    if (activeHeaderKey === "notifications" && selectedItem.Guid) {
      showActionSheet();
    }
  }, [selectedItem]);

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

    userServices.getNotifications().then((response) => {
      if (response && response.IsSuccess) {
        setNotifications(response.Data);
      }
    });
  };

  const fetchAnnouncements = () => {

    userServices.getAnnouncements(activeLanguage.Id).then((response) => {
      if (response.IsSuccess) {
        setAnnouncements(response.Data);
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
      // Linkin
      Linking.openURL(item.Link);
      // Linking.openURL(item.Link).then(r => null);
    }
  };

  const onItemPressed = (item) => activeHeaderKey === "announcements" && handleAnnouncementDetail(item);

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


      <CustomList
        contentStyle={{
          paddingHorizontal: DIMENSIONS.PADDING_H,
        }}
        borderGray={"transparent"}
        data={activeHeaderKey === "notifications" ? notifications : announcements}
        showFooter={false}
        keyExtractor={item => activeHeaderKey === "notifications" ? item.Guid : item.TimeStamp}
        itemHeight={DIMENSIONS.LIST_ITEM_HEIGHT}
        renderItem={({ item, index }) =>
          <SwipeAbleItem {...{ item }}
                         style={{ marginVertical: DIMENSIONS.LIST_MARGIN_T }}
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
        onEndReached={null}
        ListHeaderComponent={
          <AnimatedTab {...{
            activeKey: activeHeaderKey,
            headers: headers,
            width: `50%`,
            onChange: handleSetHeader,
          }} />
        }
        iconKey={"fav-empty"}
        emptyMessage={getLang(language, activeHeaderKey === "notifications" ? "NO_NOTIFICATION_FOUND" : "NO_ANNOUNCEMENT_FOUND")}
      />
      <FloatingAction />

    </>

  );
};
const NotificationsScreen = styledHigherOrderComponents(Notifications);
export default React.memo(NotificationsScreen);

