import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import DynamicImage from "../dynamic-image";
import Loading from "../loading";
import { formatMoney } from "../../../helpers/math-helper";
import { useSelector } from "react-redux";
import { getLang } from "../../../helpers/array-helper";
import { DIMENSIONS } from "../../../../utils/dimensions";


const InfoCard = ({ wallet, showButtons = false, handleButton = null, onPress = null }) => {

  const { language, activeTheme } = useSelector(state => state.globalReducer);
  if (!wallet || !wallet.cd) {
    return <Loading />;
  }

  return (
    <View style={[styles(activeTheme).wrapper]}>
      <Pressable
        onPress={onPress}
        style={[styles(activeTheme).container]}>


        <View style={[styles(activeTheme).leftWrapper, {
          backgroundColor: ["TRY", "USD", "EUR", "GBP"].includes(wallet.cd) ? activeTheme.priceCardBg : activeTheme.cryptoCardBg,
        }]}>
          {
            wallet && <DynamicImage market={wallet.cd} style={styles(activeTheme).image} />
          }
        </View>

        <View style={styles(activeTheme).rightWrapper}>
          <View style={[styles(activeTheme).infoWrapper, !showButtons && { width: "100%" }]}>

            <View style={{
              flexDirection: "row",
            }}>

              <Text style={[styles(activeTheme).title, { marginRight: 6 }]}>
                {wallet.cd}
              </Text>

              <Text style={styles(activeTheme).title}>
                {
                  formatMoney(wallet.am, wallet.dp)
                }
              </Text>
            </View>

            <View style={{ width: "120%" }}>
              <Text
                numberOfLines={1}
                style={[styles(activeTheme).title, { fontSize: DIMENSIONS.TITLE_FONTSIZE }]}>
                {
                  formatMoney(wallet.wb, wallet.dp)
                }

                {" " + getLang(language, "AVAILABLE")}
              </Text>
            </View>


          </View>
          {
            showButtons && <View style={styles(activeTheme).buttons}>

              <View style={styles(activeTheme).wrapper2}>
                <Pressable
                  onPress={() => handleButton("deposit")}
                  style={styles(activeTheme).tl}>
                  <Text
                    style={[styles(activeTheme).tlText, { color: activeTheme.buttonWhite }]}>{getLang(language, "DEPOSIT")}</Text>
                </Pressable>
              </View>

              <View style={styles(activeTheme).wrapper2}>
                <Pressable
                  onPress={() => handleButton("withdraw")}
                  style={styles(activeTheme).usd}>
                  <Text style={styles(activeTheme).tlText}>{getLang(language, "WITHDRAW")}</Text>
                </Pressable>
              </View>
            </View>
          }

        </View>


      </Pressable>


    </View>
  );
};

export default InfoCard;

const styles = (props) => StyleSheet.create({
  wrapper: {
    width: "100%",
  },

  container: {
    width: "100%",
    height: parseInt(DIMENSIONS.SCREEN_HEIGHT / 9),
    marginVertical: DIMENSIONS.PADDING_H,
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: props.backgroundApp,
    borderColor: props.borderGray,
    borderWidth: 1,
    flexDirection: "row",
  },

  leftWrapper: {
    width: "16%",
    height: "100%",
    // backgroundColor: props.darkBackground,
    borderBottomLeftRadius: 12,
    borderTopLeftRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginLeft: -5,
    width: 30,
    height: 30,
  },
  rightWrapper: {

    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    width: "84%",
    justifyContent: "space-between",
    flexDirection: "row",
    height: "100%",
  },
  title: {
    fontFamily: "CircularStd-Bold",
    fontSize: 17,
    color: props.appWhite,
  },

  wrapper2: {
    flexDirection: "row",
    width: 80,
    alignItems: "center",
    justifyContent: "space-between",
  },

  amount: {
    fontFamily: "CircularStd-Bold",
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    color: props.appWhite,
  },
  tl: {
    width: 80,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: props.actionColor,
    borderColor: props.borderGray,
    marginBottom: 12,
  },
  tlText: {
    fontFamily: "CircularStd-Book",
    fontSize: DIMENSIONS.TITLE_FONTSIZE,
    textAlign: "center",
    color: props.appWhite,
  },
  usd: {
    width: 80,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: props.borderGray,
  },
  infoWrapper: {
    width: "60%",
    height: "100%",
    paddingHorizontal: DIMENSIONS.PADDING_H,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  buttons: {
    width: "40%",
    height: "100%",
    paddingHorizontal: DIMENSIONS.PADDING_H,
    // paddingVertical: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});


