import React from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import { Pressable, Text, View } from "react-native";
import InfoCardResult from "../../../components/page-components/info-card-result";
import ExecutionDesc from "../../../components/page-components/execution-desc";
import TransactionDescriptions from "../transaction-descriptions";


const descriptions = [
  {
    id: 1, text: "Para yitirirken nelere dikkat etmeliyim ?", icon: "chevron-forward",
  },
  {
    id: 2, text: "Para yatirdim ne zaman hesabima gecer ?", icon: "chevron-forward",
  },
  {
    id: 3,
    text: "Para yatirma kurallar",
    icon: "chevron-forward",
  },
];
const RedeemCreated = (props) => {


  return (
    <View style={{
      flex: 1,
      padding: 20,
    }}>

      <InfoCardResult market={"TRY"} />

      <View style={{
        width: "100%",
        alignItems: "center",
        marginBottom: 30,
      }}>

        <Pressable style={{
          width: "50%",
          padding: 15,
          borderRadius: 16,
          borderColor: "rgba(255,255,255,.2)",
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
        }}>

          <Text style={{
            fontFamily: "CircularStd-Book",
            fontSize: 13,
            color: "#ffffff",
          }}>
            Bu istegi iptal et
          </Text>

        </Pressable>
      </View>

      <ExecutionDesc />

      <TransactionDescriptions descriptions={descriptions} />


    </View>
  );

};


const RedeemCreatedScreen = styledHigherOrderComponents(RedeemCreated);
export default RedeemCreatedScreen;
