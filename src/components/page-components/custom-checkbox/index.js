import React from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { DIMENSIONS } from "../../../../utils/dimensions";
import { useSelector } from "react-redux";

const CustomCheckbox = (props) => {

  const { agreementConfirmed, handleSetAgreementConfirmed, title, specialTitle = null } = props;
  const { activeTheme } = useSelector(state => state.globalReducer);
  return (
    <View style={{
      flexDirection: "row",
      marginVertical: DIMENSIONS.PADDING_H,
      justifyContent: "space-between",
      width: "100%",
    }}>

      <Pressable onPress={() => handleSetAgreementConfirmed(!agreementConfirmed)}
                 style={{ alignItems: "center", justifyContent: "center" }}>
        <Switch
          trackColor={{ false: activeTheme.borderGray, true: activeTheme.actionColor }}
          thumbColor={agreementConfirmed ? activeTheme.buttonWhite : activeTheme.secondaryText}
          ios_backgroundColor={activeTheme.borderGray}
          onValueChange={handleSetAgreementConfirmed}
          value={agreementConfirmed}
          style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
        />
      </Pressable>
      <View style={{ }}>
        {
          //, alignItems: "center", justifyContent: "center"
          specialTitle ? specialTitle : <Text style={{
            fontFamily: "CircularStd-Book",
            fontSize: DIMENSIONS.TITLE_FONTSIZE,
            color: activeTheme.secondaryText,
            maxWidth:'90%'
          }}>
            {
              title
            }
          </Text>
        }

      </View>
    </View>

  );
};

export default React.memo(CustomCheckbox);
