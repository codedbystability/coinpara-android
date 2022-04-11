import React, {useCallback, useEffect, useRef, useState} from "react";
import styledHigherOrderComponents from "../../../hocs/styledHigherOrderComponents";
import {
    Linking,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    BIG_TITLE_FONTSIZE, DRAW_VIEW,
    MARGIN_T,
    NORMAL_FONTSIZE,
    NORMAL_IMAGE,
    PADDING_H,
    PADDING_V,
    TITLE_FONTSIZE,
} from "../../../../utils/dimensions";
import {useDispatch, useSelector} from "react-redux";
import {getLang} from "../../../helpers/array-helper";
import CustomButton from "../../../components/button";
import userServices from "../../../services/user-services";
import FormInput from "../../../components/form-input";
import Clipboard from "@react-native-community/clipboard";
import BigInput from "../../../components/big-input";
import DropdownAlert from "../../../providers/DropdownAlert";
import QrCreateModalize from "../deposit-btc/read-qr";
import TabNavigationHeader from "../../../components/tab-navigation-header";
import ModalProvider from "../../../providers/ModalProvider";
import {replaceAll} from "../../../helpers/string-helper";
import {setUserVerifyType} from "../../../actions/auth-actions";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import TinyImage from "../../../tiny-image";

const TwoFactorAuthentication = (props) => {

    const dispatch = useDispatch();
    const {activeTheme, language} = useSelector(state => state.globalReducer);
    const {user} = useSelector(state => state.authenticationReducer);
    const [activeKey, setActiveKey] = useState("sms");
    const [serverActive, setServerActive] = useState("sms");
    const [code, setCode] = useState("");
    const [googleAuthKey, setGoogleAutKey] = useState("");
    const scrollRef = useRef(null);
    const authInputRef = useRef(null);

    // const [showQr, setShowQr] = useState("");
    const handleGoogleAuth = () => {
        if (serverActive === "sms") {
            userServices.activeGoogleAuth(code).then((response) => {
                if (response.IsSuccess) {
                    DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "TWO_FACTOR_UPDATED_SUCCESSFULLY"));
                    getSettings();
                }
            });
        } else {
            userServices.deActiveGoogleAuth(code).then((response) => {
                if (response.IsSuccess) {
                    DropdownAlert.show("success", getLang(language, "SUCCESS"), getLang(language, "TWO_FACTOR_UPDATED_SUCCESSFULLY"));
                    getSettings();
                }
            });
        }
    };

    const handlePaste = async () => setCode(await Clipboard.getString());

    const getSettings = () => {
        userServices.getSettings().then((response) => {
            if (response.IsSuccess) {
                if (response.Data.VerifySMS) {
                    dispatch(setUserVerifyType(1));

                    setServerActive("sms");
                    setActiveKey("sms");
                } else {
                    dispatch(setUserVerifyType(2));
                    setServerActive("authenticator");
                    setActiveKey("authenticator");

                    setTimeout(() => {
                        authInputRef.current?.focus();
                    }, 500);
                }
                setGoogleAutKey(response.Data.GoogleAuth);
            }
        });
    };

    const handleUserAction = (key) => {
        if (key === "copy") {
            Clipboard.setString(googleAuthKey);
            DropdownAlert.show("info", getLang(language, "SUCCESS"), getLang(language, "LINK_COPIED"));
        } else if (key === "qr") {
            ModalProvider.show(() => <QrCreateModalize qrValue={"otpauth://totp/CoinPara?secret=" + googleAuthKey}/>);
        }
    };

    useEffect(() => {
        getSettings();
    }, []);

    const yourAppName = "Coinpara";

    const handleOpenUrl = useCallback(async () => {
        Clipboard.setString(googleAuthKey);
        const androidUrl = "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US";
        const googleAuthUrl = `googleauthenticator://totp/${yourAppName}:${user.Email}?secret=${code}&issuer=${yourAppName}`;
        Linking.openURL(googleAuthUrl).catch(async () => {
            const supported = await Linking.canOpenURL(androidUrl);
            supported && await Linking.openURL(androidUrl);
        });
    }, []);
    return (
        <>
            <TabNavigationHeader
                {...props}
                backAble={true}
                options={{
                    title: getLang(language, "TWO_FACTOR_AUTHENTICATION"),
                }}
            />

            <KeyboardAwareScrollView
                ref={scrollRef}
                extraScrollHeight={100}
                enableAutomaticScroll={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles(activeTheme).container}>

                <Pressable
                    onPress={() => setActiveKey("sms")}
                    style={styles(activeTheme).item}>


                    <Text
                        style={[styles(activeTheme).title, {color: activeKey === "sms" ? activeTheme.appWhite : activeTheme.borderGray}]}>
                        {
                            getLang(language, "TWO_FACTOR_AUTH_TITLE")
                        }
                    </Text>

                    <View
                        style={[styles(activeTheme).drawView, {backgroundColor: activeKey === "sms" ? activeTheme.actionColor : activeTheme.borderGray}]}>

                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                            <View style={{marginRight: 20}}>
                                <TinyImage parent={"rest/"} name={"google-auth"} style={styles(activeTheme).icon}/>
                            </View>

                            <View style={styles(activeTheme).drawInner}>
                                <Text style={styles(activeTheme).firstText}>{getLang(language, "SMS")}</Text>
                                <Text
                                    style={styles(activeTheme).secondText}>{getLang(language, "SMS_CONFIRMATION")}</Text>
                                <Text
                                    style={styles(activeTheme).thirdText}>*********{user.Phone.substr(user.Phone.length - 4, user.Phone.length)}</Text>

                            </View>
                        </View>

                        {
                            activeKey === "sms" &&
                            <TinyImage parent={"rest/"} name={"success"} style={styles(activeTheme).icon}/>
                        }


                    </View>


                    <Text
                        style={[styles(activeTheme).title, {
                            marginBottom: 12,
                            color: activeKey === "sms" ? activeTheme.changeRed : activeTheme.secondaryText,
                        }]}>
                        {
                            getLang(language, "SMS_DESCRIPTION")
                        }
                    </Text>
                </Pressable>


                <Pressable onPress={() => setActiveKey("authenticator")} style={styles(activeTheme).item}>

                    <View
                        style={[styles(activeTheme).drawView, {backgroundColor: activeKey === "authenticator" ? activeTheme.actionColor : activeTheme.borderGray}]}>

                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <View style={{marginRight: 20}}>
                                <TinyImage parent={"settings/"} name={"two-factor"} style={styles(activeTheme).icon}/>
                            </View>

                            <View style={styles(activeTheme).drawInner}>

                                <Text style={styles(activeTheme).firstText}>
                                    {getLang(language, "AUTHENTICATOR")}
                                </Text>
                                <Text style={styles(activeTheme).secondText}>
                                    {getLang(language, "AUTHENTICATOR_CONFIRMATION")}
                                </Text>
                                <Text style={styles(activeTheme).thirdText}>
                                    {getLang(language, "ACTIVE")}
                                </Text>

                            </View>

                        </View>

                        {
                            activeKey === "authenticator" &&
                            <TinyImage parent={"rest/"} name={"success"} style={styles(activeTheme).icon}/>
                        }


                    </View>


                    <Text
                        style={[styles(activeTheme).title, {color: activeKey === "authenticator" ? activeTheme.appWhite : activeTheme.borderGray}]}>

                        {
                            getLang(language, "TWO_FACTOR_AUTH_DESCRIPTION")
                        }

                    </Text>


                    {
                        activeKey === "authenticator" && <>
                            <FormInput
                                ref={authInputRef}
                                placeholder={"ENTER_AUTHENTICATOR_CONFIRMATION"}
                                inputKey={"default"}
                                value={code}
                                keyboardType={"default"}
                                autoComplete={"off"}
                                returnKey={"done"}
                                autoFocus={false}
                                type={"text"}
                                onChange={(value) => setCode(value)}
                                icon={"copy"}
                                onIconPressed={handlePaste}
                                // parentOnFocus={handleScrollUp}
                            />

                            <BigInput
                                smallTitle={replaceAll(getLang(language, "FOR_MANUAL_SETUP"), "v1", getLang(language, "USE_THIS_CODE"))}
                                inputValue={googleAuthKey}
                                handleAction={handleUserAction}
                            />


                            <Pressable
                                onPress={handleOpenUrl}
                                style={{
                                    marginVertical: 20,
                                }}>
                                <Text style={[styles(activeTheme).desc2, {marginTop: 10}]}>
                                    {getLang(language, "OPEN_AUTHENTICATOR_APP")}
                                </Text>
                            </Pressable>


                            <CustomButton
                                onPress={handleGoogleAuth}
                                text={getLang(language, "CONTINUE")}
                                style={{
                                    marginVertical: 12,
                                    backgroundColor: activeTheme.actionColor,
                                    borderRadius: 6,
                                }}
                            />
                        </>
                    }

                </Pressable>

            </KeyboardAwareScrollView>

        </>
    );

};


