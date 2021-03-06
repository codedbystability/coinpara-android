import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BigInput from "../../../components/page-components/big-input";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";

const InviteContent = (props) => {

  const { handleAction, user } = props;
  const { language, activeTheme } = useSelector(state => state.globalReducer);
  const fields = [
    { id: 1, placeholder: "DEFAULT_REFERRAL_ID", value: "AffiliateCode" },
    { id: 2, placeholder: "YOU_RECEIVE", value: "BasePercentage", extra: "%" },
  ];


  return (
    <View style={styles(activeTheme).wrapper}>
      <Text style={styles(activeTheme).title}>{getLang(language, "INVITE_NOW")}</Text>

      <Text style={styles(activeTheme).desc}>
        {
          getLang(language, "INVITE_SUBTITLE")
        }
      </Text>

      <View style={styles(activeTheme).contentWrapper}>
        {
          fields.map(field => (
            <View style={styles(activeTheme).fieldWrapper} key={field.id}>
              <Text style={styles(activeTheme).textValue}>{user[field.value]}</Text>
              <Text style={styles(activeTheme).textPlaceholder}>{getLang(language, field.placeholder)}</Text>
            </View>
          ))
        }

        <BigInput
          inputValue={user.AffiliateLink}
          handleAction={handleAction}
        />


      </View>
    </View>
  );

};


export default InviteContent;

const styles = (props) => StyleSheet.create({

  wrapper: {
    width: "100%",
    paddingVertical: DIMENSIONS.PADDING_BIG,
    paddingHorizontal: DIMENSIONS.PADDING_H,

  },

  title: {
    color: props.appWhite,
    fontFamily: "CircularStd-Bold",
    fontSize: DIMENSIONS.BIG_TITLE_FONTSIZE + 2,
    marginBottom: DIMENSIONS.MARGIN_T,
  },

  desc: {
    color: props.secondaryText,
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.BIG_TITLE_FONTSIZE,
    marginBottom: DIMENSIONS.MARGIN_T / 2,
    lineHeight: 24,
  },

  contentWrapper: {
    // paddingVertical: 20,
  },

  fieldWrapper: {
    height: DIMENSIONS.INPUT_HEIGHT,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: props.borderGray,
    paddingHorizontal: DIMENSIONS.PADDING_H,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: DIMENSIONS.MARGIN_T,
  },

  textValue: {
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.BIG_TITLE_FONTSIZE,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    color: props.appWhite,
  },

  textPlaceholder: {
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.BIG_TITLE_FONTSIZE,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "right",
    color: props.secondaryText,
  },
  img: {
    maxWidth: DIMENSIONS.INPUT_HEIGHT,
    maxHeight: DIMENSIONS.INPUT_HEIGHT,
  },
  bigField: {
    width: "30%",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    height: "100%",
  },
});
