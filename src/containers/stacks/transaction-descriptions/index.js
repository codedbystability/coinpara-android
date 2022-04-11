import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import { NORMAL_FONTSIZE, PADDING_H } from "../../../../utils/dimensions";
import { replaceAll } from "../../../helpers/string-helper";
import TinyImage from "../../../tiny-image";

const TransactionDescriptions = ({
                                   handleCopyTg, descriptions, isNormal = true,
                                   o1 = "NETWORK",
                                   o2 = "COIN",
                                   o3 = "",
                                   n1 = "N1",
                                   n2 = "C1",
                                   n3 = "",
                                   icon = true,
                                 }) => {
  const { language, activeTheme } = useSelector(state => state.globalReducer);

  const getProperText = (langF) => {
    if (langF === "COIN_DEPOSIT_MIN_DESCRIPTION") {
      const text = getLang(language, langF);
      return replaceAll(text, o3, n3);
    } else {
      const text = getLang(language, langF);
      const t1 = replaceAll(text, o1, n1);
      return replaceAll(t1, o2, n2);

    }
  };
  return (
    <View>
      {
        descriptions.map(description => {
          return (
            <View
              key={description.id}
              style={styles(activeTheme).item}>

              {
                description.title &&
                <Text style={styles(activeTheme).title}>
                  {
                    getLang(language, description.title)
                  }
                </Text>
              }

              <View style={styles(activeTheme).area}>

                {
                  icon ?
                    <TinyImage parent={'rest/'} name={'info'} style={styles(activeTheme).icon}/>
                    : null
                }

                <Text style={styles(activeTheme).val}>
                  {
                    isNormal ? description.isLan ? description.text : getLang(language, description.text) :
                      getProperText(description.text)

                  }
                </Text>
                {
                  description.icon && <Pressable
                    onPress={handleCopyTg}
                    style={styles(activeTheme).iconWrapper}>
                    <TinyImage parent={"rest/"} name={"copy"} style={styles(activeTheme).icon} />
                  </Pressable>
                }


              </View>
            </View>
          );
        })
      }
    </View>

  );

};

export default TransactionDescriptions;
const styles = (props) => StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderBottomColor: props.borderGray,
    paddingBottom: 2,
    marginTop: PADDING_H,
    // marginBottom: 8,

  },
  title: {
    fontFamily: "CircularStd-Bold",
    fontSize: NORMAL_FONTSIZE,
    color: props.secondaryText,
    marginVertical: 4,
  },
  area: {
    paddingVertical: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  val: {
    fontFamily: "CircularStd-Book",
    fontSize: NORMAL_FONTSIZE,
    color: props.appWhite,
    width: "90%",
  },
  iconWrapper: {
    position: "absolute",
    right: 10,
    top: -10,
    width: "10%",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 18,
    height: 18,
  },
});