const TwoFactorAuthenticationScreen = React.memo(styledHigherOrderComponents(TwoFactorAuthentication));
export default TwoFactorAuthenticationScreen;


const styles = (props) => StyleSheet.create({
    container: {
        paddingHorizontal: PADDING_H,
        paddingBottom: 120,
    },
    title: {
        fontFamily: "CircularStd-Book",
        fontSize: TITLE_FONTSIZE,
        lineHeight: 23,
        letterSpacing: 0,
        color: props.borderGray,

    },
    desc: {
        fontFamily: "CircularStd-Book",
        fontSize: NORMAL_FONTSIZE,
        lineHeight: 21,
        color: props.borderGray,
    },
    drawView: {
        height: DRAW_VIEW,
        width: "100%",
        borderRadius: 12,
        backgroundColor: props.darkBackground,
        marginVertical: MARGIN_T,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: PADDING_H,
    },
    drawInner: {
        paddingVertical: PADDING_V,
        height: "100%",
        justifyContent: "space-around",
    },
    firstText: {
        fontFamily: "CircularStd-Bold",
        fontSize: BIG_TITLE_FONTSIZE + 2,
        color: "#ffffff",
    },
    secondText: {
        fontFamily: "CircularStd-Book",
        fontSize: TITLE_FONTSIZE,
        lineHeight: 21,
        color: "#707a81",
    },
    thirdText: {
        fontFamily: "CircularStd-Book",
        fontSize: TITLE_FONTSIZE,
        lineHeight: 21,
        color: "#fff",
    },
    item: {
        marginVertical: MARGIN_T,
    },
    image: {
        width: NORMAL_IMAGE,
        height: NORMAL_IMAGE,
    },
    desc2: {
        fontFamily: "CircularStd-Book",
        color: props.appWhite,
        fontSize: TITLE_FONTSIZE,
        lineHeight: 23,
        letterSpacing: 0,
        textAlign: "center",
    },
    input: {
        marginVertical: 10,
        height: 40,
        paddingHorizontal: 10,
        color: props.appWhite,
        borderWidth: 1,
        borderColor: props.borderGray,
        borderRadius: 8,
    },
    icon: {
        width: 22,
        height: 22,
    },
});
