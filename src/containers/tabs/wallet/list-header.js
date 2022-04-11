import React from "react";
import { Pressable, Switch, Text, TextInput, View } from "react-native";
import styles from "./styles";
import { getLang } from "../../../helpers/array-helper";
import { PADDING_H } from "../../../../utils/dimensions";
import { useSelector } from "react-redux";
import TinyImage from "../../../tiny-image";

const WalletListHeader = ({
                            searchText,
                            setSearchText,
                            handleFocus = null,
                            handleSmallBalance = null,
                            sortObj,
                            activeSmallPrices,
                            handleSortAction,
                          }) => {

  const { activeTheme,fontSizes, language } = useSelector(state => state.globalReducer);

  return (
    <>
      <View style={{ flex: 1, backgroundColor: activeTheme.backgroundApp }}>


        <View style={[styles(activeTheme).sheetContainer]}>

          <View style={styles(activeTheme).sheetHeaderContainer}>
            <Text style={styles(activeTheme,fontSizes).sheetTitle}>{getLang(language, "BALANCES")}</Text>

            <View style={styles(activeTheme).sheetHeaderContainer}>
              <Text
                style={[styles(activeTheme,fontSizes).smallPriceText, activeSmallPrices && {
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

            <View style={[styles(activeTheme).sheetSortItem, { width: "28%" }]}>
              <Pressable onPress={() => handleSortAction("cd")} style={{}}>
                <Text style={[styles(activeTheme,fontSizes).sheetSortTitle,
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


              <Pressable onPress={() => handleSortAction("wb")}>
                <Text style={[styles(activeTheme,fontSizes).sheetSortTitle,
                  sortObj.type === "wb" ? { color: activeTheme.appWhite } : {},
                ]}>{getLang(language, "AVAILABLE")} / </Text>
              </Pressable>

              <Pressable onPress={() => handleSortAction("am")}>
                <Text style={[styles(activeTheme,fontSizes).sheetSortTitle,

                  sortObj.type === "am" ? { color: activeTheme.appWhite } : {},
                ]}>{getLang(language, "TOTAL")}</Text>
              </Pressable>


            </View>


            <View style={[styles(activeTheme).sheetSortItem, {
              width: "40%",
              justifyContent: "flex-end",
              paddingRight: PADDING_H,
            }]}>

              {
                ["EstimatedTRY", "EstimatedBTC"].includes(sortObj.type) &&
                <TinyImage
                  style={styles(activeTheme).icon2}
                  parent={"rest/"} name={sortObj.direction === "desc" ? "arrow-up" : "arrow-down"} />

              }

              <Text style={styles(activeTheme,fontSizes).sheetSortTitle}>{getLang(language, "ESTIMATED_SHORT", "Est")}: </Text>


              <Pressable onPress={() => handleSortAction("EstimatedBTC")}>
                <Text style={[styles(activeTheme,fontSizes).sheetSortTitle,
                  sortObj.type === "EstimatedBTC" ? { color: activeTheme.appWhite } : {},
                ]}>BTC / </Text>
              </Pressable>


              <Pressable onPress={() => handleSortAction("EstimatedTRY")}>
                <Text style={[styles(activeTheme,fontSizes).sheetSortTitle,
                  sortObj.type === "EstimatedTRY" ? { color: activeTheme.appWhite } : {},
                ]}>TRY</Text>
              </Pressable>

            </View>


          </View>


          <View style={styles(activeTheme).searchContainer}>
            <View style={styles(activeTheme).searchIcon}>
              <TinyImage parent={'rest/'} name={'search'} style={styles(activeTheme).icon}/>
            </View>

            <TextInput
              keyboardAppearance={"dark"}

              style={styles(activeTheme).input}
              value={searchText}
              onChangeText={setSearchText}
              placeholder={getLang(language, "SEARCH")}
              autoFocus={false}
              autoCorrect={false}
              inputAccessoryViewID={"inputAccessoryViewID2"}
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
                    <TinyImage parent={'rest/'} name={'dismiss'} style={styles(activeTheme).icon}/>
                  </View>
                </Pressable> : null
            }

          </View>
        </View>
      </View>

      {/*<InputAccessory*/}
      {/*  isAddition={false}*/}
      {/*  stepAble={false}*/}
      {/*  mailProviders={localWallets}*/}
      {/*  isDelete={localWallets.length >= 1}*/}
      {/*  onDelete={onDeleteLocals}*/}
      {/*  onPress={setSearchText}*/}
      {/*/>*/}

    </>

  );
};

export default React.memo(WalletListHeader);
