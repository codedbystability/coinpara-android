import React from "react";
import { Pressable, Switch, Text, TextInput, View } from "react-native";
import styles from "./styles";
import { getLang } from "../../../helpers/array-helper";
import { useSelector } from "react-redux";
import TinyImage from "../../../tiny-image";
import HapticProvider from "../../../providers/HapticProvider";

const WalletListHeader = ({
                            searchText,
                            setSearchText,
                            handleFocus = null,
                            handleSmallBalance = null,
                            sortObj,
                            activeSmallPrices,
                            handleSortAction,

                          }) => {


  const { activeTheme, fontSizes, language } = useSelector(state => state.globalReducer);

  const handleSortActionOn = (type) => {
    handleSortAction(type);
    HapticProvider.trigger();
  };
  return (
    <>
      <View style={{ flex: 1, backgroundColor: activeTheme.backgroundApp }}>


        <View style={[styles(activeTheme).sheetContainer]}>

          <View style={styles(activeTheme).sheetHeaderContainer}>
            <Text style={styles(activeTheme, fontSizes).sheetTitle}>{getLang(language, "BALANCES")}</Text>

            <View style={styles(activeTheme).sheetHeaderContainer}>
              <Text
                style={[styles(activeTheme, fontSizes).smallPriceText, activeSmallPrices && {
                  color: activeTheme.actionColor,
                }]}>

                {getLang(language, "SMALL_BALANCES")}
              </Text>
              <Switch
                trackColor={{ false: activeTheme.darkBackground, true: activeTheme.actionColor }}
                thumbColor={activeSmallPrices ? activeTheme.buttonWhite : activeTheme.secondaryText}
                ios_backgroundColor={activeTheme.darkBackground}
                onValueChange={handleSmallBalance}
                value={activeSmallPrices}
              />
            </View>
          </View>

          <View style={styles(activeTheme).sheetSortWrapper}>

            <View style={[styles(activeTheme).sheetSortItem, { width: "28%"}]}>
              <Pressable onPress={() => handleSortActionOn("cd")} style={{}}>
                <Text style={[styles(activeTheme, fontSizes).sheetSortTitle,
                  sortObj.type === "cd" ? { color: activeTheme.appWhite } : {},
                ]}>{getLang(language, "CURRENCY")}</Text>
              </Pressable>
              {
                sortObj.type === "cd" &&
                <TinyImage
                  style={styles(activeTheme).icon2}
                  parent={"rest/"} name={sortObj.direction === "desc" ? "arrow-up" : "arrow-down"} />
              }
            </View>


            <View style={[styles(activeTheme).sheetSortItem, {
              width: "34%", justifyContent: "flex-end",
            }]}>

              {
                ["am", "wb"].includes(sortObj.type) &&
                <TinyImage parent={"rest/"} name={sortObj.direction === "desc" ? "arrow-up" : "arrow-down"}
                           style={styles(activeTheme).icon2}
                />
              }


              <Pressable onPress={() => handleSortActionOn("wb")}>
                <Text style={[styles(activeTheme, fontSizes).sheetSortTitle,
                  sortObj.type === "wb" ? { color: activeTheme.appWhite } : {},
                ]}>{getLang(language, "AVAILABLE")} / </Text>
              </Pressable>

              <Pressable onPress={() => handleSortActionOn("am")}>
                <Text style={[styles(activeTheme, fontSizes).sheetSortTitle,

                  sortObj.type === "am" ? { color: activeTheme.appWhite } : {},
                ]}>{getLang(language, "TOTAL")}</Text>
              </Pressable>


            </View>


            <View style={[styles(activeTheme).sheetSortItem, {
              width: "40%",
              justifyContent: "flex-end",
            }]}>


              <Text
                style={styles(activeTheme, fontSizes).sheetSortTitle}>≈ </Text>


              <Pressable
                onPress={() => handleSortActionOn("EstimatedTRY")}>
                <Text style={[styles(activeTheme, fontSizes).sheetSortTitle,
                  sortObj.type === "EstimatedTRY" ? { color: activeTheme.appWhite } : {},
                ]}>TRY - USDT</Text>
              </Pressable>


              {
                sortObj.type === "EstimatedTRY" &&
                <TinyImage
                  style={styles(activeTheme).icon2}
                  parent={"rest/"} name={sortObj.direction === "desc" ? "arrow-up" : "arrow-down"} />

              }
            </View>


          </View>


          <View style={styles(activeTheme).searchContainer}>
            <View style={styles(activeTheme).searchIcon}>
              <TinyImage parent={"rest/"} name={"search"} style={styles(activeTheme).icon} />
            </View>

            <TextInput
              keyboardAppearance={"dark"}
              style={styles(activeTheme).input}
              value={searchText}
              onChangeText={setSearchText}
              placeholder={getLang(language, "SEARCH")}
              autoFocus={false}
              autoCorrect={false}
              onFocus={handleFocus}
              autoComplete={"off"}
              autoCapitalize={"characters"}
              keyboardType={"email-address"}
              placeholderTextColor={activeTheme.secondaryText}
            />


            {
              searchText ?
                <Pressable onPress={() => setSearchText("")}>
                  <View style={styles(activeTheme).searchIcon}>
                    <TinyImage parent={"rest/"} name={"dismiss"} style={styles(activeTheme).icon} />
                  </View>
                </Pressable> : null
            }

          </View>
        </View>
      </View>


    </>

  );
};

export default React.memo(WalletListHeader);
