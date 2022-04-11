import React, { useEffect, useState } from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { Text, TouchableOpacity, View } from "react-native";

import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import { navigationRef } from "../../../providers/RootNavigation";
import TinyImage from "../../../tiny-image";

const Result = (props) => {

  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const { activeTheme, language } = useSelector(state => state.globalReducer);

  const handleNavigation = () => {
    navigationRef.current.navigate("RegisterAdditional", {
      email,
    });
  };
  useEffect(() => {
    setType(props.route.params.type);
    setMessage(props.route.params.message);
    setEmail(props.route.params.email);
  }, []);


  if (!type || !message) {
    return null;
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}>

      <TinyImage parent={"rest/"} name={type === "success" ? "success" : "cancel"}
                 style={{
                   width: 16,
                   height: 16,
                 }}
      />

      <View style={{
        marginVertical: 40,
        alignItems: "center",
        justifyContent: "center",
      }}>

        <Text style={{
          fontFamily: "CircularStd-Book",
          fontSize: 14,
          color: activeTheme.appWhite,
          marginTop: 20,
          marginVertical: 10,

        }}>{email}</Text>

        <Text style={{
          fontFamily: "CircularStd-Book",
          fontSize: 14,
          color: activeTheme.secondaryText,

        }}>{message}</Text>

      </View>

      {
        type === "success" && <TouchableOpacity

          onPress={handleNavigation}
          style={{
            // position: "absolute",
            bottom: 20,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            paddingVertical: 40,
          }}>

          <Text style={{
            fontFamily: "CircularStd-Book",
            fontSize: 14,
            color: activeTheme.secondaryText,
          }}>{getLang(language, "TAP_ANYWHERE_TO_CONTINUE")}</Text>

        </TouchableOpacity>
      }
    </View>
  );


};


const ResultScreen = styledHigherOrderComponents(Result);
export default ResultScreen;
