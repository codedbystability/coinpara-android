import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomButton from "../../../components/page-components/button";
import PercentageSelect from "../../../components/page-components/percentage-select";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import { replaceAll } from "../../../helpers/string-helper";


const GenerateLinkContent = (props) => {

  const { activeTheme, language } = useSelector(state => state.globalReducer);
  const {
    percentages,
    activePercentage,
    handleSetPercentage,
    handleCreateAffiliateCode,
  } = props;

  return (
    <View style={styles(activeTheme).wrapper}>
      <Text style={styles(activeTheme).title}>{getLang(language, "GENERATE_LINK")}</Text>

      <Text style={styles(activeTheme).desc}>
        {replaceAll(getLang(language, "YOURS_AND_FRIENDS_COMMISSION"), "v1", 20 - activePercentage)} %{activePercentage}
      </Text>


      <View style={styles(activeTheme).contentWrapper}>
        <View style={styles(activeTheme).fieldWrapper}>
          <Text style={styles(activeTheme).textValue}>%{20 - activePercentage}</Text>
          <Text style={styles(activeTheme).textPlaceholder}>{getLang(language, "YOU_RECEIVE")}</Text>
        </View>
      </View>

      <View style={styles(activeTheme).buttonsWrapper}>

        <Text style={styles(activeTheme).desc}>
          {getLang(language, "YOUR_FRIEND_RECEIVE")}
        </Text>

        <PercentageSelect percentages={percentages} handlePress={(item) => handleSetPercentage(item)}
                          activePercentage={activePercentage} />

        <CustomButton text={getLang(language, "GENERATE_YOUR_LINK")} filled={true} isRadius={true}
                      onPress={handleCreateAffiliateCode}
                      style={{
                        marginTop: 20,
                        backgroundColor: activeTheme.actionColor,
                      }} />


      </View>


    </View>
  );

};


export default React.memo(GenerateLinkContent);

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
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: DIMENSIONS.MARGIN_T,
  },

  bigFieldWrapper: {
    height: DIMENSIONS.INPUT_HEIGHT + 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: props.borderGray,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  textValue: {
    fontFamily: "CircularStd-Book",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    color: props.appWhite,
  },

  bigTextValue: {
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.BIG_TITLE_FONTSIZE,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    color: props.appWhite,
    flexWrap: "wrap",
    width: "70%",
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

  buttonsWrapper: {
    paddingVertical: DIMENSIONS.PADDING_BV,
  },

  buttonItem: {
    width: 70,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(42,70,92)",
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.BIG_TITLE_FONTSIZE,
    lineHeight: 24,
    letterSpacing: 0,
    color: props.appWhite,
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: DIMENSIONS.PADDING_BV,
  },
});
