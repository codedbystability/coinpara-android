import { getLang } from "../../../helpers/array-helper";

export const optionalConfigObject = (lang) => {
  return {
    title: "CoinPara",
    cancelText: getLang(lang, "CANCEL"),
    fallbackLabel: getLang(lang, "SHOW_PASSWORD"),
    unifiedErrors: false,// use unified error messages (default false)
    passcodeFallback: true, // if true is passed, itwill allow isSupported to return an error if the device is not enrolled in touch id/face id etc. Otherwise, it will just tell you what method is supported, even if the user is not enrolled.  (default false)
  };
};
export const inputs = [
  {
    id: 1,
    key: "email",
    value: "",
    type: "text",
    keyboardType: "email-address",
    placeholder: "YOUR_EMAIL_ADDRESS",
    autoComplete: "email",
    returnKey: "next",
    autoFocus: true,
    autoCapitalize: 'none',
    icon: null,
    textContentType: "emailAddress",
  },
  {
    id: 2,
    key: "password",
    value: "",
    type: "password",
    keyboardType: "default",
    placeholder: "YOUR_PASSWORD",
    autoCapitalize: 'none',
    autoComplete: "password",
    returnKey: "done",
    autoFocus: false,
    icon: "eye-close",
  },
];
