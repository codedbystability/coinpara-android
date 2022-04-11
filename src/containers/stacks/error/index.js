import React  from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { BIG_TITLE_FONTSIZE, MIDDLE_IMAGE } from "../../../../utils/dimensions";
import NImage from "../../../components/image/index.tsx";

const Error = ({ text = "" }) => {
  const { activeTheme } = useSelector(state => state.globalReducer);

  return (
    <View style={{ flex: 1, backgroundColor: "transparent", alignItems: "center", justifyContent: "center" }}>

      <NImage
        useFastImage={true}
        source={{ uri: "https://images.coinpara.com/files/mobile-assets/maintenance.png" }}
        style={{ width: MIDDLE_IMAGE, height: MIDDLE_IMAGE, tintColor: activeTheme.appWhite, marginBottom: 40 }}
        resizeMode={"contain"} />

      <Text style={{
        marginVertical: 20,
        fontFamily: "CircularStd-Bold",
        width: "90%",
        textAlign: "center",
        color: activeTheme.appWhite,
        fontSize:BIG_TITLE_FONTSIZE
      }}>
        {
          text
        }
      </Text>

    </View>
  );

};


const ErrorScreen = styledHigherOrderComponents(Error);
export default ErrorScreen;
