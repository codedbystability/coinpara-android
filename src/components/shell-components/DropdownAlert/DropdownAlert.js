import React, { forwardRef, useImperativeHandle, useRef } from "react";
import DropdownAlert from "react-native-dropdownalert";

import styles from "./DropdownAlert.styles";
import { Text, View } from "react-native";
import { setDropdownAlert } from "../../../providers/DropdownAlert";
import { useSelector } from "react-redux";
import TinyImage from "../../../tiny-image";

const CustomDropdownAlert = forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({
    show: show,
  }));

  const dropdownRef = useRef();
  const { activeTheme } = useSelector(state => state.globalReducer);

  const show = ({ type, title, message, data = {}, duration = 2000 }) => {
    dropdownRef.current.alertWithType(
      type,
      title,
      message,
      {
        data: data,
        textColor: activeTheme.appWhite,
        backgroundColor: activeTheme.borderGray,
      },
      duration,
    );
  };

  return (
    <DropdownAlert
      containerStyle={{
        backgroundColor: "transparent",
      }}
      successColor="transparent"
      errorColor="transparent"
      infoColor="transparent"
      warnColor="transparent"
      customColor="transparent"
      renderImage={() => null}
      renderTitle={() => null}
      renderMessage={(props, item) => {
        return (
          <View
            style={[
              styles.dropdownAlertView,
              {
                backgroundColor: item.payload.backgroundColor,
              },
            ]}
          >
            <View style={styles.info}>
              <TinyImage parent={'rest/'} name={'info'} style={styles.icon}/>
            </View>


            <View style={{ paddingRight: 16 }}>
              <Text
                style={[
                  styles.dropdownAlertText,
                  {
                    color: item.payload.textColor,
                  },
                ]}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  styles.dropdownAlertText,
                  {
                    color: item.payload.textColor,
                  },
                ]}
              >
                {item.message}
              </Text>
            </View>
          </View>
        );
      }}
      ref={dropdownRef}
      zIndex={10000}
      updateStatusBar={false}
    />
  );
});

const CustomDropdownAlertProvider = () => {
  return (
    <CustomDropdownAlert
      ref={(ref) => {
        setDropdownAlert(ref);
      }}
    />
  );
};

export default CustomDropdownAlertProvider;
