import React from "react";
import { Text, View } from "react-native";
import DynamicImage from "../dynamic-image";
import { PADDING_H, SCREEN_HEIGHT } from "../../../utils/dimensions";
import TinyImage from "../../tiny-image";


const InfoCardResult = ({ market }) => {

  const fields = [
    { id: 1, title: "AKBANK", value: "TR310006200000700006" },
    { id: 2, title: "Deposit IBAN", value: "TR31 00TR31 00TR31 00TR31 00TR31 00", icon: "copy" },
    { id: 3, title: "Account Owner", value: "Yazilim Ticaret A.S.", icon: "copy" },
  ];

  return (
    <View style={{
      width: "100%",
      // paddingHorizontal: 20,
    }}>
      <View style={{
        width: "100%",
        height: SCREEN_HEIGHT / 4,
        marginVertical: 20,

        borderRadius: 20,
        backgroundColor: "#051623",
        flexDirection: "row",
      }}>

        <View style={{
          width: "20%",
          height: "100%",
          backgroundColor: market === "TRY" ? "#0084ff" : "#ff8f00",
          borderBottomLeftRadius: 20,
          borderTopLeftRadius: 20,
          alignItems: "center",
          justifyContent: "center",
        }}>


          <DynamicImage market={"btc"} style={{
            marginLeft: -5,
            width: 30,
            height: 30,
          }} />


        </View>


        <View style={{
          paddingHorizontal: PADDING_H,
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
          width: "80%",
          justifyContent: "space-around",
        }}>

          {
            fields.map(field => (
              <View style={{
                width: "100%",
                flexDirection: "row",
              }}>
                <View style={{
                  width: "90%",
                  paddingRight: 6,
                }}>
                  <Text style={{
                    fontFamily: "CircularStd-Bold",
                    fontSize: 19,
                    color: "#ffffff",
                  }}>
                    {field.title}
                  </Text>

                  <Text style={{
                    fontFamily: "CircularStd-Book",
                    fontSize: 14,
                    color: "rgba(255,255,255,.5)",
                  }}>
                    {field.value}
                  </Text>
                </View>

                <View style={{
                  width: "10%",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <TinyImage parent={"rest/"} name={"copy"} style={{
                    width: 20,
                    height: 20,
                  }} />
                </View>
              </View>
            ))
          }


        </View>
      </View>


    </View>
  );
};

export default InfoCardResult;
