import React, { forwardRef, useState } from "react";
import { TextInput, StyleSheet, Text, View, TouchableOpacity, Pressable } from "react-native";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import TinyImage from "../../../tiny-image";
import TextInputMask from "react-native-text-input-mask";

const FormInput = forwardRef((props, ref) => {

  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const {
    value, onChange, keyboardType, placeholder,
    autoComplete, type,
    editable = true,
    autoFocus = false,
    icon = false,
    icon2 = false,
    isMasked = false,
    mask = "",
    leftAddition = null,
    onIconPressed = () => null,
    parentOnFocus = () => null,
    autoCapitalize = "words",
    inputAccessoryViewID = "inputAccessoryViewID",
  } = props;

  const getIcon = () => {
    switch (icon) {
      // case "clear":
      case "eye-close":

        return <TinyImage parent={"rest/"} name={"eye-close"}
                          style={styles(activeTheme).icon} />;
      case "eye-open":
        return <TinyImage parent={"rest/"} name={"eye"}
                          style={styles(activeTheme).icon} />;

      case "email-user":
        return <TinyImage parent={"rest/"} name={"email"}
                          style={styles(activeTheme).icon} />;

      case "time":
        return <TinyImage parent={"rest/"} name={"waiting"}
                          style={styles(activeTheme).icon} />;

      case "ref-code":
        return <TinyImage parent={"settings/"} name={"ref"}
                          style={styles(activeTheme).icon} />;


      default:
        return null;
    }

  };

  const getIconContent = () => {
    if (!icon) {
      if (!value) {
        return null;
      }
      if (editable && focus) {
        return <Pressable style={styles(activeTheme).iconWrapper}
                          onPress={() => onChange("")}>
          <TinyImage parent={"rest/"} name={"dismiss"}
                     style={styles(activeTheme).icon2} />
        </Pressable>;
      }

    }

    return (
      <Pressable style={styles(activeTheme).iconWrapper}
                 onPress={onIconPressed}>
        {
          getIcon()
        }
      </Pressable>
    );
  };

  const [focus, setFocus] = useState(false);
  const onFocus = () => {
    parentOnFocus();
    setFocus(true);
  };
  const onBlur = () => setFocus(false);


  return (

    <View style={{ width: "100%", padding: 0 }}>
      {
        value ? <Text
          style={[styles(activeTheme).smallPlaceholder,
            leftAddition && { paddingLeft: 25 }]}>{getLang(language, placeholder)}</Text> : null
      }

      {
        leftAddition && <View style={styles(activeTheme).left}>
          <Text style={styles(activeTheme).leftText}>
            {leftAddition}
          </Text>

        </View>
      }

      {
        isMasked ?
          <TextInputMask
            // refInput={(ref) => this.myDateText = ref}
            mask={mask}
            placeholder={getLang(language, placeholder)}
            placeholderTextColor={activeTheme.secondaryText}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            style={[styles(activeTheme).input,
              !value ? { paddingVertical: 8 } : { paddingTop: 16 },
              leftAddition && { paddingLeft: 40 },
              focus && styles(activeTheme).active,
            ]}
            onChangeText={onChange}
            value={value}
          /> : <TextInput
            keyboardAppearance={"dark"}
            ref={ref}
            secureTextEntry={type === "password"}
            style={[styles(activeTheme).input,
              !value ? { paddingVertical: 8 } : { paddingTop: 16 },
              leftAddition && { paddingLeft: 40 },
              focus && styles(activeTheme).active,
            ]}
            onChangeText={onChange}
            value={value}
            placeholder={getLang(language, placeholder)}
            placeholderTextColor={activeTheme.secondaryText}
            autoCapitalize={autoCapitalize}
            inputAccessoryViewID={inputAccessoryViewID}
            keyboardType={keyboardType}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
            editable={editable}
            onFocus={onFocus}
            onBlur={onBlur}
          />
      }


      {
        icon2 && <TouchableOpacity
          style={styles(activeTheme).iconWrapper}
          activeOpacity={1}
          onPress={onIconPressed}>
          {
            icon2
          }
        </TouchableOpacity>
      }

      {
        getIconContent()
      }

    </View>
  );

});


export default FormInput;

const styles = (props) => StyleSheet.create({
  input: {
    height: DIMENSIONS.INPUT_HEIGHT,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: props.borderGray,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingRight: 40,
    width: "100%",
    color: props.appWhite,
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    fontFamily: "CircularStd-Book",
  },
  smallPlaceholder: {
    position: "absolute",
    top: 16,
    fontSize: DIMENSIONS.NORMAL_FONTSIZE,
    left: 15,
    color: props.secondaryText,
    // fontSize:12,
    fontFamily: "CircularStd-Book",
  },
  iconWrapper: {
    position: "absolute",
    right: 6,
    top: DIMENSIONS.INPUT_HEIGHT / 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  left: {
    height: DIMENSIONS.INPUT_HEIGHT,
    width: 44,
    position: "absolute",
    left: 0,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: DIMENSIONS.PADDING_H / 2 - 1,
    // backgroundColor:'red',
    // padding: 8,

  },
  leftText: {
    fontFamily: "CircularStd-Book",
    color: props.appWhite,
    fontSize: DIMENSIONS.NORMAL_FONTSIZE + 1,
  },
  active: {
    borderColor: props.actionColor,
  },
  icon: {
    width: 20,
    height: 18,
  },
  icon2: {
    width: 16,
    height: 16,
  },
});
